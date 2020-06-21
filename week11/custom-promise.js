class Nohc {
  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";
  constructor(executor) {
    this.status = Nohc.PENDING;
    this.value = null;
    this.callbacks = [];

    executor(this.resolve.bind(this), this.reject.bind(this));
  }

  resolve(value) {
    if (this.status === Nohc.PENDING) {
      this.status = Nohc.FULFILLED;
      this.value = value;

      setTimeout(() => {
        this.callbacks.map((cb) => cb.onFulfilled(value));
      });
    }
  }

  reject(reason) {
    if (this.status === Nohc.PENDING) {
      this.status = Nohc.REJECTED;
      this.value = reason;

      setTimeout(() => {
        this.callbacks.map((cb) => cb.onRejected(reason));
      });
    }
  }

  then(onFulfilled, onRejected) {
    if (typeof onFulfilled !== "function") {
      // resolve 穿透
      onFulfilled = () => this.value;
    }
    // if (typeof onRejected !== "function") {
    //   onRejected = () => {
    //     throw new Error(this.value);
    //   };
    // }

    const promise = new Nohc((resolve, reject) => {
      if (this.status === Nohc.PENDING) {
        this.callbacks.push({
          onFulfilled: (value) => {
            this.parse(promise, onFulfilled(value), resolve, reject);
          },
          onRejected: (value) => {
            // typeof onRejected === "function"
            if (typeof onRejected === "function") {
              this.parse(promise, onRejected(value), resolve, reject);
            } else {
              // reject 穿透
              reject(value);
            }
          },
        });
      } else if (this.status === Nohc.FULFILLED) {
        setTimeout(() => {
          this.parse(promise, onFulfilled(this.value), resolve, reject);
        });
      } else if (this.status === Nohc.REJECTED) {
        setTimeout(() => {
          if (typeof onRejected === "function") {
            this.parse(promise, onRejected(this.value), resolve, reject);
          } else {
            // reject 穿透
            reject(this.value);
          }
        });
      }
    });

    return promise;
  }

  parse(promise, result, resolve, reject) {
    if (promise === result)
      throw new TypeError("Chaining cycle detected for promise");
    try {
      // Handle result is Nohc
      if (result instanceof Nohc) {
        result.then(resolve, reject);
      } else {
        resolve(result);
      }
    } catch (error) {
      reject(error);
    }
  }

  static resolve(value) {
    return new Nohc((resolve, reject) => {
      if (value instanceof Nohc) {
        value.then(resolve, reject);
      } else {
        resolve(value);
      }
    });
  }

  static reject(value) {
    return new Nohc((resolve, reject) => {
      reject(value);
    });
  }

  static all(promises) {
    return new Nohc((resolve, reject) => {
      const values = [];
      for (const promise of promises) {
        promise.then(
          (value) => {
            values.push(value);
            if (values.length === promises.length) resolve(values);
          },
          (reason) => {
            reject(reason);
          }
        );
      }
    });
  }

  static race(promises) {
    return new Nohc((resolve, reject) => {
      promises.forEach((promise) => {
        promise.then(
          (value) => {
            resolve(value);
          },
          (reason) => {
            reject(reason);
          }
        );
      });
    });
  }
}
