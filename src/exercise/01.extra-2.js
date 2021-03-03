// http://localhost:3000/isolated/exercise/02.extra-2.js

import React from 'react'

const STATUS = {
  IDLE: 'IDLE',
  PENDING: 'PENDING',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED',
}

const useGeoPosition = () => {
  const [position, setPosition] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [status, setStatus] = React.useState(STATUS.IDLE)

  React.useEffect(() => {
    if (!navigator.geolocation) {
      setError(new Error('Geolocation is not supported'))
      setStatus(STATUS.REJECTED)
      return
    }

    setStatus(STATUS.PENDING)

    const geoWatch = navigator.geolocation.watchPosition(
      position => {
        setPosition(position)
        setStatus(STATUS.RESOLVED)
      },
      error => {
        setError(error)
        setStatus(STATUS.REJECTED)
      },
    )

    return () => navigator.geolocation.clearWatch(geoWatch)
  }, [setPosition, setStatus, setError])

  return {position, error, status}
}

function App() {
  const {status, position, error} = useGeoPosition()

  if (status === STATUS.IDLE || status === STATUS.PENDING) {
    return <div>Loading your position...</div>
  }

  if (status === STATUS.RESOLVED) {
    return (
      <div>
        Lat: {position.coords.latitude}
        Long: {position.coords.longitude}
      </div>
    )
  }

  if (status === STATUS.REJECTED) {
    return (
      <div>
        <div>There was some error getting your position</div>
        <pre>{error.message}</pre>
      </div>
    )
  }
}

export default App
