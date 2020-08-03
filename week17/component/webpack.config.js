module.exports = {
  entry: "./main.js",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              [
                "@babel/plugin-transform-react-jsx",
                {
                  pragma: "createElement",
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.vue/,
        use: {
          loader: require.resolve("./loader/myloader.js"),
        },
      },
      {
        test: /\.css/,
        use: {
          loader: require.resolve("./loader/css-loader.js"),
        },
      },
    ],
  },
  mode: "development",
};
