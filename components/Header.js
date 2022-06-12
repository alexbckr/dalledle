import styles from '../styles/Header.module.css'

export default function Header(props) {
    return (
        <div className={styles.header}>
           <div className={styles.navbarButton} onClick={() => props.handleDirectionsClick()}>Help</div>
           <div className={styles.logo}>DALL-Edle</div>
           <div className={styles.navbarButton} onClick={() => props.handleStatsClick()}>Stats</div>
        </div>
    )
}