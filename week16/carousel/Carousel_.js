import { Timeline, Animation } from "./animation";
import cubicBezier from "./cubicBezier";
import { createElement, Text, Wrapper } from "./createElement";

const linear = (t) => t;
const ease = cubicBezier(0.25, 0.1, 0.25, 1);

export default class Carousel {
  constructor() {
    this.effect = linear;
    this.autoPlaySpeed = 4000;
    this.autoplay = true;
  }

  setAttribute(name, value) {
    if (name === "effect") {
      if (value === "linear") this.effect = linear;
      else if (value === "ease") this.effect = ease;
      else if (value === "fade") this.effect = "fade";
    } else {
      this[name] = value;
    }
  }

  appendChild(child) {}

  render() {
    let timeline = new Timeline();
    timeline.start();
    let nextPicStopHandler;
    let changePositionHandler;

    const root = <div class="carousel"></div>;
    const children = [];
    this.data.forEach((url, currentPosition) => {
      let prePosition =
        (currentPosition - 1 + this.data.length) % this.data.length;
      let nextPosition = (currentPosition + 1) % this.data.length;

      let distanceMoved = 0;
      let onStart = () => {
        if (this.effect === "fade") return;

        // console.log("onStart");
        clearTimeout(nextPicStopHandler);
        clearTimeout(changePositionHandler);
        timeline.pause();

        let currentElement = children[currentPosition];
        let currentTransformValue = Number(
          currentElement.style.transform.match(/translateX\(([\s\S]+)px\)/)[1]
        );
        distanceMoved = currentTransformValue + 500 * currentPosition;
        console.log("distanceMoved: " + distanceMoved);
      };

      let onTap = () => {
        console.log("Tap currentPosition: " + currentPosition);

        if (this.effect === "fade") return;
        timeline.resume();
        nextPicStopHandler = setTimeout(nextPic, 3000);
      };

      let onPress = () => {
        console.log("Press currentPosition: " + currentPosition);

        if (this.effect === "fade") return;
        timeline.resume();
        nextPicStopHandler = setTimeout(nextPic, 3000);
      };

      let onPan = (event) => {
        if (this.effect === "fade") return;

        let preElement = children[prePosition];
        let currentElement = children[currentPosition];
        let nextElement = children[nextPosition];

        let dx = event.detail.clientX - event.detail.startX;
        let preTransformValue = -500 - 500 * prePosition + distanceMoved + dx;
        let currentTransformValue = -500 * currentPosition + distanceMoved + dx;
        let nextTransformValue = 500 - 500 * nextPosition + distanceMoved + dx;

        currentElement.style.transform = `translateX(${currentTransformValue}px)`;
        preElement.style.transform = `translateX(${preTransformValue}px)`;
        nextElement.style.transform = `translateX(${nextTransformValue}px)`;
      };

      let onPanend = (event) => {
        if (this.effect === "fade") return;

        const { startX, startY, clientX, clientY, isFlick } = event.detail;
        let preElement = children[prePosition];
        let currentElement = children[currentPosition];
        let nextElement = children[nextPosition];

        let offset = 0;
        let dx = clientX - startX;
        if (
          dx > 150 ||
          dx + distanceMoved > 250 ||
          (dx + distanceMoved > 0 && isFlick)
        ) {
          // 走了一半以上 或者 Flick
          offset = distanceMoved < -250 ? 0 : 1;
        } else if (
          dx < -150 ||
          dx + distanceMoved < -250 ||
          (dx + distanceMoved < 0 && isFlick)
        ) {
          offset = distanceMoved > 250 ? 0 : -1;
        }

        console.log("dx + distanceMoved: " + (dx + distanceMoved));
        console.log("offset: " + offset);
        timeline.reset();
        timeline.start();

        let preAnimation = new Animation(
          preElement.style,
          "transform",
          -500 - 500 * prePosition + distanceMoved + dx,
          offset * 500 - 500 - 500 * prePosition,
          500,
          0,
          this.effect,
          (v) => `translateX(${v}px)`
        );

        let currentAnimation = new Animation(
          currentElement.style,
          "transform",
          -500 * currentPosition + distanceMoved + dx,
          offset * 500 - 500 * currentPosition,
          500,
          0,
          this.effect,
          (v) => `translateX(${v}px)`
        );

        let nextAnimation = new Animation(
          nextElement.style,
          "transform",
          500 - 500 * nextPosition + distanceMoved + dx,
          offset * 500 + 500 - 500 * nextPosition,
          500,
          0,
          this.effect,
          (v) => `translateX(${v}px)`
        );

        timeline.add(preAnimation);
        timeline.add(currentAnimation);
        timeline.add(nextAnimation);

        position =
          (currentPosition - offset + this.data.length) % this.data.length;
        nextPicStopHandler = setTimeout(nextPic, this.autoPlaySpeed);
      };

      let element = (
        <img
          src={url}
          onTap={onTap}
          onPress={onPress}
          onStart={onStart}
          onPan={onPan}
          onPanend={onPanend}
          enableGesture={true}
        />
      );
      element.style.transform = "translateX(0px)";
      element.addEventListener("dragstart", (e) => e.preventDefault());
      element.addEventListener("contextmenu", (e) => e.preventDefault());
      children.push(element);

      root.appendChild(element);
    });

    let position = 0;
    let nextPic = () => {
      // TODO: beforeChange
      let nextPosition = (position + 1) % children.length;

      let current = children[position];
      let next = children[nextPosition];

      let currentAnimation, nextAnimation;
      if (this.effect === "fade") {
        timeline.add(
          new Animation(
            current.style,
            "opacity",
            1,
            0,
            this.autoPlaySpeed - 2000 < 0 ? 0 : this.autoPlaySpeed - 2000,
            0,
            linear,
            (v) => v
          )
        );

        timeline.add(
          new Animation(
            next.style,
            "opacity",
            0,
            1,
            this.autoPlaySpeed - 2000 < 0 ? 0 : this.autoPlaySpeed - 2000,
            0,
            linear,
            (v) => v
          )
        );

        currentAnimation = new Animation(
          current.style,
          "transform",
          -500 * position,
          -500 - 500 * position,
          0,
          this.autoPlaySpeed - 2000 < 0 ? 0 : this.autoPlaySpeed - 2000,
          linear,
          (v) => `translateX(${v}px)`
        );

        nextAnimation = new Animation(
          next.style,
          "transform",
          500 - 500 * nextPosition,
          -500 * nextPosition,
          0,
          0,
          linear,
          (v) => `translateX(${v}px)`
        );
      } else {
        currentAnimation = new Animation(
          current.style,
          "transform",
          -500 * position,
          -500 - 500 * position,
          500,
          0,
          this.effect,
          (v) => `translateX(${v}px)`
        );

        nextAnimation = new Animation(
          next.style,
          "transform",
          500 - 500 * nextPosition,
          -500 * nextPosition,
          500,
          0,
          this.effect,
          (v) => `translateX(${v}px)`
        );
      }

      timeline.add(currentAnimation);
      timeline.add(nextAnimation);

      changePositionHandler = setTimeout(() => {
        // TODO: AfterChange
        position = nextPosition;
      }, 500);
      // position = nextPosition;

      if (this.autoplay)
        nextPicStopHandler = setTimeout(nextPic, this.autoPlaySpeed);
    };
    if (this.autoplay)
      nextPicStopHandler = setTimeout(nextPic, this.autoPlaySpeed);

    return root;
  }

  mountTo(parent) {
    this.render().mountTo(parent);
  }
}
