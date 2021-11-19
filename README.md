# redux-serialMiddleware

[redux 中间件](https://www.redux.org.cn/docs/advanced/Middleware.html)，用于串行发送数据。

## 为什么有这个中间件？

它解决了并行发送数据所存在的问题。

并行发送数据，有可能会导致获取的数据不是最新的，举个例子：

```js
const fetchInfo = async ({ getState, dispatch }) => {
  // 获取数据
  const { user } = getState();
  const { friendList } = user;
  // 下面一行promise为 模拟发送mock请求
  await new Promise((resolve) => setTimeout(() => resolve(friendList), 2000));
  // 发送请求后所要做的事
  dispatch({
    type: "addFriend",
    data: { friendList: friendList.concat("okk") },
  });
};
```

现在，我们去执行两次 a 函数，第一次的 fetchInfo 获取到了 redux 的数据后，拿到该数据后去请求后台，但数据还没来，所以它会执行第二次的 a 函数，同理。这会让这两次 fetchInfo 拿到的 redux 数据一样。但是我们想第二次 fetchInfo 拿到的数据是第一次 fetchInfo 执行完后（当前最新）的数据，并行请求是很难做到的，因此，才有了这个串行请求的中间件。

## 如何使用

一般的 dispatch 为 `dispatch({ type: string, data: any })`

而 serial 为 `dispatch([Function, "serial"])`

需传入一个数组，数组的第一项为你要执行的方法，第二项必须为 `serial`。

就那上面的例子来讲：

```js
// 先定义一个函数（假设 该函数 是你所要执行的函数）
const fetchInfo = async ({ getState, dispatch }) => {
  // 获取数据
  const { user } = getState();
  const { friendList } = user;
  // 下面一行promise为 模拟发送mock请求
  await new Promise((resolve) => setTimeout(() => resolve(friendList), 2000));
  // 发送请求后所要做的事
  dispatch({
    type: "addFriend",
    data: { friendList: friendList.concat("okk") },
  });
};
```

你想要执行两次 fetchInfo，并且让第二次执行的函数拿到最新的 redux 值，你可以这样做:

```js
dispatch([Function, "serial"]);
dispatch([Function, "serial"]);
```
