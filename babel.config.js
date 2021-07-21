module.exports = {
  //add react preset with runtime
  //with this implementation you don't need to import react
  //when you are only using jsx in a file
  presets: [
    "@babel/preset-env",
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
};
