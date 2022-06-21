import styles from "../styles/Home.module.css"
import { useEffect, useState } from "react"

export default function Counter(props) {
   const [countdown, setCountdown] = useState(-1)

   useEffect(() => {
      console.log("useeffect run")
      var now = new Date()
      var then = new Date(
         now.getFullYear(),
         now.getMonth(),
         now.getDate(),
         0,
         0,
         0
      )
      var j = now.getTime() - then.getTime()
      console.log("difference is " + j)

      var myfunc = setInterval(function () {
         j = j - 1000
         setCountdown(j)

         if (j <= 0) {
            clearInterval(myfunc)
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
      <div className={styles.counter}>
         <div>Next DALL-Edle in: {formatMS(countdown)}</div>
      </div>
   )
}
