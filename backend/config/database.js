const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("technest", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
