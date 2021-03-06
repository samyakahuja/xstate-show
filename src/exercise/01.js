// http://localhost:3000/isolated/exercise/01.js

import React from 'react'

const useGeoPosition = () => {
  const [position, setPosition] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    if (!navigator.geolocation) {
      setError(new Error('Geolocation is not supported'))
      setIsLoading(false)
      return
    }

    const geoWatch = navigator.geolocation.watchPosition(
      position => {
        setPosition(position)
        setIsLoading(false)
      },
      error => {
        setError(error)
        setIsLoading(false)
      },
    )

    return () => navigator.geolocation.clearWatch(geoWatch)
  }, [setPosition, setIsLoading, setError])

  return {position, error, isLoading}
}

function App() {
  const {isLoading, position, error} = useGeoPosition()

  if (isLoading) {
    return <div>Loading your position...</div>
  }

  if (position) {
    return (
      <div>
        Lat: {position.coords.latitude}
        Long: {position.coords.longitude}
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <div>There was some error getting your position</div>
        <pre>{error.message}</pre>
      </div>
    )
  }
}

export default App
