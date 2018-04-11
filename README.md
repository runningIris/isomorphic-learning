# React Redux 同构直出


嘿嘿嘿, 终究还是学习了一些新知识。

解了心中存在很久对疑惑


本仓库存放我个人学习[mz026/universal-redux-template](https://github.com/mz026/universal-redux-template)的代码笔记

配合Yang-Hsing Lin的[博客原文](http://mz026.logdown.com/posts/308147-hello-redux-2-3-server-rendering)学习

笔记做得零零散散，给自己看。


## 梳理思路

客户端向服务端发送请求：

根据请求地址的参数，匹配route

取到相应的组件，去检查组件有没有fetchData(获取数据渲染页面的接口)这个方法


如果有，则在服务端发起请求，得到fetchData的数据，跟新reduxState

根据reduxState来渲染页面

把渲染好的页面和reduxState返回给客户端


## 疑惑
- server-side 和 client-side 的reduxState怎么同步？
- client-side的reduxState具体有啥作用？

下次看看复杂些的项目再来了解更多关于redux吧


## 顿然醒悟的点

同构直出的服务端代码是放在`app/server/middleware.js`里的，使用redux对store进行管理


``` html
<!DOCTYPE html>
<html>
  <head>
    <title>Redux real-world example</title>
  </head>
  <body>
    <div id="root"><%- html %></div>
    <script type="text/javascript" charset="utf-8">
    <!--
     这句是关键。。。一直看漏了
     reduxState原来一直都是放在server-side，每次开页面，都由服务端这边渲染好页面，返回给客户端
     那么，store，是不是根据请求来进行修改？在路由里，接受到某个请求，解析意思，
    -->
      window.__REDUX_STATE__ = '<%= reduxState %>';
    </script>
    <script src="http://localhost:3001/static/bundle.js"></script>
  </body>
</html>
```



- 不小心忽略了以下这段代码：去检查对应组件里是否有fetchData这个方法，如果有的话，传入{query, params, store, history}, 执行这个方法，再返回promise。 fetchData里store.dispatch(action)去改变store

``` js
getReduxPromise().then(()=> {
  let reduxState = escape(JSON.stringify(store.getState()));
  let html = ReactDOMServer.renderToString(
    <Provider store={store}>
      { <RoutingContext {...renderProps}/> }
    </Provider>
  );
  res.render('index', { html, reduxState });
});

function getReduxPromise () {
  let { query, params } = renderProps;
  let comp = renderProps.components[renderProps.components.length - 1].WrappedComponent;
  let promise = comp.fetchData ?
    comp.fetchData({ query, params, store, history }) :
    Promise.resolve();

  return promise;
}
```
