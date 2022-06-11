import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Header from '../components/Header'
import { prisma } from "../lib/prisma.js";
import { useState, useEffect } from 'react';

export const getStaticProps = async ({ params }) => {
  var date = new Date();
  var year = date.getFullYear();
  var day = date.getDate();
  var month = date.getMonth() + 1;

  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;

  var isoDate = year + "-" + month + "-" + day;

  const image = await prisma.image.findUnique({
    where: {
      date: isoDate,
    },
  });

  if (image.createdAt !== null) {
    image.createdAt = image.createdAt.toString();
  }
  if (image.updatedAt !== null) {
    image.updatedAt = image.updatedAt.toISOString();
  }

  var unsolvedState = ""

  for (var i = 0; i < image.text_description.length; i++) {
    if (image.text_description.charAt(i) !== " ") {
      unsolvedState += "_";
    } else {
      unsolvedState += " ";
    }
  }

  image.unsolvedState = unsolvedState

  return {
    props: image,
  };
};

export default function Home(props) {
  const [solved, setSolved] = useState(false);
  const [unsolvedState, setUnsolvedState] = useState(props.unsolvedState);
  const [guesses, setGuesses] = useState([]);

  function validateGuess(guess) {
    var splitUnsolvedState = unsolvedState.toString().toLowerCase().split(" ");
    var splitDescription = props.text_description.toString().toLowerCase().split(" ");

    setGuesses(guesses => [...guesses,guess] );
    if (guess === props.text_description || unsolvedState.toString().toLowerCase() === props.text_description.toString().toLowerCase()) {
      setSolved(true);
      setUnsolvedState(props.text_description);
    }

    var splitGuess = guess.split(" ");

    for (var i = 0; i < splitGuess.length; i++) {
      var guessWord = splitGuess[i];

      if (splitDescription.indexOf(guessWord) > -1) {
        var index = splitDescription.indexOf(guessWord);
        splitUnsolvedState[index] = guessWord;
      }
    }

    setUnsolvedState(splitUnsolvedState.join(" "));
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
          <img draggable="false" className={styles.mainImage} src={props.url}></img>
          <div className={styles.unsolvedState}>{unsolvedState}</div>
          {solved && <div>Solved</div>}
          <div className={styles.inputSection}>
            <input className={styles.inputBox} id="guess"></input>
            <div className={styles.enterButton} onClick={() => validateGuess(document.getElementById("guess").value)}>ENTER</div>
          </div>
          {guesses.reverse().map((guess, key) => (<div key={key}>{guess}</div>))}
        </div>
      </main>
    </div>
  )
}
