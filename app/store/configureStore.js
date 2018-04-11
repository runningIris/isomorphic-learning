import apiMiddleware from '../middleware/api';
import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../reducers';

let middlewares = [
  thunkMiddleware,
  apiMiddleware
];

const createStoreWithMiddleware = applyMiddleware(
  ...middlewares
)(createStore);

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    })
  }

  return store;
}
