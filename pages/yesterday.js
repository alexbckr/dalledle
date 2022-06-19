import Header from "../components/Header"
import styles from "../styles/Archive.module.css"
import { useEffect, useState } from "react"
import { prisma } from "../lib/prisma"
import ArchiveCard from "../components/ArchiveCard"
import Head from "next/head"

export const getServerSideProps = async () => {
   var isoDate = new Date()
   isoDate.setDate(isoDate.getDate() - 1) // yesterday
   isoDate = isoDate.toISOString().split("T")[0]

   const image = await prisma.image.findUnique({
      where: {
         date: isoDate,
      },
   })

   if (image.createdAt !== null) {
      image.createdAt = image.createdAt.toString()
   }
   if (image.updatedAt !== null) {
      image.updatedAt = image.updatedAt.toISOString()
   }

   var image_url =
      "https://dalledle-images.s3.us-east-2.amazonaws.com/" +
      image.text_description.toLowerCase().replace(/ /g, "_") +
      ".jpg"
   image.url = image_url

   return { props: image }
}

export default function Archive(props) {
   return (
      <>
         <Head>
               <title>DALL-Edle / Yesterday's</title>
               <meta name="description" content="Yesterday's DALL-Edle solution." />
               <link rel="icon" href="/favicon.ico" />
            </Head>
         <Header title={"Yesterday's"}/>
         <div className={styles.container}>
            <div className={styles.content}>
               <ArchiveCard image={props} key={props.id} />
            </div>
         </div>
      </>
   )
}
