const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let mode = "development";
//this is a fix for webpack not picking up browserlistrc (bug)
//browserlistrc is supost to be reading by bable and postcss
//which hot reload doens't pass to prod
//to test change some scss style and will see that hot reload wont show any change
let target = "web";

if (process.env.NODE_ENV === "production") {
  mode = "production";
  //point to the browserslist (webpack bug)
  target = "browserslist";
}

module.exports = {
  mode: mode,
  target: target,
  module: {
    rules: [
      {
        //the regex states that the file starts with s | c
        //and if starting with s that could be followed by a or c (sass or scss)
        //it will support sass, scss and css
        test: /\.(s[ac]|c)ss$/i,
        //the order here is important cus postcss-loader b4 sass-loader
        //will break some //comments but also take vendor prefixes and add to the source-maps
        //Postcss will add a falback, ei. the real colour before the colour prop with the variable colour
        //then run the yarn build and check if the browsers prefix are there
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        //add the ? to say it may or may not have the x
        test: /\.jsx?$/,
        exclude: /node_module/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
  resolve: {
    extensions: [".js", ".jsx"],
  },
  devtool: "source-map",
  devServer: {
    contentBase: "./dist",
    //this will keep the changes done via devtool
    hot: true,
  },
};
