module.exports = {
  buildOptions: {
    clean: true
  },
  mount: {
    src: "/"
  },
  plugins: ["@snowpack/plugin-dotenv"]
};