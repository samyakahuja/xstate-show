// http://localhost:3000/isolated/exercise/01.extra-3.js

import React from 'react'

const STATUS = {
  IDLE: 'IDLE',
  PENDING: 'PENDING',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED',
}

function geoPositionReducer(state, action) {
  switch (action.type) {
    case 'error': {
      return {
        ...state,
        status: STATUS.REJECTED,
        error: action.error,
      }
    }
    case 'success': {
      return {
        ...state,
        status: STATUS.RESOLVED,
        position: action.position,
      }
    }
    case 'started': {
      return {
        ...state,
        status: STATUS.PENDING,
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function useGeoPosition() {
  const [state, dispatch] = React.useReducer(geoPositionReducer, {
    status: STATUS.IDLE,
    position: null,
    error: null,
  })

  React.useEffect(() => {
    if (!navigator.geolocation) {
      dispatch({
        type: 'error',
        error: new Error('Geolocation is not supported'),
      })
      return
    }

    dispatch({type: 'started'})

    const geoWatch = navigator.geolocation.watchPosition(
      position => dispatch({type: 'success', position}),
      error => dispatch({type: 'error', error}),
    )

    return () => navigator.geolocation.clearWatch(geoWatch)
  }, [dispatch])

  return state
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
