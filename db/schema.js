'use strict';

const Sequelize = require('sequelize');
const db = require('./config');

// TODO: look into putting sync inside authenticate promise
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
    // unique: true,
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
// User.hasMany(Domain, { as: 'Sitess' });
Domain.belongsTo(User);

Domain.belongsToMany(DateTable, { through: DateDomain, foreignKey: 'domainId' });
DateTable.belongsToMany(Domain, { through: DateDomain, foreignKey: 'dateId' });


db
  .sync({ force: false })
  .then(() => {
    console.log('Tables created')
  //   const date = new Date();

  //   DateTable.bulkCreate([{ dateOnly: date }, { dateOnly: '2016-11-17' }, { dateOnly: '2016-11-16' }])
  //   .then(() => {
  //     console.log('DateTable created');
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // })
  // .then(() => {    
  //   User.bulkCreate([
  //     { username: 'Natasha' },
  //     { username: 'Lizzie' },
  //     { username: 'Bruna' },
  //     { username: 'Melba' },
  //   ])
  //   .then(() => {
  //     console.log('User Table created');
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // })
  // .then(() => {    
  //   Domain.bulkCreate([
  //     { domain: 'google.com', userId: 1 },
  //     { domain: 'yelp.com', userId: 1 },
  //     { domain: 'facebook.com', userId: 3 },
  //     { domain: 'wsj.com', userId: 2 },
  //   ])
  //   .then(() => {
  //     console.log('Domain Table created');
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // })
  // .then(() => {    
  //   DateDomain.bulkCreate([
  //     { domainId: 1, count: 140, dateId: 1 },
  //     { domainId: 2, count: 14, dateId: 1 },
  //     { domainId: 3, count: 24, dateId: 1 },
  //     { domainId: 4, count: 150, dateId: 1 },
  //     { domainId: 2, count: 160, dateId: 2 },
  //     { domainId: 3, count: 46, dateId: 2 },
  //     { domainId: 1, count: 42, dateId: 2 },
  //   ])
  //   .then(() => {
  //     console.log('DateDomain Table created');
  //   })
  //   .catch((err) => {
  //     console.log('error creating DateDomain table', err);
  //   });
  })
  .catch((err) => {
    console.log('error', err);
  });


module.exports = {
  User: User,
  Domain: Domain,
  UserDomain: UserDomain,
  Category: Category,
  DateDomain: DateDomain,
  DateTable: DateTable,
};
