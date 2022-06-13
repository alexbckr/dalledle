import styles from '../styles/Overlays.module.css'
import { useEffect, useState } from 'react'

export default function StatsOverlay(props) {

    const [stats, setStats] = useState(props.stats)


    return (
        <div className={styles.statsOverlayContainer}>
            <div className={styles.statsContainer}>
            <h1 className={styles.header}>Statistics</h1>
            <p className={styles.stat}>Games Played: <span>{stats.gamesPlayed || 0}</span></p>
            <p className={styles.stat}>Wins: <span>{stats.gamesWon || 0}</span></p>
            <p className={styles.stat}>Win %: <span>{(isNaN(stats.gamesPlayed)) ? 0 : (Number(stats.gamesWon) / Number(stats.gamesPlayed) * 100).toFixed(1)}%</span></p>
            <p className={styles.stat}>Current Streak: <span>{stats.currentStreak || 0}</span></p>
            <p className={styles.stat}>Best Streak: <span>{stats.maxStreak || 0}</span></p>
            </div>
        </div>
    )
}