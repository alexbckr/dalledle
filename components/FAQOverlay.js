import styles from "../styles/Overlays.module.css"

export default function FAQOverlay(props) {
   return (
      <div className={styles.faqOverlayContainer}>
         <div className={styles.faqContainer}>
            <h1 className={styles.header}>FAQ</h1>
            <b>What's DALL-E?</b>
            <p>DALL-E is an AI system that creates realistic images from text captions. OpenAI recently created DALL-E 2, which you can read more about <a target="_blank" href="https://openai.com/dall-e-2/">here</a>.</p>
            <b>Where'd you get these images?</b>
            <p>Most of the images on this site come from Twitter (@weirddalle), Reddit (r/weirddalle), or submissions. Although DALL-E still has a waitlist, you can use a <a target="_blank" href="https://huggingface.co/spaces/dalle-mini/dalle-mini">mini version</a> thanks to Hugging Face.</p>
            <b>How was this website made?</b>
            <p>This website was made with love and NextJs, PostgreSQL, and Prisma. A weekend well spent, I think.</p> 
            <div className={styles.closeButton} onClick={() => props.dismiss()}>Close</div>
         </div>
      </div>
   )
}
