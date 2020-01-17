const path = require("path");

module.exports = {
  webpack(config, options) {
    config.resolve.alias["components"] = path.join(
      __dirname,
      "webapp/components"
    );
    config.resolve.alias["utils"] = path.join(__dirname, "webapp/utils");
    return config;
  }
};
