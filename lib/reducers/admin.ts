
const defaultState = { steps: [] }

export default function(state = defaultState, action) {
  switch (action.type) {
    case "DEBUG":
      return (<any>Object).assign({}, state, { steps: [...state.steps, action.data] });
    case "RESET":
      return defaultState 
    default:
      return state;
  }
}