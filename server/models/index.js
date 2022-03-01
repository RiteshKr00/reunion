const dbConfig = require("../config/db.config.js");
const { Sequelize, DataType, DataTypes } = require("sequelize");

// const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
//   host: dbConfig.HOST,
//   dialect: dbConfig.dialect,
//   operatorsAliases: false,
//   pool: {
//     max: dbConfig.pool.max,
//     min: dbConfig.pool.min,
//     acquire: dbConfig.pool.acquire,
//     idle: dbConfig.pool.idle,
//   },
// });
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
sequelize
  .authenticate()
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log("Error : " + err);
  });
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("./user.model")(sequelize, DataTypes);
db.post = require("./post.model")(sequelize, DataTypes);
db.comment = require("./comment.model")(sequelize, DataTypes);
db.user.hasMany(db.post);
db.post.belongsTo(db.user);
db.post.hasMany(db.comment);
db.comment.belongsTo(db.post);
module.exports = db;
