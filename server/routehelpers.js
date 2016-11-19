'use strict';

const db = require('../db/config');
const Sequelize = require('sequelize');
const _ = require('underscore');
const User = require('../db/schema').User;
const Domain = require('../db/schema').Domain;
const Category = require('../db/schema').Category;
const DateTable = require('../db/schema').DateTable;
const DateDomain = require('../db/schema').DateDomain;
const UserDomain = require('../db/schema').UserDomain;
const Promise = require('bluebird');
const dbHelpers = require('../db/dbHelpers');
const axios = require('axios');
const btoa = require('btoa');
const md5 = require('md5');

// Establishes the connection to the database
db.authenticate().then(() => {
  console.log('Connection established');
}).catch((err) => {
  console.log('Unable to connect: ', err);
});

// database routes / queries
module.exports = {
  postHistory: (req, res) => {
    console.log('inside postHistory---------------');
    const allData = req.body.history;
    const id = req.body.chromeID;

    // ============= add parsed domain to each history object in allData array ================
    allData.map((historyItem) => {
      const url = historyItem.url;
      let domain;
      if (url.indexOf('://') > -1) {
        domain = url.split('/')[2];
      } else {
        domain = url.split('/')[0];
      }
      if (domain.slice(0, 4) === 'www.') {
        domain = domain.slice(4);
      }
      domain = domain.split(':')[0];
      historyItem.domain = domain;
      return historyItem;
    });

    // ================ add unique domains to uniqueDomains object ============
    const uniqueDomains = {};

    allData.map((historyItem) => {
      if (uniqueDomains[historyItem.domain]) {
        return uniqueDomains[historyItem.domain].push(historyItem);
      }
      uniqueDomains[historyItem.domain] = [historyItem];
      return uniqueDomains[historyItem.domain];
    });

    // ===============================================================
    // ================== PROMISE USER ID ============================
    // ===============================================================
    const getUser = () => {
      return User.findOne({ where: { chrome_id: req.session.chromeID } })
      .then((user) => {
        return user['dataValues']['id'];
      })
      .catch((err) => {
          console.log('error getting userId from Users: ', err);
      });
    };

    const promisedUserId = new Promise((resolve, reject) => {
      return resolve(getUser());
    });

    // ===============================================================
    // == Save All Domains to Domains table & Return as Promise ====
    // ===============================================================
    const saveDomains = () => {
      return promisedUserId
      .then((userId) => {
        for (let key in uniqueDomains) {
          return Domain
            .findOrCreate({ where: { domain: key, userId: userId } })
            .then(() => {
              const date = new Date();
              return DateTable
              .findOrCreate({ where: { dateOnly: date, dateTime: date } });
            })
            .catch((err) => {
              console.log('error saving all dates', err);
            })
          .catch((err) => {
            console.log('error saving all domains', err);
          })
          .done(() => {
            console.log('Done saving all domains');
          });
        }
      });
    };

    const promisedSavedDomains = new Promise((resolve, reject) => {
      return resolve(saveDomains());
    });

    // ===============================================================
    // ====== Save domain and user to Users_Domains join table =====
    // ===============================================================
    promisedSavedDomains
    .then(() => {
      User
      .findOne({ where: { chrome_id: req.session.chromeID } })
      .then((user) => {
      // ==== save domains for a current user =====
      for (let key in uniqueDomains) {
        Domain
        .findOne({ where: { domain: key } })
        .then((domain) => {
          // console.log("DOMAIN FROM USERS_DOMAINS INSERT:", domain);
          let totalCount = dbHelpers.tallyVisitCount(uniqueDomains[key]);

          user
          .addDomain(domain, { count: totalCount })
          .catch((err) => {
            console.log('error when adding total count to User_Domains table:', err);
          });

          DateTable
          .findOne({ where: { dateOnly: new Date() } })
          .then((todayDate) => {
            console.log("todayDate");
            todayDate.addDomain(domain, { count: totalCount });
            console.log('successfully added date to Dates table');
          })
          .catch((err) => {
            console.log('error when adding date to Dates table', err);
          });

          domain.getCategory()
          .then((category) => {
            console.log('trying to get category', category);
            if (category === null) {
              const apiUrl = 'https://api.webshrinker.com/categories/v2/';
              const hashURL = btoa('http://www.' + domain.dataValues.domain);
              axios({
                method: 'get',
                url: apiUrl + hashURL,
                auth: {
                  // username: 'UL1QVH3FAtR6eoEJJIs4',
                  // password: 'ZCZCYLA6wtqYNDpxbbRE',
                },
              })
              .then((response) => {
                Category
                .findOrCreate({ where: { category: response.data.data[0].categories[0] } })
                .then((cat) => {
                  domain.updateAttributes({
                    categoryId: cat[0].dataValues.id,
                  });
                })
                .catch((err) => {
                  console.log('error finding or creating category', err);
                });
              })
              .catch((err) => {
                console.log('error getting category from webshrinker', err);
              });
            }
          });
        })
        .catch((err) => {
          console.log('error finding domain by key in uniqueDomains object: ', err);
        })
        .done(() => {
          console.log('Done saving and categorizing domain for user');
        });
      }
      });
    });


    User.findOne({ where: { chrome_id: req.session.chromeID } })
    .then((user) => {

      let visData = [];

      user.getDomains()
      .then((domains) => {
        for (let i = 0; i < domains.length; i++) {
          visData.push(
            { domain: domains[i].dataValues.domain,
              visits: domains[i].dataValues.users_domains.count }
            );
        }
        res.status(201).json(visData);
      });
    });
  },

  postUser: (req, res) => {
    // console.log('inside routehelpers.js postUser API');
    // save to the session object the chrome id
    req.session.chromeID = req.body.chromeID;
    // console.log('session chrome id', req.session.chromeID);
    // find or create user in the db
    User.findOrCreate({ where: { chrome_id: req.session.chromeID },
      defaults: { username: req.body.username },
    })
      .spread((user, created) => {
        console.log(user.get({
          plain: true,
        }));
        // console.log('user_created:', created);
        // send back to the client unique client identifier(Chrome_id)
        // console.log('SERVER: sent chrome id', req.session.user)
        res.json(req.session.chromeID);
      });
  },

  getCatData: (req, res) => {
    const getAllUserDomains = () => {
      return User.findOne({ where: { chrome_id: req.session.chromeID } })
      .then((user) => {
        return user.getDomains()
        .catch((err) => {
          console.log(err);
        });
      })
      .catch((err) => {
        console.log(err);
      });
    };

    let domains = new Promise((resolve, reject) => {
      return resolve(getAllUserDomains());
    });

    const getCategories = () => {
        return Category.findAll()
        .catch((err) => {
          console.log(err);
        });
    };

    let categories = new Promise((resolve, reject) => {
      return resolve(getCategories());
    });

    categories
    .then((categories) => {
      console.log('categories', categories.length);
    });

  const getDomArr = () => {
   let domArr = [];
   return domains
     .then((domains) => {
        for (let i = 0; i < domains.length; i++) {
          let domain = {};
          domain['name'] = domains[i].dataValues.domain;
          domain['categoryId'] = domains[i].dataValues.categoryId;
          domain['count'] = domains[i].dataValues.users_domains.count;
          domArr.push(domain);
        }
       return domArr;
     });
  }

  let domainArr = new Promise((resolve, reject) => {
        return resolve(getDomArr());
      })

  const getCatObj = () => {
    let catObjs = {};
    return categories
           .then((categories) => {
            for (let i = 0; i < categories.length; i++) {
              catObjs[categories[i].dataValues.category] = categories[i].dataValues.id;
            }
            return catObjs;
           })
  }

  let categoryObj = new Promise((resolve, reject) => {
        return resolve(getCatObj());
      })

    let catData = [];

    domainArr
    .then((domArr) => {
      categoryObj
      .then((catObj) => {

         for (let category in catObj) {
          let cat = {};
          cat['id'] = catObj[category];
          cat['category'] = category;
          cat['domains'] = [];
          cat['totalCount'] = 0;
          catData.push(cat);
         }


         for (let domain of domArr) {
           for (let i = 0; i < catData.length; i++) {
             if (catData[i].id === domain.categoryId) {
              catData[i].domains.push(domain.name);
              catData[i].totalCount += domain.count;
             }
           }
         }


         res.status(201).json(catData);

      })
    })
  },

  getWeekData: (req, res) => {
    // const weekDataFromDB = { '2016-11-18': [{ domain: 'github.com', visits: 192 },
    //                       { domain: 'stackoverflow.com', visits: 7 },
    //                       { domain: 'google.com', visits: 15 },
    //                       { domain: 'readthedocs.org', visits: 2 },
    //                       { domain: 'w3schools.com', visits: 1 },
    //                       { domain: 'docs.sequelizejs.com', visits: 4 },
    //                       { domain: 'calendar.google.com', visits: 7 },
    //                       { domain: 'postgresql.org', visits: 1 },
    //                       { domain: 'docs.google.com', visits: 94 },
    //                       { domain: 'mail.google.com', visits: 18 },
    //                       { domain: 'accounts.google.com', visits: 12 },
    //                       { domain: 'hackreactorcore.force.com', visits: 2 },
    //                       { domain: 'waffle.io', visits: 8 },
    //                       { domain: 'developer.mozilla.org', visits: 2 },
    //                       { domain: 'challenge.makerpass.com', visits: 9 }],
    //                     '2016-11-19': [{ domain: 'learn.makerpass.com', visits: 7 },
    //                       { domain: 'repl.it', visits: 8 },
    //                       { domain: 'haveibeenpwned.com', visits: 4 },
    //                       { domain: 'redux.js.org', visits: 4 },
    //                       { domain: 'v4-alpha.getbootstrap.com', visits: 4 },
    //                       { domain: 'getbootstrap.com', visits: 2 },
    //                       { domain: 'npmjs.com', visits: 1 }],
    //                   };

    const weekDataFromDB = [{
      date: '2016-11-18',
      domains: [{ domain: 'github.com', visits: 192 },
                { domain: 'stackoverflow.com', visits: 7 },
                { domain: 'google.com', visits: 15 },
                { domain: 'readthedocs.org', visits: 2 },
                { domain: 'w3schools.com', visits: 1 },
                { domain: 'docs.sequelizejs.com', visits: 4 },
                { domain: 'calendar.google.com', visits: 7 },
                { domain: 'postgresql.org', visits: 1 },
                { domain: 'docs.google.com', visits: 94 },
                { domain: 'mail.google.com', visits: 18 },
                { domain: 'accounts.google.com', visits: 12 },
                { domain: 'hackreactorcore.force.com', visits: 2 },
                { domain: 'waffle.io', visits: 8 },
                { domain: 'developer.mozilla.org', visits: 2 },
                { domain: 'challenge.makerpass.com', visits: 9 }],
      count: 150,
    },
      { date: '2016-11-19',
        domains: [{ domain: 'learn.makerpass.com', visits: 7 },
                  { domain: 'repl.it', visits: 8 },
                  { domain: 'haveibeenpwned.com', visits: 4 },
                  { domain: 'redux.js.org', visits: 4 },
                  { domain: 'v4-alpha.getbootstrap.com', visits: 4 },
                  { domain: 'getbootstrap.com', visits: 2 },
                  { domain: 'npmjs.com', visits: 1 }],
        count: 150,
    }];

    // ===============================================================
    // ================== PROMISE USER ID ============================
    // ===============================================================
    const getUser = () => {
      return User.findOne({ where: { chrome_id: req.session.chromeID } })
      .then((user) => {
        return user['dataValues']['id'];
      })
      .catch((err) => {
          console.log('error getting userId from Users: ', err);
      });
    };

    const promisedUserId = new Promise((resolve, reject) => {
      return resolve(getUser());
    });


    const d = new Date();
    d.setDate(d.getDate() - 2);
    console.log('date', d);

    //get foreign key ID for specific Date
      DateTable
      .findOne({
        attributes: ['id'],
        where: {
          dateOnly: d,
        },
      })
      .then((response) => { //get all domains for specific date
        const id = response['dataValues']['id'];
        return DateDomain
          .findAll({
            where: {
              dateId: id,
            },
          })
          .then((response) => { // save all domains to array and return them
            // console.log('got all domains for specified date: ', response);
            
            
            const domainsByDate = [];
            response.map((domain) => {
              return domainsByDate.push(domain['dataValues']);
            });
            console.log('domainsByDate', domainsByDate);
            return domainsByDate;
          })
          .then((response) => {
            console.log('response: ', response);
          })
          .catch((err) => {
            console.log('error fomr inside date domain query: ', err);
          });
      })
      .catch((err) => {
        console.log('error: ', err);
      });

    const weekData = {};

    weekDataFromDB.map((dateItem) => {
        const totalVists = dateItem['domains'].reduce((a, b) => {
          return { visits: a.visits + b.visits };
        });
        const day = dateItem['date'];
        return weekData[day] = totalVists;
    });

    res.status(201).json(weekData);
  },
};

// create a date / count / domain_id tabl
// when inserting a new domain, grab the current day
// lookup in the date table to see if current date is there
// if it is, increase that date visit count
// if not, add it and set count to visit count for that domain
