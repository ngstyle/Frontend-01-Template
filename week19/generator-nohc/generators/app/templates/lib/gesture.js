export function enableGesture(element) {
  const contexts = Object.create(null);
  const MOUSE_SYMBOL = Symbol("mouse");
  // console.log(document.ontouchstart);
  // PC undefined
  if (document.ontouchstart === undefined)
    element.addEventListener("mousedown", (event) => {
      contexts[MOUSE_SYMBOL] = Object.create(null);
      start(event, contexts[MOUSE_SYMBOL]);
      let mouseMove = (event) => {
        move(event, contexts[MOUSE_SYMBOL]);
      };

      let mouseEnd = (event) => {
        end(event, contexts[MOUSE_SYMBOL]);
        delete contexts[MOUSE_SYMBOL];
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseEnd);
      };

      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseEnd);
    });

  element.addEventListener("touchstart", (event) => {
    for (const touch of event.changedTouches) {
      contexts[touch.identifier] = Object.create(null);
      start(touch, contexts[touch.identifier]);
    }
  });

  element.addEventListener("touchmove", (event) => {
    for (const touch of event.changedTouches) {
      move(touch, contexts[touch.identifier]);
    }
  });

  element.addEventListener("touchend", (event) => {
    for (const touch of event.changedTouches) {
      end(touch, contexts[touch.identifier]);
      delete contexts[touch.identifier];
    }
  });

  element.addEventListener("touchcancel", (event) => {
    for (const touch of event.changedTouches) {
      cancel(touch, contexts[touch.identifier]);
      delete contexts[touch.identifier];
    }
  });

  let start = (point, context) => {
    element.dispatchEvent(
      new CustomEvent("start", {
        detail: {
          startX: point.clientX,
          startY: point.clientY,
          clientX: point.clientX,
          clientY: point.clientY,
        },
      })
    );
    context.startX = point.clientX;
    context.startY = point.clientY;
    context.isTap = true;
    context.isPan = false;
    context.isPress = false;
    context.moves = [];

    context.timeoutHandler = setTimeout(() => {
      if (context.isPan) return;

      context.isTap = false;
      context.isPan = false;
      context.isPress = true;

      // console.log("press start");
      element.dispatchEvent(new CustomEvent("pressstart", {}));
    }, 500);

    // console.log(point);
  };

  let move = (point, context) => {
    let dx = point.clientX - context.startX;
    let dy = point.clientY - context.startY;

    if (dx ** 2 + dy ** 2 > 100 && !context.isPan) {
      if (context.isPress) {
        element.dispatchEvent(new CustomEvent("presscancel", {}));
      }

      context.isTap = false;
      context.isPan = true;
      context.isPress = false;
      // console.log("pan start");
      element.dispatchEvent(
        new CustomEvent("panstart", {
          detail: {
            startX: context.startX,
            startY: context.startY,
            clientX: point.clientX,
            clientY: point.clientY,
          },
        })
      );
    }

    if (context.isPan) {
      context.moves.push({
        dx,
        dy,
        t: Date.now(),
      });

      context.moves = context.moves.filter((m) => Date.now() - m.t < 300);
      // console.log("pan");
      element.dispatchEvent(
        new CustomEvent("pan", {
          detail: {
            startX: context.startX,
            startY: context.startY,
            clientX: point.clientX,
            clientY: point.clientY,
          },
        })
      );
    }

    // console.log("move", dx, dy);
  };

  let end = (point, context) => {
    if (context.isPan) {
      let dx = point.clientX - context.startX;
      let dy = point.clientY - context.startY;

      // console.log(context.moves);

      const record = context.moves[0];
      const speed =
        Math.sqrt((record.dx - dx) ** 2 + (record.dy - dy) ** 2) /
        (Date.now() - record.t);

      // console.log("speed: " + speed);

      let isFlick = speed > 1;
      if (isFlick) {
        // console.log("flick");
        element.dispatchEvent(
          new CustomEvent("flick", {
            detail: {
              startX: context.startX,
              startY: context.startY,
              clientX: point.clientX,
              clientY: point.clientY,
              speed,
            },
          })
        );
      }
      // console.log("pan end");

      element.dispatchEvent(
        new CustomEvent("panend", {
          detail: {
            startX: context.startX,
            startY: context.startY,
            clientX: point.clientX,
            clientY: point.clientY,
            speed,
            isFlick,
          },
        })
      );
    }
    if (context.isTap) {
      element.dispatchEvent(new CustomEvent("tap", {}));
    }

    if (context.isPress) {
      element.dispatchEvent(new CustomEvent("press", {}));
    }

    clearTimeout(context.timeoutHandler);
  };

  let cancel = (point, context) => {
    // console.log("cancel");
    element.dispatchEvent(new CustomEvent("canceled", {}));
    clearTimeout(context.timeoutHandler);
  };
}
