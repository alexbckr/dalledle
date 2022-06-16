import { useState } from "react"
import styles from "../styles/Archive.module.css"

export default function ArchiveCard(props) {
   const [showCaption, setShowCaption] = useState(false)
   const [key, setKey] = useState("")

   return (
      <div key={props.image.id}>
         <h4 className={styles.dateLabel}>
            {props.image.date}
            <span className={styles.stats}>{isNaN(props.image.plays)
               ? ""
               : " • " + (
                    (Number(props.image.solves) / Number(props.image.plays)) *
                    100
                 ).toFixed(0) + "% solve rate"}</span>
         </h4>
         <h2
            className={
               showCaption === true && key === props.image.id
                  ? styles.caption
                  : styles.captionHidden
            }
            onMouseEnter={() => {
               setShowCaption(true)
               setKey(props.image.id)
               console.log("mouse enter")
               console.log("show caption", showCaption)
               console.log("key", key)
            }}
            onMouseLeave={() => {
               setShowCaption(false)
               setKey("")
               console.log("mouse leave")
               console.log("show caption", showCaption)
               console.log("key", key)
            }}
            key={props.image.id}
         >
            {showCaption === true && key === props.image.id
               ? props.image.text_description
               : "Hover for caption"}
         </h2>
         <img
            draggable="false"
            className={styles.image}
            src={props.image.url}
         ></img>
      </div>
   )
}
