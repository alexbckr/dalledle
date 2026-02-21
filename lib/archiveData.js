import fs from "fs"
import path from "path"

const imagesFilePath = path.join(process.cwd(), "data", "images.json")
const s3ListUrl =
  "https://dalledle-images.s3.us-east-2.amazonaws.com/?list-type=2"

function normalizeImage(image) {
  const text = image.text_description || ""
  const imageUrl = image.image_path
    ? image.image_path
    : "https://dalledle-images.s3.us-east-2.amazonaws.com/" +
      text.toLowerCase().replace(/ /g, "_") +
      ".jpg"

  return {
    ...image,
    text_description: text,
    url: imageUrl,
  }
}

function parseXmlTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`))
  return match ? match[1] : ""
}

function humanizeKey(key) {
  return key
    .replace(/\.jpg$/i, "")
    .replace(/[_-]+/g, " ")
    .trim()
}

async function getImagesFromS3() {
  try {
    const response = await fetch(s3ListUrl)
    if (!response.ok) {
      return []
    }

    const xml = await response.text()
    const contents = xml.match(/<Contents>[\s\S]*?<\/Contents>/g) || []

    return contents
      .map((block) => {
        const key = parseXmlTag(block, "Key")
        const lastModified = parseXmlTag(block, "LastModified")

        if (!key || !/\.jpg$/i.test(key)) {
          return null
        }

        return {
          id: key,
          key,
          text_description: humanizeKey(key),
          date: (lastModified || "").split("T")[0] || "",
          source: "S3",
          source_user: "",
          plays: "N/A",
          solves: "N/A",
          unique_visits: "N/A",
          unique_plays: "N/A",
          unique_solves: "N/A",
          return_visits: "N/A",
          return_plays: "N/A",
          return_solves: "N/A",
          past: true,
          url: "https://dalledle-images.s3.us-east-2.amazonaws.com/" + key,
        }
      })
      .filter(Boolean)
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
  } catch (error) {
    return []
  }
}

function getImagesFromFile() {
  if (!fs.existsSync(imagesFilePath)) {
    return []
  }

  const raw = fs.readFileSync(imagesFilePath, "utf8")
  const parsed = JSON.parse(raw)

  if (!Array.isArray(parsed)) {
    return []
  }

  return parsed.map(normalizeImage)
}

export async function getAllImages() {
  const s3Images = await getImagesFromS3()
  if (s3Images.length > 0) {
    return s3Images
  }

  return getImagesFromFile()
}

export async function getImageByDate(date) {
  const images = await getAllImages()
  return images.find((image) => image.date === date) || null
}

export async function getArchiveImages() {
  const images = await getAllImages()
  return images
    .filter((image) => image.past)
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
}

export async function getImageForToday() {
  const images = await getAllImages()
  if (images.length === 0) {
    return null
  }

  const today = new Date().toISOString().split("T")[0]
  const seed = today.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  const index = seed % images.length
  return images[index]
}
