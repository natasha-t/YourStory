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

Domain.belongsToMany(User, { through: UserDomain, foreignKey: 'domainId' });
User.belongsToMany(Domain, { through: UserDomain, foreignKey: 'userId' });

User.hasMany(Url);
Url.belongsTo(User);

Category.hasMany(Domain);
Domain.belongsTo(Category);

//  create tables in database
db
  .sync({ force: true })
  .then(() => {
    console.log('Tables created');
    User.create({ username: 'Lizzie' })
    .then(()=> {
      console.log('user created!');
    })

    Domain.create({ domain: 'google.com' })
    .then(()=> {
      console.log('domain created');
    })

    Domain.create({ domain: 'yahoo.com' })
    .then(()=> {
      console.log('domain created');
    })

    Domain.create({ domain: 'etsy.com' })
    .then(()=> {
      console.log('domain created');
    })

    Domain.create({ domain: 'target.com' })
    .then(()=> {
      console.log('domain created');
    })

    Category.create({ category: 'search'})

    Category.create({ category: 'shopping'})

    Domain.findOne({ where: { categoryId: true } })
    .then(() => {
      Category.findOne({ where: })
    })





  })
  .catch((err) => {
    console.log(err);
  });

module.exports = {
  User: User,
  Domain: Domain,
  UserDomain: UserDomain,
};
