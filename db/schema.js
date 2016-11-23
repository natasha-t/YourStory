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

//   const todayRaw = new Date();
//   const today = todayRaw.getDate();
//   const month = todayRaw.getMonth() + 1;
//   const year = todayRaw.getFullYear();
//
//   const daysOfTheWeek = {
//     today: year + '-' + month + '-' + (today),
//     yesterday: year + '-' + month + '-' + (today - 1),
//     twoDaysAgo: year + '-' + month + '-' + (today - 2),
//     threeDaysAgo: year + '-' + month + '-' + (today - 3),
//     fourDaysAgo: year + '-' + month + '-' + (today - 4),
//     fiveDaysAgo: year + '-' + month + '-' + (today - 5),
//     sixDaysAgo: year + '-' + month + '-' + (today - 6),
//   }
//
//   // construct an array of dates. We will map over this array, feeding each date into a
//   // promised query to the database to return domain information for each day
//   const getWeek = () => {
//     const weekArray = [];
//     for(let dia in daysOfTheWeek) {
//       weekArray.push(daysOfTheWeek[dia]);
//     }
//     return weekArray;
//   }
//   // array that will be mapped. A promised function will be called for each date
//   const week = getWeek();
//
// // initial promised function to be called for each date. Returns a domainId, dateId and count
// const getIds = (day) => {
//   return new Promise((resolve, reject) => {
//     DateTable
//       .findOne({
//         attributes: ['id'],
//         where: {
//           dateOnly: day,
//         },
//       })
//       .then((response) => { // get all domains for specific date
//         const id = response.dataValues.id;
//         DateDomain
//         .findAll({
//           where: {
//             dateId: id,
//           },
//         })
//         .then((response) => { // save all domains to array and return them
//           const domainsByDate = response.map((domain) => {
//             return domain.dataValues;
//           });
//           return resolve(domainsByDate);
//         })
//         .catch((err) => {
//           console.log('ERROR INSIDE DATEDOMAIN QUERY: ', err);
//         });
//       })
//       .catch((err) => {
//         console.log('ERROR: ', err);
//       });
//     })
//   };
//
//   // promisedWeek is the result of calling each promised function for each date. Returns an array
//   // of promised arrays. Inside each promised array are objects with domId, dateId and count.
//   const promisedWeek = week.map((day) => {
//     return getIds(day);
//   });
//
//   // next promised function to call. Will be called for each object inside each promised
//   // array inside promisedWeek. Returns the strings (name and date) and count (again)
//   // for each object.
//   const getNameAndDate = (entry) => {
//     return new Promise((resolve, reject) => {
//       Domain.findOne({ where: { id: entry.domainId } })
//       .then((domain) => {
//         DateTable.findOne({ where: { id: entry.dateId } })
//         .then((date) => {
//           DateDomain.findOne({ where: { domainId: entry.domainId } })
//           .then((datedDom) => {
//             const nameDateCount = { count: datedDom.dataValues.count, domain: domain.dataValues.domain, date: date.dataValues.dateOnly }
//              return resolve(nameDateCount);
//           })
//           .catch((err) => {
//             console.log("ERROR GETTING COUNT IN GETNAME: ", err)
//           })
//         })
//         .catch((err) => {
//           console.log("ERROR MATCHING DATE AND NAME IN GETNAME: ", err)
//         })
//       })
//       .catch((err) => {
//         console.log("ERROR FINDING DOM IN GETNAME: ", err)
//       })
//     })
//   }
//
//   // We have an array full of promised arrays, returned from our getIds function, which we
//   // will resolve by calling promise.all(promisedWeek)
//   Promise.all(promisedWeek)
//   // After we call promise.all, we have an array of arrays with objects inside that still need to be mapped
//   // and asynchronously queried to get the names and dates associated with each ID.
//   .then((thisWeek) => {
//     return new Promise((resolve, reject) => {
//       const promisedArr = [];
//       // We map over the first resolved array, and then map over each of its nested arrays
//       thisWeek.map((eachDay) => {
//         //  we call a promised function on each object in the subarray
//         const promisedFunctions = eachDay.map((obj) => {
//           // this will return a bunch of promised objects
//           return getNameAndDate(obj);
//         });
//         // push all of these promises into a new array to be resolved
//         promisedArr.push(promisedFunctions);
//       });
//       // This is the outrmost array, which will be resolved last
//       resolve(promisedArr);
//     })
//     .then((promisedArray) => {
//       // we returned a promised array full of promised subarrays, which we will now resolve
//       const resolvedArray = promisedArray.map((subArray) => {
//         // resolve all promised subArrays - this is the bottom!
//         return Promise.all(subArray);
//       });
//       // resolve outer promised array
//       return Promise.all(resolvedArray)
//     })
//     .catch((err) => {
//       console.log("ERROR RESOLVING SUB ARRAYS: ", err)
//     })
//     .catch((err) => {
//       console.log("ERROR INSIDE PROMISED ARRAY: ", err)
//     })
//     .then((finalArray) => {
//       // we returned a resolved array full of resolved subarrays, which we can now operate on
//       // synchronously
//       console.log("----FINAL OBJECT----",
//         finalArray.map((arr) => {
//           const date = arr[0].date.toISOString().slice(0, 10).replace(/-/g, '');
//           const finalObj = {};
//           finalObj.date = date;
//           finalObj.domains = arr.map((obj) => {
//             return obj.domain;
//           });
//           const toSum = arr.map((obj) => {
//             return obj.count;
//           });
//           finalObj.count = toSum.reduce((mem, curr) => {
//             return mem + curr;
//           });
//           return finalObj;
//         }));
//     })
//     .catch((err) => {
//       console.log("ERROR INSIDE FINAL OBJECT CONSTRUCTION: ", err);
//     })
//   })
//   .catch((err) => {
//     console.log("ERROR IN THERE SOMEWHERE! ", err)
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
