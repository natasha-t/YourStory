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

const UserDomain = db.define('users_domains', {
  count: Sequelize.INTEGER,
});

Domain.belongsToMany(Category, { through: DomainCategory, foreignKey: 'domainId' });
Category.belongsToMany(Domain, { through: DomainCategory, foreignKey: 'categoryId' });

Domain.belongsToMany(User, { through: UserDomain, foreignKey: 'domainId' });
User.belongsToMany(Domain, { through: UserDomain, foreignKey: 'userId' });

User.hasMany(Url);
Url.belongsTo(User);

//  create tables in database
db
  .sync({ force: true })
  .then(() => {
    console.log('Tables created');
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = {
  User: User,
  Domain: Domain,
  UserDomain: UserDomain,
  DomainCategory: DomainCategory,
};
