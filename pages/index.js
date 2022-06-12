import Head from "next/head"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import { prisma } from "../lib/prisma.js"
import { useState, useEffect } from "react"

export const getStaticProps = async ({ params }) => {
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
   const [loading, setLoading] = useState(false)

   function handleGuess(guess) {
      console.log("GETTING STARTED ___________________")
      for (var i = 0; i < guesses.length; i++) {
        console.log("guesses[" + i + "]: " + guesses[i].text)
      }
      setLoading(true)
      // some random stuff you could catch
      if (
         guess === null ||
         guess.toString().trim() === "" ||
         guess.toString().split(" ").length > 20
      ) {
         return -1
      }

      // here's a bit
      var semanticSimilarity = 0.8
      let currentGuessCombo = {
         key: guesses.length + 1,
         text: guess,
         semanticSimilarity: semanticSimilarity,
         colors: [],
      }

      // is this the right semantic similarity to compare to?
      if (guess === props.text_description || semanticSimilarity > 0.98) {
         currentGuessCombo.colors.push("all_green")
         setGuesses(guesses => [...guesses, currentGuessCombo])

         setLoading(false)
         setSolved(true)
         handleSolve()

         return
      }

      var splitGuess = guess.toUpperCase().split(" ")
      console.log("splitGuess: " + splitGuess)
      console.log("props.split_description: " + props.split_description)
      console.log("here we go")

      for (var i = 0; i < splitGuess.length; i++) {
         const relevantWord = splitGuess[i]
         console.log("relevantWord: " + relevantWord)
         const locInDesc = props.split_description.indexOf(relevantWord)
         console.log("locInDesc: " + locInDesc)

         if (locInDesc !== -1) {
            console.log("this item is in the description")
            if (locInDesc === i) {
               console.log("guess index is correct, too (i is " + i + ")")
               currentGuessCombo.colors.push("green")
            } else {
               currentGuessCombo.colors.push("yellow")
            }
         } else {
            currentGuessCombo.colors.push("grey")
         }
      }

      console.log("colors: " + currentGuessCombo.colors)
      setGuesses(guesses => [...guesses, currentGuessCombo]);
      for (var i = 0; i < guesses.length; i++) {
        console.log("guesses[" + i + "]: " + guesses[i].text)
      }

      return
   }

   function handleSolve() {
      console.log("puzzle solved")
      setDisplay(props.textDescription)
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
      <div className={styles.container}>
         <Head>
            <title>DALL-Edle</title>
            <meta name="description" content="Inspired by DALL-E" />
            <link rel="icon" href="/favicon.ico" />
         </Head>

         <Header />

         <main className={styles.main}>
            <div className={styles.game}>
               <img
                  draggable="false"
                  className={styles.mainImage}
                  src={props.url}
               ></img>
               <div className={styles.display}>{display}</div>
               {solved && <div>Solved</div>}
               <div className={styles.inputSection}>
                  <input className={styles.inputBox} id="guess"></input>
                  <div
                     className={styles.enterButton}
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
                        {guesses.map((guess, key) => (
                           <tr key={key}>
                              <td className={styles.tableGuessNum}>
                                 {guess.key}
                              </td>
                              <td className={styles.tableText}>{guess.text}</td>
                              <td
                                 className={styles.tableSemanticSimilarityTable}
                              >
                                 {guess.semanticSimilarity}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               )}
            </div>
         </main>
      </div>
   )
}
