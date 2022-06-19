import Header from "./Header"
import { useState } from "react"
import styles from "../styles/Home.module.css"
import DirectionsOverlay from "./DirectionsOverlay"
import FAQOverlay from "./FAQOverlay"
import StatsOverlay from "./StatsOverlay"
import WinOverlay from "./WinOverlay"
import Footer from "./Footer"
import { useRouter } from 'next/router'

export default function Layout({ children }) {
   const router = useRouter();
   const [overlayVisible, setOverlayVisible] = useState(router.pathname === '/')
   const [winVisible, setWinVisible] = useState(false)
   const [statsVisible, setStatsVisible] = useState(false)
   const [directionsVisible, setDirectionsVisible] = useState(router.pathname === '/')

   const [faqVisible, setFAQVisible] = useState(false)

   function handleStatsClick() {
      setDirectionsVisible(false)
      setWinVisible(false)
      setFAQVisible(false)
      setOverlayVisible(true)
      setStatsVisible(true)
   }

   function handleDirectionsClick() {
      setOverlayVisible(true)
      setWinVisible(false)
      setDirectionsVisible(true)
      setStatsVisible(false)
      setFAQVisible(false)
   }

   function handleFAQClick() {
      setWinVisible(false)
      setStatsVisible(false)
      setDirectionsVisible(false)
      setFAQVisible(true)
      setOverlayVisible(true)
   }

   function handleCloseDirections() {
      document.getElementById("guess").focus()
   }

   return (
      <>
         {overlayVisible && (
            <div
               className={styles.overlayContainer}
               onClick={() => {
                  if (!winVisible && !faqVisible) {
                     setOverlayVisible(false)
                  }
               }}
            >
               {winVisible && (
                  <WinOverlay
                     guessNum={guesses.length}
                     imageUrl={props.url}
                     date={props.dateStamp}
                     dismiss={() => {
                        setOverlayVisible(false)
                        setWinVisible(false)
                     }}
                  />
               )}
               {statsVisible && (
                  <StatsOverlay
                     stats={JSON.parse(
                        localStorage.getItem("dalledle_statistics")
                     )}
                  />
               )}
               {faqVisible && (
                  <FAQOverlay
                     dismiss={() => {
                        setOverlayVisible(false)
                        setFAQVisible(false)
                     }}
                  />
               )}
               {directionsVisible && (
                  <DirectionsOverlay
                     dismiss={() => {
                        setOverlayVisible(false)
                        handleCloseDirections()
                     }}
                  />
               )}
            </div>
         )}
         <div>
            <Header
               handleStatsClick={(router.pathname === "/") ? handleStatsClick : null}
               handleDirectionsClick={(router.pathname === "/") ? handleDirectionsClick : null}
               handleFAQClick={(router.pathname === "/") ? handleFAQClick : null}
               title={router.pathname === "/" ? "DALL-Edle" : (router.pathname === "/yesterday" ? "Yesterday's" : "Archive")}
            />
            <main>{children}</main>
            <Footer />
         </div>
      </>
   )
}
