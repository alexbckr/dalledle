import Header from "./Header"
import { useState, Children, cloneElement } from "react"
import styles from "../styles/Home.module.css"
import DirectionsOverlay from "./DirectionsOverlay"
import FAQOverlay from "./FAQOverlay"
import StatsOverlay from "./StatsOverlay"
import WinOverlay from "./WinOverlay"
import Footer from "./Footer"
import { useRouter } from "next/router"

export default function Layout({ children }) {
   const router = useRouter()
   const [overlayVisible, setOverlayVisible] = useState(router.pathname === "/")
   const [winVisible, setWinVisible] = useState(false)
   const [statsVisible, setStatsVisible] = useState(false)
   const [numGuesses, setNumGuesses] = useState("")
   const [imgUrl, setImgUrl] = useState("")
   const [dateStamp, setDateStamp] = useState("")
   const [directionsVisible, setDirectionsVisible] = useState(
      router.pathname === "/"
   )

   // probably not great


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

   const childrenWithProps = Children.map(children, (child) =>
      cloneElement(child, {
         setDirectionsVisible: setDirectionsVisible,
         setWinVisible: setWinVisible,
         setOverlayVisible: setOverlayVisible,
         setNumGuesses: setNumGuesses,
         setImgUrl: setImgUrl,
         setDateStamp: setDateStamp,
      })
   )

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
                     guessNum={numGuesses}
                     imageUrl={imgUrl}
                     date={dateStamp}
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
               handleStatsClick={
                  router.pathname === "/" ? handleStatsClick : null
               }
               handleDirectionsClick={
                  router.pathname === "/" ? handleDirectionsClick : null
               }
               handleFAQClick={router.pathname === "/" ? handleFAQClick : null}
               title={
                  router.pathname === "/"
                     ? "DALL-Edle"
                     : router.pathname === "/yesterday"
                     ? "Yesterday's"
                     : "Archive"
               }
            />
            <main>{childrenWithProps}</main>
            <Footer />
         </div>
      </>
   )
}
