const development = {
  username: "root",
  password: null,
  database: "database_development",
  host: "127.0.0.1",
  dialect: "mysql",
  timezone: "+09:00",
  dialectOptions: {
    charset: "utf8mb4",
    dateStrings: true,
    typeCast: true,
  },
};
const test = {
  username: "root",
  password: null,
  database: "database_test",
  host: "127.0.0.1",
  dialect: "mysql",
  timezone: "+09:00",
  dialectOptions: {
    charset: "utf8mb4",
    dateStrings: true,
    typeCast: true,
  },
};
const production = {
  username: "root",
  password: null,
  database: "database_production",
  host: "127.0.0.1",
  dialect: "mysql",
  timezone: "+09:00",
  dialectOptions: {
    charset: "utf8mb4",
    dateStrings: true,
    typeCast: true,
  },
};

module.exports = { development, production, test };
