module.exports = {
  buildOptions: {
    clean: true
  },
  mount: {
    src: "/",
    assets: "/assets"
  },
  plugins: ["@snowpack/plugin-dotenv"]
};