export default function questionsReducer (state = defaultState, action) {
  switch (action.type) {
    case ActionType.LOADED_QUESTIONS:
      return Immutable.fromJS(action.response);
      break;
    default:
      return state;
  }
}
