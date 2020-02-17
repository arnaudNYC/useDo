import React from 'react'

function reducer({ state, done, undone }, action) {
  switch (action.type) {
    case 'set': {
      return {
        state: action.nextState,
        done: [...done, state],
        undone: [],
      }
    }
    case 'undo':
      if (done.length === 0) {
        return { state, done, undone }
      }
      return {
        state: done[done.length - 1],
        done: [...done.slice(0, -1)],
        undone: [...undone, state],
      }
    case 'redo':
      if (undone.length === 0) {
        return { state, done, undone }
      }
      return {
        state: undone[undone.length - 1],
        done: [...done, state],
        undone: [...undone.slice(0, -1)],
      }
    default:
      return state
  }
}

function useDo(initialState = '') {
  const [state, dispatch] = React.useReducer(reducer, {
    state: initialState,
    done: [],
    undone: [],
  })

  const setNextState = nextState => dispatch({ type: 'set', nextState })
  const redo = () => dispatch({ type: 'redo' })
  const undo = () => dispatch({ type: 'undo' })

  return [
    state.state,
    setNextState,
    undo,
    redo,
    state.done.length > 0,
    state.undone.length > 0,
  ]
}

export default useDo
