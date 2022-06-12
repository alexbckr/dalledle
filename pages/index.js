import Head from "next/head"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import WinOverlay from "../components/WinOverlay"
import StatsOverlay from "../components/StatsOverlay"
import DirectionsOverlay from "../components/DirectionsOverlay"
import { prisma } from "../lib/prisma.js"
import { useState, useEffect } from "react"
import parse from "html-react-parser"

export const getServerSideProps = async () => {
   var date = new Date()
   var year = date.getFullYear()
   var day = date.getDate()
   var month = date.getMonth() + 1

   day = day < 10 ? "0" + day : day
   month = month < 10 ? "0" + month : month

   var isoDate = year + "-" + month + "-" + day

   const image = await prisma.image.findUnique({
      where: {
         date: isoDate,
      },
   })

   if (image.createdAt !== null) {
      image.createdAt = image.createdAt.toString()
   }
   if (image.updatedAt !== null) {
      image.updatedAt = image.updatedAt.toISOString()
   }

   var initialState = ""

   for (var i = 0; i < image.text_description.length; i++) {
      if (image.text_description.charAt(i) !== " ") {
         initialState += "_"
      } else {
         initialState += " "
      }
   }

   image.initialState = initialState
   const sd = image.text_description.toUpperCase().split(" ")
   image.split_description = sd

   return {
      props: image,
   }
}

export default function Home(props) {
   const [solved, setSolved] = useState(false)
   const [display, setDisplay] = useState(props.initialState)
   const [guesses, setGuesses] = useState([])
   const [overlayVisible, setOverlayVisible] = useState(false)
   const [winVisible, setWinVisible] = useState(false)
   const [statsVisible, setStatsVisible] = useState(false)
   const [directionsVisible, setDirectionsVisible] = useState(false)
   const [loading, setLoading] = useState(false)

   function handleGuess(guess) {
      for (var i = 0; i < guesses.length; i++) {
         console.log("guesses[" + i + "]: " + guesses[i].text)
      }
      setLoading(true)
      // some random stuff you could catch
      if (
         guess === null ||
         guess.toString().trim() === "" ||
         solved === true ||
         guess.toString().split(" ").length > 20
      ) {
         return -1
      }

      document.getElementById("guess").value = ""

      // here's a bit
      var semanticSimilarity = 0.8
      let currentGuessCombo = {
         key: guesses.length + 1,
         text: guess,
         semanticSimilarity: semanticSimilarity,
         colors: [],
      }

      var splitGuess_noUpper = guess.split(" ")
      var splitGuess = guess.toUpperCase().split(" ")
      // console.log("splitGuess: " + splitGuess)
      // console.log("props.split_description: " + props.split_description)

      for (var i = 0; i < splitGuess.length; i++) {
         const relevantWord = splitGuess[i]
         console.log("relevantWord: " + relevantWord)
         const locInDesc = props.split_description.indexOf(relevantWord)
         console.log("locInDesc: " + locInDesc)

         if (locInDesc !== -1) {
            // console.log("this item is in the description")
            if (locInDesc === i) {
               //  console.log("guess index is correct, too (i is " + i + ")")
               currentGuessCombo.colors.push("#6aaa64")
            } else {
               currentGuessCombo.colors.push("#c9b458")
            }
         } else {
            currentGuessCombo.colors.push("#787c7e")
         }
      }

      // console.log("colors: " + currentGuessCombo.colors)

      var html = "<p>"
      for (var i = 0; i < currentGuessCombo.colors.length; i++) {
         html +=
            '<span style="color: ' +
            currentGuessCombo.colors[i] +
            '">' +
            splitGuess_noUpper[i] +
            "</span>"
         if (i < currentGuessCombo.colors.length - 1) {
            html += " "
         }
      }
      html += "</p>"
      currentGuessCombo.html = html

      setGuesses((guesses) => [...guesses, currentGuessCombo])

      // is this the right semantic similarity to compare to?
      if (
         guess.toUpperCase() === props.text_description.toUpperCase() ||
         semanticSimilarity > 0.98
      ) {
         setLoading(false)
         setSolved(true)
         handleSolve()
         return
      }
      setLoading(false)
      return
   }

   function handleSolve() {
      console.log("puzzle solved")
      setDisplay(props.text_description)
      setSolved(true)
      document.getElementById("guess").disabled = true
      document.getElementById("vg").disabled = true
      setStatsVisible(false)
      setDirectionsVisible(false)
      setWinVisible(true)
      setOverlayVisible(true)
   }

   function handleStatsClick() {
      setOverlayVisible(true)
      setDirectionsVisible(false)
      setWinVisible(false)
      setStatsVisible(true)
   }

   function handleDirectionsClick() {
      setOverlayVisible(true)
      setWinVisible(false)
      setDirectionsVisible(true)
      setStatsVisible(false)
   }

   // prereq: guess should be string
   function getSemanticSimilarity(guess) {
      // this is what the API returns when two texts match
      const perfect = 200000

      if (guess === null || guess.toString().trim() === "") {
         return -1
      }

      const encodedParams = new URLSearchParams()
      encodedParams.append("text1", guess)
      encodedParams.append("text2", props.text_description)

      const url =
         "https://twinword-text-similarity-v1.p.rapidapi.com/similarity/"

      const options = {
         method: "POST",
         headers: {
            "content-type": "application/x-www-form-urlencoded",
            "X-RapidAPI-Key": process.env.RAPID_API_KEY,
            "X-RapidAPI-Host": "twinword-text-similarity-v1.p.rapidapi.com",
         },
         body: encodedParams,
      }

      fetch(url, options)
         .then((res) => res.json())
         .then((json) => console.log(json))
         .catch((err) => console.error("error:" + err))
   }

   return (
      <>
         {overlayVisible && (
            <div
               className={styles.overlayContainer}
               onClick={() => setOverlayVisible(false)}
            >
               {winVisible && (
                  <WinOverlay guessNum={guesses.length} imageUrl={props.url} />
               )}
               {statsVisible && <StatsOverlay />}
               {directionsVisible && (
                  <DirectionsOverlay dismiss={() => setOverlayVisible(false)} />
               )}
            </div>
         )}
         <div className={styles.container}>
            <Head>
               <title>DALL-Edle</title>
               <meta name="description" content="Inspired by DALL-E" />
               <link rel="icon" href="/favicon.ico" />
               {/* Global Site Tag (gtag.js) - Google Analytics */}
               <script
                  async
                  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
               />
               <script
                  dangerouslySetInnerHTML={{
                     __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
                  }}
               />
            </Head>

            <Header
               handleStatsClick={handleStatsClick}
               handleDirectionsClick={handleDirectionsClick}
            />

            <main
               className={styles.main}
               onKeyPress={(e) =>
                  e.key === "Enter" &&
                  handleGuess(document.getElementById("guess").value)
               }
            >
               <div className={styles.game}>
                  <img
                     draggable="false"
                     className={styles.mainImage}
                     src={props.url}
                  ></img>
                  <div
                     className={solved ? styles.displaySolved : styles.display}
                  >
                     {display}
                  </div>
                  <div className={styles.inputSection}>
                     <input className={styles.inputBox} id="guess"></input>
                     <div
                        className={styles.enterButton}
                        id="vg"
                        onClick={() =>
                           handleGuess(document.getElementById("guess").value)
                        }
                     >
                        ENTER
                     </div>
                  </div>
                  {guesses.length !== 0 && (
                     <table className={styles.table}>
                        <thead>
                           <tr>
                              <th className={styles.tableGuessNum}>#</th>
                              <th className={styles.tableText}>Text</th>
                              <th className={styles.tableSemanticSimilarity}>
                                 SS (?)
                              </th>
                           </tr>
                        </thead>
                        <tbody>
                           {guesses
                              .map((guess, key) => (
                                 <tr key={key}>
                                    <td className={styles.tableGuessNum}>
                                       {guess.key}
                                    </td>
                                    <td className={styles.tableText}>
                                       {parse(guess.html)}
                                    </td>
                                    <td
                                       className={
                                          styles.tableSemanticSimilarityTable
                                       }
                                    >
                                       {guess.semanticSimilarity}
                                    </td>
                                 </tr>
                              ))
                              .reverse()}
                        </tbody>
                     </table>
                  )}
               </div>
            </main>
         </div>
      </>
   )
}
