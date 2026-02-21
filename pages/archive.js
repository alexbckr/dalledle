import styles from "../styles/Archive.module.css"
import { getArchiveImages } from "../lib/archiveData"
import Head from "next/head"
import ArchiveCard from "../components/ArchiveCard"

export const getServerSideProps = async () => {
   var data = await getArchiveImages()

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
