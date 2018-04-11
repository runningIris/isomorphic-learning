import {useRouterHistory, RouterContext, match} from 'react-router';
import {createMemoryHistory, useQueries} from 'history';
import Promise from 'bluebird';
import configureStore from 'store/configureStore';
import createRoutes from 'react-redux';
import Helmet from 'react-helmet';

let scriptSrcs = ['/vendor.js', '/app.js'], styleSrc = '/main.css';

export default (req, res, next) => {
  let history = useRouterHistory(useQueries(createMemoryHistory))();
  let store = configureStore();
  let routes = createRoutes();
  let location = history.createLocation(req.url);

  const subscribeUrl = () => {
    let currentUrl = location.pathname + location.search;
    let unsubscribe = history.listen(newLoc => {
      if (newLoc.action === 'PUSH' || newLoc.action === 'REPLACE') {
        currentUrl = newLoc.pathname + newLoc.search;
      }
    });
    return [()=>currentUrl, unsubscribe];
  };

  const getReduxPromise = (renderProps) => {
    let {query, params} = renderProps;
    let comp = renderProps.components[renderProps.components.length - 1].WrappedComponent;
    let promise = comp.fetchData({query, params, store, history});
    return promise;
  }

  match ({routes, location}, (err, redirectLocation, renderProps) => {
    let [ getCurrentUrl, unsubscribe ] = subscribeUrl();
    let reqUrl = location.pathname + location.search;

    getReduxPromise(renderProps).then(() => {
      let reduxState = escape(JSON.stringify(store.getState()));
      let html = ReactDOMServer.renderToString(
        <Provider store={store}>
          {<RouterContext {...renderProps} />}
        </Provider>
      );
      let metaHeader = Helmet.rewind();

      if (getCurrentUrl() === reqUrl) {
        res.render('index', {metaHeader, html, scriptSrcs, reduxState, styleSrc});
      } else {
        res.redirect(302, getCurrentUrl());
      }
      unsubscribe(302, getCurrentUrl())
    });
  })
}
