import { Timeline, Animation } from "../base/animation";
import cubicBezier from "../base/cubicBezier";
import { createElement, Text, Wrapper } from "../util/createElement";
import css from "./carousel.css";

const linear = (t) => t;
const ease = cubicBezier(0.25, 0.1, 0.25, 1);

export default class Carousel {
  constructor() {
    this.position = 0;
    this.timeline = new Timeline();
    this.nextPicStopHandler = null;
    this.changePositionHandler = null;

    this.effect = linear;
    this.autoPlaySpeed = 4000;
    this.autoplay = true;
    this.children = [];
    this.animationPlaying = false;

    this.className = "";
    this.width = 500;
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

  appendChild(child) {
    this.children.push(child);
  }

  render() {
    this.timeline.start();
    const root = <div class={this.className}></div>;

    this.children.forEach((child, currentPosition) => {
      let prePosition =
        (currentPosition - 1 + this.children.length) % this.children.length;
      let nextPosition = (currentPosition + 1) % this.children.length;

      let distanceMoved = 0;
      let onStart = () => {
        if (this.effect === "fade") return;

        // console.log("onStart");
        clearTimeout(this.nextPicStopHandler);
        clearTimeout(this.changePositionHandler);
        this.timeline.pause();

        let currentElement = this.children[currentPosition];
        let currentTransformValue = Number(
          currentElement.style.transform.match(/translateX\(([\s\S]+)px\)/)[1]
        );
        distanceMoved = currentTransformValue + this.width * currentPosition;
        // console.log("distanceMoved: " + distanceMoved);
      };

      let onTap = () => {
        console.log("Tap currentPosition: " + currentPosition);

        if (this.effect === "fade") return;
        if (this.autoplay) {
          this.timeline.resume();
          this.nextPicStopHandler = setTimeout(
            () => this.next(),
            this.autoPlaySpeed
          );
        }
      };

      let onPress = () => {
        console.log("Press currentPosition: " + currentPosition);

        if (this.effect === "fade") return;
        if (this.autoplay) {
          this.timeline.resume();
          this.nextPicStopHandler = setTimeout(
            () => this.next(),
            this.autoPlaySpeed
          );
        }
      };

      let onPan = (event) => {
        if (this.effect === "fade") return;

        let preElement = this.children[prePosition];
        let currentElement = this.children[currentPosition];
        let nextElement = this.children[nextPosition];

        let dx = event.detail.clientX - event.detail.startX;
        let preTransformValue =
          -this.width - this.width * prePosition + distanceMoved + dx;
        let currentTransformValue =
          -this.width * currentPosition + distanceMoved + dx;
        let nextTransformValue =
          this.width - this.width * nextPosition + distanceMoved + dx;

        currentElement.style.transform = `translateX(${currentTransformValue}px)`;
        preElement.style.transform = `translateX(${preTransformValue}px)`;
        nextElement.style.transform = `translateX(${nextTransformValue}px)`;
      };

      let onPanend = (event) => {
        if (this.effect === "fade") return;

        const { startX, startY, clientX, clientY, isFlick } = event.detail;
        let preElement = this.children[prePosition];
        let currentElement = this.children[currentPosition];
        let nextElement = this.children[nextPosition];

        let offset = 0;
        let dx = clientX - startX;
        let half = this.width >> 2;
        if (
          dx > this.width / 3 ||
          dx + distanceMoved > half ||
          (dx + distanceMoved > 0 && isFlick)
        ) {
          // 走了一半以上 或者 Flick
          offset = distanceMoved < -half ? 0 : 1;
        } else if (
          dx < -this.width / 3 ||
          dx + distanceMoved < -half ||
          (dx + distanceMoved < 0 && isFlick)
        ) {
          offset = distanceMoved > half ? 0 : -1;
        }

        // console.log("dx + distanceMoved: " + (dx + distanceMoved));
        // console.log("offset: " + offset);
        this.timeline.reset();
        this.timeline.start();

        let preAnimation = new Animation(
          preElement.style,
          "transform",
          -this.width - this.width * prePosition + distanceMoved + dx,
          offset * this.width - this.width - this.width * prePosition,
          500,
          0,
          this.effect,
          (v) => `translateX(${v}px)`
        );

        let currentAnimation = new Animation(
          currentElement.style,
          "transform",
          -this.width * currentPosition + distanceMoved + dx,
          offset * this.width - this.width * currentPosition,
          500,
          0,
          this.effect,
          (v) => `translateX(${v}px)`
        );

        let nextAnimation = new Animation(
          nextElement.style,
          "transform",
          this.width - this.width * nextPosition + distanceMoved + dx,
          offset * this.width + this.width - this.width * nextPosition,
          500,
          0,
          this.effect,
          (v) => `translateX(${v}px)`
        );

        this.timeline.add(preAnimation);
        this.timeline.add(currentAnimation);
        this.timeline.add(nextAnimation);

        const newPosition =
          (currentPosition - offset + this.children.length) %
          this.children.length;

        // TODO: beforeChange
        if (this.beforeChange && this.position !== newPosition)
          this.beforeChange(this.position, newPosition);

        this.animationPlaying = true;
        this.changePositionHandler = setTimeout(() => {
          // TODO: AfterChange
          if (this.beforeChange && this.position !== newPosition)
            this.afterChanged(newPosition);

          this.position = newPosition;
          this.animationPlaying = false;
        }, 500);

        if (this.autoplay)
          this.nextPicStopHandler = setTimeout(
            () => this.next(),
            this.autoPlaySpeed
          );
      };

      child.style.transform = "translateX(0px)";

      child.setAttribute("enableGesture", true);
      child.addEventListener("start", onStart);
      child.addEventListener("tap", onTap);
      child.addEventListener("press", onPress);
      child.addEventListener("pan", onPan);
      child.addEventListener("panend", onPanend);

      child.addEventListener("dragstart", (e) => e.preventDefault());
      child.addEventListener("contextmenu", (e) => e.preventDefault());

      child.mountTo(root.root);
    });

    if (this.autoplay)
      this.nextPicStopHandler = setTimeout(
        () => this.next(),
        this.autoPlaySpeed
      );

    return root;
  }

  pre() {
    this.gotoPicFunc(this.position - 1 + this.children.length, false);
  }

  next() {
    this.gotoPicFunc(this.position + 1);
  }

  goto(slideNumber) {
    if (slideNumber < 0 || slideNumber >= this.children.length) {
      throw Error(`slideNumber must between 0 to ${this.children.length - 1}`);
    } else if (slideNumber === this.position) {
      console.log("you are now here, no need to go.");
    } else {
      this.gotoPicFunc(slideNumber);
    }
  }

  gotoPicFunc(slideNumber, rtl = true) {
    if (this.animationPlaying) return;
    let destPosition = slideNumber % this.children.length;

    let current = this.children[this.position];
    let dest = this.children[destPosition];

    let currentAnimation, destAnimation;
    if (this.effect === "fade") {
      this.timeline.add(
        new Animation(current.style, "opacity", 1, 0, 800, 0, linear)
      );

      this.timeline.add(
        new Animation(dest.style, "opacity", 0, 1, 800, 0, linear)
      );

      // -this.width * this.position,
      // this.width - this.width * this.position,
      currentAnimation = new Animation(
        current.style,
        "transform",
        -this.width * this.position,
        (rtl ? -1 : 1) * this.width - this.width * this.position,
        0,
        800,
        linear,
        (v) => `translateX(${v}px)`
      );

      // -this.width - this.width * prePosition,
      // -this.width * prePosition,
      destAnimation = new Animation(
        dest.style,
        "transform",
        (rtl ? 1 : -1) * this.width - this.width * destPosition,
        -this.width * destPosition,
        0,
        0,
        linear,
        (v) => `translateX(${v}px)`
      );
    } else {
      // -this.width * this.position,
      // this.width - this.width * this.position,
      currentAnimation = new Animation(
        current.style,
        "transform",
        -this.width * this.position,
        (rtl ? -1 : 1) * this.width - this.width * this.position,
        500,
        0,
        this.effect,
        (v) => `translateX(${v}px)`
      );

      // -this.width - this.width * prePosition,
      // -this.width * prePosition,
      destAnimation = new Animation(
        dest.style,
        "transform",
        (rtl ? 1 : -1) * this.width - this.width * destPosition,
        -this.width * destPosition,
        500,
        0,
        this.effect,
        (v) => `translateX(${v}px)`
      );
    }

    this.timeline.add(currentAnimation);
    this.timeline.add(destAnimation);

    // TODO: beforeChange
    if (this.beforeChange && this.position !== destPosition)
      this.beforeChange(this.position, destPosition);

    this.animationPlaying = true;
    this.changePositionHandler = setTimeout(() => {
      // TODO: AfterChange
      if (this.beforeChange && this.position !== destPosition)
        this.afterChanged(destPosition);

      this.position = destPosition;
      this.animationPlaying = false;
    }, 500);

    if (this.autoplay) {
      clearTimeout(this.nextPicStopHandler);
      this.nextPicStopHandler = setTimeout(
        () => this.next(),
        this.autoPlaySpeed
      );
    }
  }

  mountTo(parent) {
    const root = this.render();
    root.mountTo(parent);

    const rootStyle = getComputedStyle(root.root);
    // console.log("rootStyle:" + rootStyle.width.slice(0, -2));
    this.width = Number(rootStyle.width.slice(0, -2));
  }
}
