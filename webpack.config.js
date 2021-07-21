const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

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
  //save the images in a folder
  //findout what the query means in the webpack docs
  //use clean: true to clean the dist folder
  output: {
    clean: true,
    path: path.resolve(__dirname, "./dist"),
    assetModuleFilename: "images/[hash][ext][query]",
    filename: "main.js",
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        //1. this can be changed for inline as: type: "asset/inline",
        //and it will be bundled into our js file
        //this can be useful if we are using tiny tyni images only
        //2. option is to use only asset as : type:asset
        //webpack will determi based on default max size (akb) if the image
        //should go to image folder or be added inline
        //3. and using type: "asset/resource", it will go all to a image folder
        type: "asset",
        //rase the max cap for the images, view webpack docs for this
        // parser: {
        //   dataUrlCondition: {
        //     maxSize: 30 * 1024,
        //   },
        // },
      },
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
          //Created this as obj to fix issue with image
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: "" },
          },

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
  //adding the template to keep div#root to file (basically to keep integrity of the html)
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "body",
    }),
  ],
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
