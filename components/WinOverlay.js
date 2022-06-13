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
                navigator.clipboard.writeText("I solved the DALL-Edle 6/12/2022 puzzle in " + (props.guessNum) + (props.guessNum === 1 ? " guess." : " guesses.") + " http://dalledle.com")
                }}
            >
               Share
            </div>
            <div onClick={() => props.dismiss()} className={styles.closeButton}>Close</div>
         </div>
      </div>
   )
}
