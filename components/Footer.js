import Router from "next/router";
import styles from "../styles/Footer.module.css"
import { useState } from "react"

export default function Footer(props) {

   return (
      <div className={styles.container}>
         {/* <img onClick={() => {
                navigator.clipboard.writeText("alexbecker@virginia.edu")
                .then(() => {
                  alert("Email (alexbecker@virginia.edu) copied to clipboard!");
                })
                .catch(() => {
                  alert("Couldn't copy. Not sure why :(");
                });
                }} className={styles.email} src="/email.png"></img>
         <img onClick={() => {window.open("https://www.twitter.com/alexofbecker", "_blank")} } className={styles.twtr} src="/twitter-logo-2429.png"></img>
         <img onClick={() => {window.open("https://www.buymeacoffee.com/alexbecker", "_blank")} } className={styles.bmc} src="/bmc-full-logo-no-background.png"></img> */}

         <div onClick={() => {
                navigator.clipboard.writeText("alexbecker@virginia.edu")
                .then(() => {
                  alert("Email (alexbecker@virginia.edu) copied to clipboard!");
                })
                .catch(() => {
                  alert("Couldn't copy. Not sure why :(");
                });
                }}>📧</div>

         <div onClick={() => {window.open("https://www.twitter.com/alexofbecker", "_blank")} }>🐦</div>
         {/* <div onClick={() => {window.open("https://www.buymeacoffee.com/alexbecker", "_blank")} }>☕</div> */}
         <img onClick={() => {window.open("https://www.buymeacoffee.com/alexbecker", "_blank")} } className={styles.bmc} src="/bmc-full-logo-no-background.png"></img>
      </div>
   )
}
