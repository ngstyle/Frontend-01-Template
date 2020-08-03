// var tty = require("tty");
// var ttys = require("ttys");
// var rl = require("readline");

// var stdin = ttys.stdin;
// var stdout = ttys.stdout;

// stdout.write("Hello world!\n");
// // stdout.write("Second line.\n");
// stdout.write("\033[1A");
// stdout.write("Nohc,\n");

const stdin = process.stdin;
const stdout = process.stdout;
// receive one char
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding("utf8");

const choices = ["react", "angular", "vue"];
let selectedIndex = 0;

stdin.on("data", function (key) {
  // up
  if (key == "\u001B\u005B\u0041" && selectedIndex > 0) {
    selectedIndex--;
    // stdout.write("up\n");
    stdout.write(" ");
    left();
    up();
    stdout.write("\x1b[36mx");
    left();
  }

  // down
  if (key == "\u001B\u005B\u0042" && selectedIndex < choices.length - 1) {
    selectedIndex++;
    // stdout.write("down\n");
    stdout.write(" ");
    left();
    down();
    stdout.write("\x1b[36mx");
    left();
  }

  /*
  if (key == "\u001B\u005B\u0044") {
    stdout.write("left\n");
  }

  if (key == "\u001B\u005B\u0043") {
    stdout.write("right\n");
  }
  */

  // enter
  if (key === "\r") {
    down(choices.length - selectedIndex);
    left();
    stdout.write(`\x1b[0m${choices[selectedIndex]} selected \n`);
    process.exit();
  }

  // ctrl-c
  if (key == "\u0003") {
    down(choices.length - selectedIndex);
    left();
    process.exit();
  }
});

function up(n = 1) {
  stdout.write("\033[" + n + "A");
}

function down(n = 1) {
  stdout.write("\033[" + n + "B");
}

function right(n = 1) {
  stdout.write("\033[" + n + "C");
}

function left(n = 1) {
  stdout.write("\033[" + n + "D");
}

void (function (choices) {
  for (let i = 0; i < choices.length; i++) {
    const choice = choices[i];
    if (i === selectedIndex) {
      stdout.write(`[x] ${choice} \n`);
    } else {
      stdout.write(`[ ] ${choice} \n`);
    }
  }
  up(choices.length);
  right();
})(choices);
