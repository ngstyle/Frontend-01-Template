var Generator = require("yeoman-generator");

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // This makes `appname` a required argument.
    this.argument("appname", { type: String, required: true });
    // And you can then access it later; e.g.
    this.log(this.options.appname);
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
  initializing() {}

  paths() {
    this.destinationRoot(`${this.destinationRoot()}/${this.options.appname}`);
    this.log(this.destinationRoot());
    // returns '~/projects'

    this.log(this.destinationPath("index.js"));
    // returns '~/projects/index.js'

    this.log(this.contextRoot);
    // where the user is running yo

    this.log(this.sourceRoot());
    // returns './templates'
  }

  writing() {
    this._copyTpl("lib/createElement.js");
    this._copyTpl("lib/gesture.js");
    this._copyTpl("webpack.config.js");
    this._copyTpl(".nycrc");
    this._copyTpl(".babelrc");
    this._copyTpl("index.html", "src/index.html");
    this._copyTpl("main.js", "src/main.js");
    this._copyTpl("main.spec.js", "test/main.spec.js");

    const pkgJson = {
      name: this.options.appname,
      version: "0.0.0",
      scripts: {
        test: "mocha --require @babel/register",
        coverage: "nyc npm run test",
        start: "webpack-dev-server",
        build: "webpack",
      },
      devDependencies: {
        "@babel/core": "^7.11.1",
        "@babel/plugin-transform-react-jsx": "^7.10.4",
        "@babel/preset-env": "^7.11.0",
        "@babel/register": "^7.10.5",
        "babel-loader": "^8.1.0",
        "html-webpack-plugin": "^4.3.0",
        mocha: "^8.1.1",
        nyc: "^15.1.0",
        webpack: "^4.44.1",
        "webpack-cli": "^3.3.12",
        "webpack-dev-server": "^3.11.0",
      },
    };

    // Extend or create package.json file in destination path
    // this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);

    this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);
  }

  _copyTpl(source, destination) {
    if (!source) return;
    this.fs.copyTpl(
      this.templatePath(source),
      this.destinationPath(destination || source)
    );
  }

  install() {
    this.npmInstall();
  }
};
