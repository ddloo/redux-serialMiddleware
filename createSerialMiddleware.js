const isSerial = (action) => {
    return (
      Array.isArray(action) &&
      typeof action[0] === "function" &&
      action[1] === "serial"
    );
  };
  
  /**
   * 发送串行请求的函数
   * @param {Function} func 请求函数
   * @returns Generator对象
   */
  const createSerialMiddleware =
    ({ dispatch, getState }) =>
    (next) => {
      let flag = false; // 记录是否在发送请求中
      let events = []; // 发送请求的函数数组
  
      return (action) => {
        if (!isSerial(action)) {
          return next(action);
        }
  
        let func = action[0];
        const performWork = async (...opts) => {
          let event = null;
  
          events.push(func);
  
          if (flag) return;
  
          while ((event = events.shift())) {
            flag = true;
            await event(...opts);
          }
  
          !events.length && (flag = false);
        };
  
        return performWork({dispatch, getState});
      };
    };
  
  export default createSerialMiddleware;
  