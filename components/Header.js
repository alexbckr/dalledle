import Router from "next/router";
import styles from "../styles/Header.module.css"

export default function Header(props) {
   return (
      <div className={styles.header}>
         {props.handleDirectionsClick ? (
            <div className={styles.headerContainer}>
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
               <div className={styles.logo}>DALL-Edle</div>
               <div className={styles.dummyButton}>FAQ</div>
               <div
                  className={styles.navbarButton}
                  onClick={() => props.handleStatsClick()}
               >
                  Stats
               </div>
            </div>
         ) : (
            <div><div onClick={() => Router.push("/") } className={styles.logo}>{props.title === "Yesterday's" ? <span>Yesterday's{" "}</span> : ""}DALL-Edle{props.title === "Archive" ? <span>{" "}Archive</span> : ""}</div></div>
         )}
      </div>
   )
}
