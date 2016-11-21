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
    const today = todayRaw.getDate();
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
    //array that will be mapped. A promise function will be called for each date

  const getIds = (day) => {
    return new Promise((resolve, reject) => {
      DateTable
        .findOne({
          attributes: ['id'],
          where: {
            dateOnly: day,
          },
        })
        .then((response) => { // get all domains for specific date
          const id = response.dataValues.id;
          DateDomain
          .findAll({
            where: {
              dateId: id,
            },
          })
          .then((response) => { // save all domains to array and return them
            const domainsByDate = response.map((domain) => {
              return domain.dataValues;
            });
            resolve(domainsByDate);
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

    // array of promised arrays. Will be resolved by calling promise.all(promisedWeek)
    const promisedWeek = week.map((day) => {
      return getIds(day);
    });

    // next promise function to call. Will be called for each onbject inside each promised
    // array inside promisedWeek
    const getNameAndDate = (entry) => {
      return new Promise((resolve, reject) => {
        Domain.findOne({ where: { id: entry.domainId } })
        .then((domain) => {
          DateTable.findOne({ where: { id: entry.dateId } })
          .then((date) => {
            DateDomain.findOne({ where: { domainId: entry.domainId } })
            .then((datedDom) => {
              const nameDateCount = { count : datedDom.dataValues.count, domain: domain.dataValues.domain, date: date.dataValues.dateOnly }
               resolve(nameDateCount);
            })
            .catch((err) => {
              console.log("ERROR GETTING COUNT IN GETNAME: ", err)
            })
          })
          .catch((err) => {
            console.log("ERROR MATCHING DATE AND NAME IN GETNAME: ", err)
          })
        })
        .catch((err) => {
          console.log("ERROR FINDING DOM IN GETNAME: ", err)
        })
      })
    }

    // make all promised arrays inside promisedArray wait to resolve until their promised
    // objects have resolved
    Promise.all(promisedWeek)
    .then((thisWeek) => {
      console.log("-----RESOLVEDWEEK-----", thisWeek)
      return new Promise((resolve, reject) => {
        const promisedArr = [];
        thisWeek.map((arr) => {
          const promisedFunctions = arr.map((obj) => {
            return getNameAndDate(obj);
          });
          promisedArr.push(promisedFunctions);
        });
        resolve(promisedArr);
      })
      .then((promisedArray) => {
        console.log('-----PROMISED ARRAY-----', promisedArray);
        const resolvedThings = thing.map((subThing) => {
          return Promise.all(subThing);
        });
        console.log('resolve thing', resolvedThings)
        return Promise.all(resolvedThings)
      })
      .then((finalThing) => {
        console.log('final thing', finalThing);
      });




      thisWeek.forEach((day) => {
        const namedAndDatedDoms = day.map((entry) => {
          return getNameAndDate(entry);
        })
        Promise.all(namedAndDatedDoms)
        .then((doms) => {
          const domObjs = {};
           doms.forEach((dom) => {
             const date = dom.date.toISOString().slice(0, 10).replace(/-/g, '');
             if (!domObjs.date) {
               domObjs.date = date
               domObjs.domains = [{ domain: dom.domain, visits: dom.count }];
             } else {
               domObjs.domains.push({ domain: dom.domain, visits: dom.count });
             }
           });

          const weekDataFromDB = [];
          weekDataFromDB.push(domObjs);

          const weekData = weekDataFromDB.map((dateItem) => {
            return {
              date: dateItem.date,
              domains: dateItem.domains,
              totalVisits: dateItem.domains.reduce((mem, curr) => {
                return mem.visits + curr.visits;
              }),
            };
          });
          //  res.status(201).json(weekData);
          console.log("WEEKDATA", weekDataFromDB);
        })
        .catch((err) => {
          console.log("ERROR INSIDE PROMISED DOMS: ", err)
        })
      })
    })
    .catch((err) => {
      console.log("ERROR IN THERE SOMEWHERE! ", err)
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
