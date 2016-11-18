'use strict';

const Sequelize = require('sequelize');
const db = require('./config');

db
  .authenticate()
  .then(() => {
    console.log('Connection established from schema');
  })
  .catch((err) => {
    console.log('Unable to connect: ', err);
  });

const User = db.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  chrome_id: {
    type: Sequelize.STRING,
    unique: true,
  },
  username: Sequelize.STRING,
});

const Url = db.define('url', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  url: Sequelize.STRING,
});

const Domain = db.define('domain', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  domain: {
    type: Sequelize.STRING,
    unique: true,
  },
});

const Category = db.define('category', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  category: {
    type: Sequelize.STRING,
    unique: true,
  },
});

const DateTable = db.define('date', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  dateOnly: Sequelize.DATEONLY,
  dateTime: Sequelize.DATE,
});

const UserDomain = db.define('users_domains', {
  count: Sequelize.INTEGER,
});

const DateDomain = db.define('dates_domains', {
  count: Sequelize.INTEGER,
});

Domain.belongsToMany(User, { through: UserDomain, foreignKey: 'domainId' });
User.belongsToMany(Domain, { through: UserDomain, foreignKey: 'userId' });

User.hasMany(Url);
Url.belongsTo(User);

Category.hasMany(Domain, { as: 'Sites' });
Domain.belongsTo(Category);

Domain.belongsToMany(DateTable, { through: DateDomain, foreignKey: 'domainId' });
DateTable.belongsToMany(Domain, { through: DateDomain, foreignKey: 'dateId' });

db
  .sync({ force: true })
  .then(() => {
    console.log('Tables created')

    const date = new Date();

    DateTable.create({ dateOnly: date, dateTime: date })
    .catch((err) => {
      console.log(err)
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = {
  User: User,
  Domain: Domain,
  UserDomain: UserDomain,
  Category: Category,
};
