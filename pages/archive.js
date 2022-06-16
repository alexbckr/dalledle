import Header from "../components/Header"
import styles from "../styles/Archive.module.css"
import { useEffect, useState } from "react"
import { prisma } from "../lib/prisma"

export const getServerSideProps = async () => {
   var data = await prisma.image.findMany({ where: { past: true } })

   data.map((image) => {
      if (image.createdAt !== null) {
         image.createdAt = image.createdAt.toString()
      }
      if (image.updatedAt !== null) {
         image.updatedAt = image.updatedAt.toString()
      }

      image.url = "https://dalledle-images.s3.us-east-2.amazonaws.com/" + image.text_description.toLowerCase().replace(/ /g, "_") + ".jpg"
      image.date_string = image.date
   })



   console.log("data", JSON.stringify(data))
   data = JSON.parse(JSON.stringify(data))

   data = data?.sort((a, b) => b.date?.localeCompare(a.date))

   return { props: { images: data } }
}

export default function Archive(props) {

   const [showCaption, setShowCaption] = useState(false)
   const [key, setKey] = useState("")


   useEffect(() => {
      console.log("props", props)
   }, [])

   return (
      <>
         <Header />
         <div className={styles.container}>
            <div className={styles.content}>
               {props.images.map((image) => {
                  return (
                     <div key={image.id}>

                        <h4 className={styles.dateLabel}>{image.date_string} <span className={styles.watermark}>• dalledle.com</span></h4>
                        <h2 
                        className={(showCaption === true && key === image.id) ? styles.caption : styles.captionHidden}
                        onMouseEnter={() => {
                           setShowCaption(true)
                           setKey(image.id)
                           console.log("mouse enter")
                           console.log("show caption", showCaption)
                           console.log("key", key)
                        }} onMouseLeave={() => {
                           setShowCaption(false)
                           setKey("")
                           console.log("mouse leave")
                           console.log("show caption", showCaption)
                           console.log("key", key)
                        }} key={image.id}>{(showCaption === true && key === image.id) ? image.text_description : "Hover for caption"}</h2>
                        <img
                           draggable="false"
                           className={styles.image}
                           src={image.url}
                        ></img>
                     </div>
                  )
               })}
            </div>
         </div>
      </>
   )
}
