module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@": "./", // or './app' if you want '@' to point to the app folder
          },
        },
      ],
    ],
  };
};
