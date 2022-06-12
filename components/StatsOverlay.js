import styles from '../styles/Overlays.module.css'

export default function StatsOverlay(props) {

    return (
        <div className={styles.statsOverlayContainer}>
            <div className={styles.statsContainer}>
            <h1 className={styles.header}>Statistics</h1>
            <p>Total:</p>
            <p>Wins:</p>
            <p>Win %:</p>
            <p>Current Streak:</p>
            </div>
        </div>
    )
}