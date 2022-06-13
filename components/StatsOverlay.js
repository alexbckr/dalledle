import styles from '../styles/Overlays.module.css'
import { useEffect, useState } from 'react'

export default function StatsOverlay(props) {

    const [stats, setStats] = useState([])

    useEffect(() => {
        var stats = localStorage.getItem("dalledle_statistics")
        setStats(JSON.parse(stats))
    }, [stats])


    return (
        <div className={styles.statsOverlayContainer}>
            <div className={styles.statsContainer}>
            <h1 className={styles.header}>Statistics</h1>
            <p>Games Played: {stats.gamesPlayed || 0}</p>
            <p>Wins: {stats.gamesWon || 0}</p>
            <p>Win %: {stats.gamesPlayed === 0 ? 0 : (Number(stats.gamesWon) / Number(stats.gamesPlayed))}% </p>
            <p>Current Streak: {stats.currentStreak || 0}</p>
            <p>Best Streak: {stats.maxStreak || 0}</p>
            </div>
        </div>
    )
}