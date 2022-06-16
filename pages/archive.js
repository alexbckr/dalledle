import Header from '../components/Header'

export default function Archive(props) {
   return (
      <>
         <Header
            handleStatsClick={handleStatsClick}
            handleDirectionsClick={handleDirectionsClick}
            handleFAQClick={handleFAQClick}
         />
         Hello world
      </>
   )
}
