var Generator = require("yeoman-generator");

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // Next, add your custom code
    this.option("babel"); // This method adds support for a `--babel` flag

    // 2. Use instance methods:
    this.helperMethod = function () {
      console.log("won't be called automatically");
    };
  }

  // 1. Prefix method name by an underscore
  _private_method() {
    this.log("private hey");
  }

  // https://yeoman.io/authoring/running-context.html
  // priority
  initializing() {
    this._method2();
    this._private_method();
  }

  method1() {
    this.log("method 1 just ran");
  }

  _method2() {
    this.log("method 2 just ran");
  }

  async prompting() {
    this.answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname, // Default to current folder name
      },
      {
        type: "confirm",
        name: "cool",
        message: "Would you like to enable the Cool feature?",
      },
    ]);
  }

  writing() {
    this.log("app name", this.answers.name);
    this.log("cool feature", this.answers.cool);
  }
};
