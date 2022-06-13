import Head from "next/head"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import WinOverlay from "../components/WinOverlay"
import StatsOverlay from "../components/StatsOverlay"
import DirectionsOverlay from "../components/DirectionsOverlay"
import FAQOverlay from "../components/FAQOverlay"
import { prisma } from "../lib/prisma.js"
import { useState, useEffect } from "react"
import parse from "html-react-parser"
import * as gtag from "../lib/gtag"

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
   image.dateStamp = isoDate

   return {
      props: image,
   }
}

export default function Home(props) {
   const [solved, setSolved] = useState(false)
   const [display, setDisplay] = useState(props.initialState)
   const [guesses, setGuesses] = useState([])
   const [overlayVisible, setOverlayVisible] = useState(true)
   const [winVisible, setWinVisible] = useState(false)
   const [statsVisible, setStatsVisible] = useState(false)
   const [directionsVisible, setDirectionsVisible] = useState(true)
   const [faqVisible, setFAQVisible] = useState(false)
   const [loading, setLoading] = useState(false)

   // runs onload
   useEffect(() => {
      gtag.pageview("/")
      var resetOnRefresh = false
      const dalledle_state = localStorage.getItem("dalledle_state")
      if (!dalledle_state || resetOnRefresh) {
         // no local storage found
         initiateLocalStorage()
      } else {
         console.log("local storage found")
         var parsed = JSON.parse(dalledle_state)
         console.log("game status: ",parsed.gameStatus)

         // TODO: check if game state needs to be reset

         console.log(
            "props.datestamp (the date of the image: ",
            props.dateStamp
         )
         console.log("parsed.datestamp (their last play): ", parsed.dateStamp)

         if (props.dateStamp !== parsed.dateStamp) {
            newPuzzleResetState(parsed.lastCompleted, parsed.lastPlayed)
         } else {
            if (parsed.gameStatus === "IN_PROGRESS") {
               console.log("game in progress")
               setOverlayVisible(false)
               setDirectionsVisible(false)
               console.log("parsed guesses: ", parsed.guesses)
               setGuesses(parsed.guesses)
            } else if (parsed.gameStatus === "SOLVED") {
               console.log("game solved")
               setGuesses(parsed.guesses)
               handleSolve()
            }
         }
      }
   }, [])

   useEffect(() => {
      if (guesses.length > 0) {
         const dalledle_state = localStorage.getItem("dalledle_state")
         if (dalledle_state) {
            var parsed = JSON.parse(dalledle_state)
            parsed.guesses = guesses
            localStorage.setItem("dalledle_state", JSON.stringify(parsed))
         }
      }
   }, [guesses])

   const incrementPlays = async () => {
      const body = { date: props.dateStamp }

      console.log("incrementing where body datestamp is ", props.dateStamp)

      try {
         await fetch("/api/increment_plays", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
         })
      } catch (error) {
         console.error(error)
      }
   }

   const incrementSolves = async () => {
      const body = { date: props.dateStamp }

      console.log("incrementing where body datestamp is ", props.dateStamp)

      try {
         await fetch("/api/increment_solves", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
         })
      } catch (error) {
         console.error(error)
      }
   }

   const incrementUniqueUsers = async () => {
      console.log("inc unique users")
      const body = {}
      try {
         await fetch("/api/increment_unique_users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
         })
      } catch (error) {
         console.error(error)
      }
   }

   function newPuzzleResetState(lastCompleted, lastPlayed) {
      var initialDalledleState = {
         gameStatus: "IN_PROGRESS",
         guesses: [],
         lastCompletedTs: lastCompleted,
         lastPlayedTs: lastPlayed,
      }
      localStorage.setItem(
         "dalledle_state",
         JSON.stringify(initialDalledleState)
      )
   }

   function initiateLocalStorage() {
      console.log("no local storage found")
      newPuzzleResetState("", "")
      incrementUniqueUsers()
      var initialStatisticsState = {
         currentStreak: "",
         gamesPlayed: "",
         gamesWon: "",
         guesses: [],
         maxStreak: "",
         winPercentage: "",
      }
      localStorage.setItem(
         "dalledle_statistics",
         JSON.stringify(initialStatisticsState)
      )
   }

   function updateLocalStorage(isSolved, firstGuess) {
      const dalledle_state = localStorage.getItem("dalledle_state")

      var parsed = JSON.parse(dalledle_state)

      parsed.lastPlayedTs = new Date().toISOString()
      parsed.dateStamp = props.dateStamp

      // guesses are updated in useEffect

      if (isSolved) {
         parsed.gameStatus = "SOLVED"
         parsed.lastCompletedTs = new Date().toISOString()
      } else {
         parsed.gameStatus = "IN_PROGRESS"
      }

      localStorage.setItem("dalledle_state", JSON.stringify(parsed))

      if (isSolved || firstGuess) {
         const dalledle_statistics = localStorage.getItem("dalledle_statistics")
         var parsed_statistics = JSON.parse(dalledle_statistics)
         if (isSolved) {
            parsed_statistics.gamesWon = (parsed.gamesWon || 0) + 1
            parsed_statistics.currentStreak = (parsed.currentStreak || 0) + 1
            if (
               isNaN(parsed_statistics.maxStreak) ||
               Number(parsed_statistics.currentStreak) >
                  Number(parsed_statistics.maxStreak)
            ) {
               parsed_statistics.maxStreak = parsed_statistics.currentStreak
            }
            parsed_statistics.winPercentage =
               (Number(parsed_statistics.gamesWon) /
                  Number(parsed_statistics.gamesPlayed)) *
               100
            //prisma
            incrementSolves()
         }
         if (firstGuess) {
            console.log(
               "this was the first guess on this date. incrementing games played"
            )
            parsed_statistics.gamesPlayed =
               (parsed_statistics.gamesPlayed === ""
                  ? 0
                  : Number(parsed_statistics.gamesPlayed)) + 1
         }

         localStorage.setItem(
            "dalledle_statistics",
            JSON.stringify(parsed_statistics)
         )
      }
   }

   function handleGuess(guess) {
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

      if (guess.toString().trim() !== "" && guess.split(" ").length > 2) {
         getSemanticSimilarity_testing(guess.toString().trim(), true)
      } else {
         getSemanticSimilarity_testing(guess.toString().trim(), false)
      }
   }

   function handleSolve() {
      console.log("puzzle solved")
      setDisplay(props.text_description)
      setSolved(true)
      document.getElementById("guess").disabled = true
      document.getElementById("vg").disabled = true
      setStatsVisible(false)
      setDirectionsVisible(false)
      setFAQVisible(false)
      setOverlayVisible(true)
      setWinVisible(true)
   }

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

   // prereq: guess should be string
   function getSemanticSimilarity(guess, isValid) {
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

   //prereq: guess should string
   function getSemanticSimilarity_testing(guess, isValid) {
      // I didn't enter my cc for dandelion token, so I'm fine with exposing it? is that ok?
      var dev = true
      var token = dev ? "oops" : "1202e2ee98174fba9b340300b3855bc2"

      if (!isValid || guess === null || guess.toString().trim() === "") {
         completeGuessProcessing(":(", guess)
         return
      }

      completeGuessProcessing(":(", guess)
      return

      // const text1 = encodeURIComponent(guess.trim())
      // const text2 = encodeURIComponent(props.text_description.trim())

      // var requestOptions = {
      //    method: "GET",
      //    redirect: "follow",
      // }

      // fetch(
      //    "https://api.dandelion.eu/datatxt/sim/v1/?text1=" +
      //       text1 +
      //       " &text2=" +
      //       text2 +
      //       "&lang=en&token=" +
      //       token,
      //    requestOptions
      // )
      //    .then((response) => response.text())
      //    .then((result) => {
      //       console.log("result: ", result)
      //       var parsed = JSON.parse(result)
      //       completeGuessProcessing(parsed.similarity, guess)
      //    })
      //    .catch((error) => {
      //       console.log("error in SS", error)
      //       completeGuessProcessing(":(", guess)
      //    })
   }

   function completeGuessProcessing(ss, guess) {
      // gtag("event", "guess_submitted", {
      //    event_category: props.dateStamp,
      //    event_label: guess,
      // })

      if (!isNaN(ss)) {
         ss = "" + Number(ss).toFixed(3)
      }

      let currentGuessCombo = {
         key: guesses.length + 1,
         text: guess,
         semanticSimilarity: ss,
         colors: [],
      }

      var splitGuess_noUpper = guess.split(" ")
      var splitGuess = guess.toUpperCase().split(" ")

      for (var i = 0; i < splitGuess.length; i++) {
         const relevantWord = splitGuess[i]
         console.log("relevantWord: " + relevantWord)
         const locInDesc = props.split_description.indexOf(relevantWord)
         console.log("locInDesc: " + locInDesc)

         if (locInDesc !== -1) {
            if (locInDesc === i) {
               currentGuessCombo.colors.push("#6aaa64")
            } else {
               currentGuessCombo.colors.push("#c9b458")
            }
         } else {
            currentGuessCombo.colors.push("#787c7e")
         }
      }

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

      var firstGuess = currentGuessCombo.key <= 1 ? true : false

      if (firstGuess) {
         incrementPlays()
      }

      if (
         guess.toUpperCase() === props.text_description.toUpperCase() ||
         (!isNaN(ss) && Number(ss) === 1)
      ) {
         setSolved(true)
         handleSolve()
         setLoading(false)
         // gtag("event", "puzzle_solved", {
         //    event_category: props.dateStamp,
         //    event_label: new Date().toLocaleString,
         // })
         updateLocalStorage(true, firstGuess)
         return
      }
      setLoading(false)
      updateLocalStorage(false, firstGuess)
      return
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
         <div className={styles.container}>
            <Head>
               <title>DALL-Edle</title>
               <meta name="description" content="Inspired by DALL-E" />
               <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header
               handleStatsClick={handleStatsClick}
               handleDirectionsClick={handleDirectionsClick}
               handleFAQClick={handleFAQClick}
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
                     <input
                        autocomplete="off"
                        autocorrect="off"
                        autocapitalize="off"
                        spellcheck="false"
                        className={styles.inputBox}
                        id="guess"
                     ></input>
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
                              {/* <th className={styles.tableSemanticSimilarity}>
                                 SS (?)
                              </th> */}
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
                                    {/* <td
                                       className={
                                          styles.tableSemanticSimilarityTable
                                       }
                                    >
                                       {guess.semanticSimilarity}
                                    </td> */}
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
