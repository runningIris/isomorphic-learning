import configureStore from 'store/configureStore';
import createRoutes from 'routes/index';

let reduxState = {};

let plain = JSON.parse(unescape(__REDUX_STATE__));
_.each(plain, (val, key) => {
  reduxState[key] = Immutable.fromJS(val);
});

const store = configureStore(reduxState);

ReactDOM.render((
  <Provider store={store}>
    {createRoutes(browserHistory)}
  </Provider>
), document.getElementById('root'));
