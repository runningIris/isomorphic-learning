import Promise, {using} from 'bluebird';
import config from 'config';
import {camelizeKeys} from 'humps';

export const CALL_API = Symbol('CALL_API');
export const CHAIN_API = Symbol('CHAIN_API');

export default ({dispatch, getState}) => next => action => {
  if (action[CALL_API]) {
    return dispatch({
      [CHAIN_API]: [
        () => action
      ]
    });
  }

  let deferred = Promise.defer();

  if (!action[CHAIN_API]){
    return next(action);
  }

  let promiseCreators = action[CHAIN_API].map((apiActionCreator) => {
    return createRequestPromise(apiActionCreator, next, getState, dispatch);
  });

  let overall = promiseCreators.reduce((promise, creator) => {
    return promise.then(body => {
      return creator(body);
    });
  }, Promise.resolve());

  overall.finally(() => {
    deferred.resolve();
  }).catch(()=>{});

  return deferred.promise;
}

function actionWith (action, toMerge) {

}

function createRequestPromise (apiActionCreator, next, getState, dispatch) {
  return (prevBody) => {
    ...
    return deferred.promise;
  }
}

function extractParams (callApi) {
  let {} = callApi;

  let url;

  return {method, url, query, body, successType, errorType, afterSuccess, afterError}
}
