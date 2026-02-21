import Router from "next/router"
import styles from "../styles/Header.module.css"

export default function Header(props) {
   return (
      <div className={styles.header}>
         {/* this appears if we're on the home page (bc it's the header with directions, FAQ, and stats) yes. there's a better way to do this, I'll fix it later  */}
         {props.handleDirectionsClick ? (
            <div className={styles.headerContainer}>
               <div className={styles.left}>
                  <div
                     className={styles.navbarButton}
                     onClick={() => props.handleDirectionsClick()}
                  >
                     Help
                  </div>
                  <div
                     className={styles.faqButton}
                     onClick={() => props.handleFAQClick()}
                  >
                     FAQ
                  </div>
               </div>
               <div className={styles.logo}>DALL-Edle</div>
               <div className={styles.right}>
               </div>
            </div>
         ) : (
            <div className={styles.headerContainer}>
               <div className={styles.leftSM}>
               </div>
               <div onClick={() => Router.push("/")} className={styles.logo}>
                  DALL-Edle
                  {props.title === "Archive" ? <span> Archive</span> : ""}
               </div>
               <div className={styles.rightSM}>
                  <div className={styles.yesterday}></div>
               </div>
            </div>
         )}
      </div>
   )
}
