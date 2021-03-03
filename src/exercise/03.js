import React from 'react'
import {Machine, assign} from 'xstate'
import {useMachine} from '@xstate/react'

const RESOLVE = {
  target: 'resolved',
  actions: 'setPosition',
}

const REJECT = {
  target: 'rejected',
  actions: 'setError',
}

const geoPositionMachine = Machine(
  {
    id: 'geoposition',
    initial: 'idle',
    context: {
      position: null,
      error: null,
    },
    states: {
      idle: {
        on: {
          START: 'pending',

          REJECT_NOT_SUPPORTED: 'rejectedNotSupported',
        },
      },
      pending: {
        on: {RESOLVE, REJECT},
      },
      resolved: {
        on: {RESOLVE, REJECT},
      },
      rejected: {
        on: {RESOLVE, REJECT},
      },
      rejectedNotSupported: {},
    },
  },

  {
    actions: {
      setPosition: assign({
        position: (context, event) => event.position,
      }),

      setError: assign({
        error: (context, event) => event.error,
      }),
    },
  },
)

function useGeoPosition() {
  const [state, send] = useMachine(geoPositionMachine)

  React.useEffect(() => {
    if (!navigator.geolocation) {
      send('REJECT_NOT_SUPPORTED')
      return
    }

    send('START')

    const geoWatch = navigator.geolocation.watchPosition(
      position => send({type: 'RESOLVE', position}),
      error => send({type: 'REJECT', error}),
    )

    return () => navigator.geolocation.clearWatch(geoWatch)
  }, [send])

  return state
}

function App() {
  const state = useGeoPosition()

  const status = state.value

  const {position, error} = state.context

  if (status === 'rejectedNotSupported') {
    return <div>This browser does not support Geolocation</div>
  }

  if (status === 'idle' || status === 'pending') {
    return <div>Loading your position...</div>
  }

  if (status === 'resolved') {
    return (
      <div>
        Lat: {position.coords.latitude}, Long: {position.coords.longitude}
      </div>
    )
  }

  if (status === 'rejected') {
    return (
      <div>
        <div>Oh no, there was a problem getting your position:</div>

        <pre>{error.message}</pre>
      </div>
    )
  }
}

export default App
