export function handleShare(date, guessCount) {
    navigator.clipboard
       .writeText(
          "I solved the DALL-Edle " +
             date +
             " puzzle in " +
             guessCount +
             (guessCount === 1 ? " guess." : " guesses.") +
             " http://dalledle.com"
       )
       .then(() => {
          alert("Copied to clipboard!")
       })
       .catch(() => {
          alert("Couldn't copy. Not sure why :(")
       })
 }