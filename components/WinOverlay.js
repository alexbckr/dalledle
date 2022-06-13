import styles from "../styles/Overlays.module.css"

export default function WinOverlay(props) {
   function getDate() {
      var date = new Date()
      var year = date.getFullYear()
      var day = date.getDate()
      var month = date.getMonth() + 1

      var isoDate = month + "/" + day + "/" + year

      return isoDate
   }

   function CopyToClipboard(text) {
        navigator.clipboard.writeText(text);
        alert("Copied to clipbaord!")
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
            <img src={props.imageUrl} className={styles.image}></img>
            <div
               className={styles.shareButton}
               onClick={() => CopyToClipboard("hello world copied! alex b")}
            >
               Share
            </div>
         </div>
      </div>
   )
}
