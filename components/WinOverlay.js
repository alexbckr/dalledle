import { useEffect } from "react";
import styles from "../styles/Overlays.module.css"

export default function WinOverlay(props) {

   function getDate() {
      if (props.date === null || props.date == undefined) {
        return "";
      }
      var date_array = props.date.split("-")
      var isoDate = Number(date_array[1]) + "/" + Number(date_array[2]) + "/" + date_array[0]
      return isoDate
   }

   return (
      <div className={styles.winOverlayContainer}>
         <div className={styles.winContainer}>
            <h1 className={styles.header}>Woooo!</h1>
            <p>
               You solved DALL-Edle on {getDate()}. It took{" "}
               {props.guessNum +
                  " " +
                  (props.guessNum === 1 ? "guess." : "guesses.")}
            </p>
            <p className={styles.watermark}>dalledle.com</p>
            <img src={props.imageUrl} className={styles.image}></img>
            <div
               className={styles.shareButton}
               onClick={() => {
                navigator.clipboard.writeText("I solved the DALL-Edle " + getDate() + " puzzle in " + (props.guessNum) + (props.guessNum === 1 ? " guess." : " guesses.") + " http://dalledle.com")
                .then(() => {
                  alert("Copied to clipboard!");
                })
                .catch(() => {
                  alert("Couldn't copy. Not sure why :(");
                });
                }}
            >
               Share
            </div>
            <div onClick={() => props.dismiss()} className={styles.closeButton}>Close</div>
         </div>
      </div>
   )
}
