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
                  <div
                     className={styles.yesterday}
                     onClick={() => Router.push("/yesterday")}
                  >
                     Yesterday's
                  </div>
                  <div
                     className={styles.navbarButton}
                     onClick={() => props.handleStatsClick()}
                  >
                     Stats
                  </div>
               </div>
            </div>
         ) : (
            <div className={styles.headerContainer}>
               {/* this appears if we're on yesterday's or archived (because props.handleDirectionsClick is undefined)  */}
               <div className={styles.leftSM}>
               </div>
               <div onClick={() => Router.push("/")} className={styles.logo}>
                  {/* this is another operatror that decides whether to put yesterdays before or archive after */}
                  {props.title === "Yesterday's" ? (
                     <span>Yesterday's </span>
                  ) : (
                     ""
                  )}
                  DALL-Edle
                  {props.title === "Archive" ? <span> Archive</span> : ""}
               </div>
               <div className={styles.rightSM}>
                  <div
                        className={styles.yesterday}
                        onClick={() => Router.push("/")}
                     >
                        {props.title === "Yesterday's" ? (
                           <span> Today's</span>
                        ) : (
                           ""
                        )}
                  </div>
               </div>
            </div>
         )}
      </div>
   )
}
