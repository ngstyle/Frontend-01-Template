import Carousel from "./Carousel";
import { createElement, Text, Wrapper } from "./createElement";

const data = [
  "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
  "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
  "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
  "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
];

let content = data.map((url) => <img src={url}></img>);

let component = (
  // <Carousel data={data} effect={"linear"} autoPlaySpeed={4000} autoplay={true} >
  <Carousel
    className="carousel"
    effect={"ease"}
    // effect={"fade"}
    autoPlaySpeed={3000}
    autoplay={true}
    beforeChange={(from, to) => {
      // console.log("from: " + from, "to: " + to);
    }}
    afterChanged={(current) => {
      console.log("current: " + current);
    }}
  >
    {content}
  </Carousel>
);
component.mountTo(document.body);

let pre = <button click={() => component.pre()}>Pre</button>;
let next = <button click={() => component.next()}>Next</button>;
let goto = <button click={() => component.goto(3)}>Goto(3)</button>;
let actions = (
  <div style="text-align: center; margin-top: 16px">
    {pre} {next} {goto}
  </div>
);
actions.mountTo(document.body);
/*
// Vue style component

import Carousel from "./carousel.vue";

let component = new Carousel();
component.mountTo(document.body);
*/
