import fs from "fs"
import path from "path"

export default function handler(req, res) {
   if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

   const { caption, url } = req.body
   if (!caption || !url) return res.status(400).json({ error: "Missing fields" })

   const filePath = path.join(process.cwd(), "data", "images.json")
   let images = []
   if (fs.existsSync(filePath)) {
      images = JSON.parse(fs.readFileSync(filePath, "utf8"))
   }

   images.push({
      id: Date.now().toString(),
      text_description: caption,
      image_path: url,
      date: new Date().toISOString().split("T")[0],
      plays: 0,
      solves: 0,
      past: true
   })

   fs.writeFileSync(filePath, JSON.stringify(images, null, 2))
   res.status(200).json({ ok: true })
}
