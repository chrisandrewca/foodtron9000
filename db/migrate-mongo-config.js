require('dotenv').config();

const config = {
  changelogCollectionName: "migrateMongoChangelog",
  migrationFileExtension: ".js",
  migrationsDir: "migrations",
  mongodb: {
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    url: process.env.MONGO_CONNECTION
  }
};

module.exports = config;