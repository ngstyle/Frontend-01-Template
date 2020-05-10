# Event loop: microtasks and macrotasks

Microtasks come solely from our code. They are usually created by promises: an execution of `.then/catch/finally` handler becomes a microtask. Microtasks are used “under the cover” of `await` as well, as it’s another form of promise handling.

There’s also a special function `queueMicrotask(func)` that queues `func` for execution in the microtask queue.

**Immediately after every *macrotask*, the engine executes all tasks from *microtask* queue, prior to running any other macrotasks or rendering or anything else.**

For instance, take a look:

```javascript
setTimeout(() => alert("timeout"));

Promise.resolve()
  .then(() => alert("promise"));

alert("code");
```

What’s going to be the order here?

1. `code` shows first, because it’s a regular synchronous call.
2. `promise` shows second, because `.then` passes through the microtask queue, and runs after the current code.
3. `timeout` shows last, because it’s a macrotask.

All microtasks are completed before any other event handling or rendering or any other macrotask takes place.



### [Summary](https://javascript.info/event-loop#summary)

The more detailed algorithm of the event loop (though still simplified compare to the [specification](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)):

1. Dequeue and run the oldest task from the *macrotask* queue (e.g. “script”).
2. Execute all microtasks:
   - While the microtask queue is not empty:
     - Dequeue and run the oldest microtask.
3. Render changes if any.
4. If the macrotask queue is empty, wait till a macrotask appears.
5. Go to step 1.

To schedule a new *macrotask*:

- Use zero delayed `setTimeout(f)`.

That may be used to split a big calculation-heavy task into pieces, **for the browser to be able to react on user events and show progress between them.**

Also, used in event handlers to schedule an action after the event is fully handled (bubbling done).

To schedule a new *microtask*

- Use `queueMicrotask(f)`.
- Also promise handlers go through the microtask queue.

There’s no UI or network event handling between microtasks: they run immediately one after another.

So one may want to `queueMicrotask` to execute a function asynchronously, but within the environment state.



> **Web Workers**
>
> For long heavy calculations that shouldn’t block the event loop, we can use [Web Workers](https://html.spec.whatwg.org/multipage/workers.html).
>
> That’s a way to run code in another, parallel thread.
>
> Web Workers can exchange messages with the main process, but they have their own variables, and their own event loop.
>
> Web Workers do not have access to DOM, so they are useful, mainly, for calculations, to use multiple CPU cores simultaneously.



> [Event loop: microtasks and macrotasks](https://javascript.info/event-loop)
>
> [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
>
> [Microtasks](https://javascript.info/microtask-queue)
>
> [event-loop-processing-model](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)

