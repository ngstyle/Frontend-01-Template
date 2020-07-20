export class Timeline {
  constructor() {
    this.state = "initial";

    this.animations = [];
    this.requestID = null;
    this.tick = () => {
      // console.log("tick");

      let t = Date.now() - this.startTime;

      let animations = this.animations.filter(
        (animation) => !animation.isFinished
      );
      for (const animation of this.animations) {
        // if (t > animation.duration + animation.delay)
        //   t = animation.duration + animation.delay;
        // continue;

        let {
          object,
          property,
          template,
          start,
          end,
          duration,
          delay,
          timingFunc,
          addTime,
        } = animation;

        // 动画duration 过去了多久
        let progression = timingFunc((t - delay - addTime) / duration);

        if (t > duration + delay + addTime) {
          progression = 1;
          animation.isFinished = true;
        }

        // let value = start + progression * (end - start);
        let value = animation.valueFromProgression(progression);

        object[property] = template(value);
        // object[property] = template(timingFunc(start, end)(t - delay));
      }

      if (animations.length)
        this.requestID = requestAnimationFrame(() => this.tick());
    };
  }

  pause() {
    if (this.state !== "playing") return;

    this.state = "paused";
    this.pauseTime = Date.now();
    if (this.requestID !== null) cancelAnimationFrame(this.requestID);
  }

  resume() {
    if (this.state !== "paused") return;

    this.state = "playing";
    // 从暂定到恢复这段时间，不作数，无效
    this.startTime += Date.now() - this.pauseTime;
    this.tick();
  }

  start() {
    if (this.state !== "initial") return;

    this.state = "playing";
    this.startTime = Date.now();
    this.tick();
  }

  restart() {
    if (this.state === "playing") this.pause();

    // this.animations.length = 0;
    // this.animations = [];
    this.animations.forEach((ani) => {
      ani.isFinished = false;
    });
    this.requestID = null;
    this.state = "";
    this.startTime = Date.now();
    this.pauseTime = null;
    this.tick();
  }

  add(animation, addTime) {
    animation.isFinished = false;
    this.animations.push(animation);

    if (this.state === "playing")
      animation.addTime =
        addTime !== void 0 ? addTime : Date.now() - this.startTime;
    else animation.addTime = addTime !== void 0 ? addTime : 0;

    console.log("addTime:" + animation.addTime);
  }
}

export class Animation {
  constructor(
    object,
    property,
    start,
    end,
    duration,
    delay,
    timingFunc,
    template
  ) {
    this.object = object;
    this.property = property;
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.delay = delay || 0;
    this.timingFunc = timingFunc;
    this.template = template;
  }

  valueFromProgression(progression) {
    return this.start + progression * (this.end - this.start);
  }
}

export class ColorAnimation {
  constructor(
    object,
    property,
    start,
    end,
    duration,
    delay,
    timingFunc,
    template
  ) {
    this.object = object;
    this.property = property;
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.delay = delay || 0;
    this.timingFunc = timingFunc;
    this.template = template || ((v) => `rgba(${v.r},${v.g},${v.b},${v.a})`);
  }

  valueFromProgression(progression) {
    // return this.start + progression * (this.end - this.start);
    return {
      r: this.start.r + progression * (this.end.r - this.start.r),
      g: this.start.g + progression * (this.end.g - this.start.g),
      b: this.start.b + progression * (this.end.b - this.start.b),
      a: this.start.a + progression * (this.end.a - this.start.a),
    };
  }
}

/*
时间线里边多动画
复杂场景里多时间线

const animation = new Animation(
  object, property, start, end, duration, delay, timingFunc);

const animation2 = new Animation(
  object2, property2, start, end, duration, delay, timingFunc);

const timeline = new Timeline();
timeline.add(animation);
timeline.add(animation2);

timeline.start();
timeline.pause();
timeline.resume();
timeline.stop();

// animation.start();
// animation.pause();
// animation.resume();
// animation.stop();

setTimeout
setInterval
requestAnimationFrame

*/
