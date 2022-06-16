import Router from "next/router";
import styles from "../styles/Footer.module.css"

export default function Footer(props) {
   return (
      <div className={styles.container}>
         <p>alexbecker@virginia.edu</p>
         <img className={styles.bmc} src="/bmc-full-logo-no-background.png"></img>
      </div>
   )
}
