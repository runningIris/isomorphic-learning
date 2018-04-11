let defaultState = Immutable.fromJS({
  user: {}
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case ActionType.LOADED_QUESTIONS_DETAIL:
      return state.merge(action.response);
      break;
    case ActionType.LOADED_QUESTIONS_USER:
      return state.merge({user: action.response});
      break;
    default:
      return state;
  }
}
