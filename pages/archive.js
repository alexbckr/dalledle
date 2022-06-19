import Header from "../components/Header"
import styles from "../styles/Archive.module.css"
import { useEffect, useState } from "react"
import { prisma } from "../lib/prisma"
import ArchiveCard from "../components/ArchiveCard"

export const getServerSideProps = async () => {
   var data = await prisma.image.findMany({ where: { past: true } })

   data.map((image) => {
      if (image.createdAt !== null) {
         image.createdAt = image.createdAt.toString()
      }
      if (image.updatedAt !== null) {
         image.updatedAt = image.updatedAt.toString()
      }

      image.url =
         "https://dalledle-images.s3.us-east-2.amazonaws.com/" +
         image.text_description.toLowerCase().replace(/ /g, "_") +
         ".jpg"
   })

   console.log("data", JSON.stringify(data))
   data = JSON.parse(JSON.stringify(data))

   data = data?.sort((a, b) => b.date?.localeCompare(a.date))

   return { props: { images: data } }
}

export default function Archive(props) {
   return (
      <>
         <Head>
               <title>DALL-Edle / Archive</title>
               <meta name="description" content="Past DALL-Edle images." />
               <link rel="icon" href="/favicon.ico" />
            </Head>
         <Header title={"Archive"}/>
         <div className={styles.container}>
            <div className={styles.content}>
               {props.images.map((image) => {
                  return (<ArchiveCard image={image} key={image.id} />)
               })}
            </div>
         </div>
      </>
   )
}
