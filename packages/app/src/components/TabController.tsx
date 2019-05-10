import React, {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useReducer,
  useEffect,
  useRef,
} from 'react'

// https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
const DOCUMENT_POSITION_PRECEDING = 2

const ControllerContext = createContext<{
  state: State
  dispatch: React.Dispatch<Action>
}>(null)

interface TabStop {
  id: string
  elementRef: React.RefObject<HTMLElement>
}

interface State {
  selectedId: string
  tabStops: TabStop[]
  initialized: boolean
}

type Action =
  | { type: 'select_prev'; id: string }
  | { type: 'select_next'; id: string }
  | { type: 'register' } & TabStop
  | { type: 'unregister'; id: string }

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'register': {
      const { type, ...payload } = action

      if (!state.tabStops.length) {
        return {
          ...state,
          selectedId: payload.id,
          tabStops: [payload],
        }
      }

      const index = state.tabStops.findIndex(stop => stop.id === payload.id)

      if (index >= 0) {
        // avoid registering the same element twice
        return state
      }

      const indexAfter = state.tabStops.findIndex(
        stop =>
          !!(
            stop.elementRef.current.compareDocumentPosition(
              payload.elementRef.current
            ) & DOCUMENT_POSITION_PRECEDING
          )
      )

      return {
        ...state,
        tabStops: [
          ...state.tabStops.slice(0, indexAfter),
          payload,
          ...state.tabStops.slice(indexAfter),
        ],
      }
    }
    case 'unregister': {
      let selectedId = state.selectedId
      const tabStops = state.tabStops.filter(stop => stop.id === action.id)

      if (selectedId === action.id) {
        if (tabStops.length > 0) {
          selectedId = null
        } else {
          selectedId = tabStops[0].id
        }
      }

      return {
        ...state,
        tabStops,
        selectedId,
      }
    }
    case 'select_next':
    case 'select_prev': {
      const selectedIndex = state.tabStops.findIndex(
        stop => stop.id === action.id
      )

      const direction = action.type === 'select_next' ? 1 : -1

      const selectedTabStop =
        state.tabStops[
          (selectedIndex + direction + state.tabStops.length) %
            state.tabStops.length
        ]

      return {
        ...state,
        selectedId: selectedTabStop.id,
        // deferred here so we skip first render focus
        initialized: true,
      }
    }
    default:
      return state
  }
}

const TabController: React.FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    selectedId: null,
    tabStops: [],
    initialized: false,
  })

  const context = useMemo(
    () => ({
      dispatch,
      state,
    }),
    [state]
  )

  return (
    <ControllerContext.Provider value={context}>
      {children}
    </ControllerContext.Provider>
  )
}

export const useControlledTabIndex = (
  ref: React.RefObject<HTMLElement>,
  id: string,
  disabled: boolean = false
) => {
  const { dispatch, state } = useContext(ControllerContext)

  useEffect(() => {
    if (disabled) {
      return
    }

    dispatch({ type: 'register', id, elementRef: ref })

    return () => dispatch({ type: 'unregister', id })
  }, [disabled, dispatch, id, ref])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'Down':
        case 'ArrowDown':
        case 'Right':
        case 'ArrowRight':
          e.preventDefault()

          dispatch({ type: 'select_next', id })
          break
        case 'Up':
        case 'ArrowUp':
        case 'Left':
        case 'ArrowLeft':
          e.preventDefault()

          dispatch({ type: 'select_prev', id })
          break
      }
    },
    [dispatch, id]
  )

  const selected = state.selectedId === id

  const prevSelectedRef = useRef(true)

  useEffect(() => {
    if (
      !prevSelectedRef.current &&
      selected &&
      ref.current &&
      state.initialized
    ) {
      ref.current.focus()
    }

    prevSelectedRef.current = selected
  }, [ref, selected, state.initialized])

  const tabIndex = selected ? 0 : -1

  return { onKeyDown, tabIndex }
}

export default TabController
