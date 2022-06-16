import Header from '../components/Header'
import styles from '../styles/Archive.module.css'

export default function Archive(props) {
   return (
      <>
         <Header
         />
         <div className={styles.container}>
            <div className={styles.content}>
               Hello wrold
            </div>
         </div>
      </>
   )
}
