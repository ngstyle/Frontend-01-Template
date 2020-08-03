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

    /*
    // This makes `appname` a required argument.
    this.argument("appname", { type: String, required: true });
    // And you can then access it later; e.g.
    this.log(this.options.appname);
    */
  }

  // 1. Prefix method name by an underscore
  _private_method() {
    this.log("private hey");
  }

  // https://yeoman.io/authoring/running-context.html
  // priority
  // initializing - Your initialization methods (checking current project state, getting configs, etc)
  // prompting - Where you prompt users for options (where you’d call this.prompt())
  // configuring - Saving configurations and configure the project (creating .editorconfig files and other metadata files)
  // default - If the method name doesn’t match a priority, it will be pushed to this group.
  // writing - Where you write the generator specific files (routes, controllers, etc)
  // conflicts - Where conflicts are handled (used internally)
  // install - Where installations are run (npm, bower)
  // end - Called last, cleanup, say good bye, etc
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

  paths() {
    this.log(this.destinationRoot());
    // returns '~/projects'

    this.log(this.destinationPath("index.js"));
    // returns '~/projects/index.js'

    this.log(this.contextRoot);
    // where the user is running yo

    this.log(this.sourceRoot());
    // returns './templates'
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

  _writing() {
    this.log("app name", this.answers.name);
    this.log("cool feature", this.answers.cool);

    const pkgJson = {
      devDependencies: {
        eslint: "^3.15.0",
      },
      dependencies: {
        react: "^16.2.0",
      },
    };

    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);
  }

  _install() {
    this.npmInstall();
  }
};
