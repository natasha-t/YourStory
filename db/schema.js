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

    const todayRaw = new Date();
    const today = todayRaw.getUTCDate();
    const month = todayRaw.getMonth() + 1;
    const year = todayRaw.getFullYear();

    const daysOfTheWeek = {
      today : year + '-' + month + '-' + (today),
      yesterday : year + '-' + month + '-' + (today - 1),
      twoDaysAgo : year + '-' + month + '-' + (today - 2),
      threeDaysAgo : year + '-' + month + '-' + (today - 3),
      fourDaysAgo : year + '-' + month + '-' + (today - 4),
      fiveDaysAgo : year + '-' + month + '-' + (today - 5),
      sixDaysAgo : year + '-' + month + '-' + (today - 6),
    }

    const getWeek = () => {
      const weekArray = [];
      for(let dia in daysOfTheWeek) {
        weekArray.push(daysOfTheWeek[dia]);
      }
      return weekArray;
    }
    const week = getWeek();

  const getData = (day) => {
    return new Promise((resolve, reject) => {
      DateTable
        .findOne({
          attributes: ['id'],
          where: {
            dateOnly: day,
          },
        })
        .then((response) => { // get all domains for specific date
          const id = response['dataValues']['id'];
          DateDomain
          .findAll({
            where: {
              dateId: id,
            },
          })
          .then((response) => { // save all domains to array and return them
            console.log('-----GOT ALL FOR DATE: ');
            const domainsByDate = [];
            response.map((domain) => {
              return domainsByDate.push(domain['dataValues']);
            });
            // console.log('domainsByDate', domainsByDate);
            return resolve(domainsByDate);
          })
          .catch((err) => {
            console.log('error from inside date domain query: ', err);
          });
        })
        .catch((err) => {
          console.log('error: ', err);
        });
      })
    };

    const promisedWeek = week.map((day) => {
      return getData(day);
    });
    console.log("PROMISED", promisedWeek);

    Promise.all(promisedWeek)
    .then((thisWeek) => {
      thisWeek.forEach((day) => {
        day.forEach((entry) => {
          console.log(entry);
        })
      })
    })
    .catch((err) => {
      console.log("ERROR RESOLVING PROMISES:", err)
    })







  //   const date = new Date();
  //   return DateTable.bulkCreate(
  //     [
  //     { dateOnly: date },
  //     { dateOnly: '2016-11-19' },
  //     { dateOnly: '2016-11-18' },
  //     { dateOnly: '2016-11-17' },
  //     { dateOnly: '2016-11-16' },
  //     { dateOnly: '2016-11-15' },
  //     { dateOnly: '2016-11-14' },
  //   ])
  //   .then(() => {
  //     console.log('DateTable created');
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // })
  // .then(() => {
  //   return User.bulkCreate([
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
  //   return Domain.bulkCreate([
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
  //   return DateDomain.bulkCreate([
  //     { domainId: 1, count: 140, dateId: 1 },
  //     { domainId: 2, count: 14, dateId: 1 },
  //     { domainId: 3, count: 24, dateId: 1 },
  //     { domainId: 4, count: 150, dateId: 1 },
  //     { domainId: 2, count: 160, dateId: 2 },
  //     { domainId: 3, count: 46, dateId: 2 },
  //     { domainId: 1, count: 42, dateId: 3 },
  //     { domainId: 1, count: 140, dateId: 4 },
  //     { domainId: 2, count: 14, dateId: 5 },
  //     { domainId: 3, count: 24, dateId: 6 },
  //     { domainId: 4, count: 150, dateId: 7 },
  //   ])
  //   .then(() => {
  //     console.log('DateDomain Table created');
  //   })
  //   .catch((err) => {
  //     console.log('error creating DateDomain table', err);
  //   });
  })
  .then(() => {
    console.log('All tables created');
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
