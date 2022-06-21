import styles from "../styles/Home.module.css"
import { useEffect, useState } from "react"

export default function Counter(props) {
   const [countdownText, setCountdownText] = useState("")

   useEffect(() => {
      // Set the date we're counting down to
      var countDownDate = props.nextImage.getTime()
      var x = setInterval(function () {
         // Get today's date and time
         var now = new Date().getTime()

         var distance = countDownDate - now

         setCountdownText(formatMS(distance))

         if (distance < 0) {
            clearInterval(x)
            setCountdownText("Refresh for the new DALLE-dle!")
         }
      }, 1000)
   }, [])

   function formatMS(ms) {
      var result =
         Math.floor(ms / (1000 * 60 * 60)) +
         "h " +
         (Math.floor(ms / (1000 * 60)) % 60) +
         "m " +
         (Math.floor(ms / 1000) % 60) +
         "s"
      return result
   }

   return (
        <div className={styles.counter}>Next DALL-Edle in {countdownText === "" ? "__h __m __s" : countdownText}</div>
   )
}
