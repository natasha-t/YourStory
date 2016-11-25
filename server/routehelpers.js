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
          console.log('each domain that should be saved:', key);
          Domain
            .findOrCreate({ where: { domain: key, userId: userId } })
            .then(() => {
              const date = new Date();
              DateTable
              .findOrCreate({ where: { dateOnly: date } })
              .catch((err) => {
                console.log('error saving one date: ', err);
              });
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
        const userID = user['dataValues']['id'];

      // ==== save domains for a current user =====
      for (let key in uniqueDomains) {
        const userID = user['dataValues']['id'];
        Domain
        .findOne({ where: { domain: key, userId: userID } })
        .then((domain) => {
          let totalCount = dbHelpers.tallyVisitCount(uniqueDomains[key]);

          user
          .addDomain(domain, { count: totalCount })
          .catch((err) => {
            console.log('error when adding total count to User_Domains table:', err);
          });

          DateTable
          .findOne({ where: { dateOnly: new Date() } })
          .then((todayDate) => {
            todayDate.addDomain(domain, { count: totalCount });
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
                  username: 'UL1QVH3FAtR6eoEJJIs4',
                  password: 'ZCZCYLA6wtqYNDpxbbRE',
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
    req.session.chromeID = req.body.chromeID;

    User.findOrCreate({ where: { chrome_id: req.session.chromeID },
      defaults: { username: req.body.username },
    })
      .spread((user, created) => {
        console.log(user.get({
          plain: true,
        }));

        res.json(req.session.chromeID);
      });
  },

  getUser: (req, res) => {
    console.log("inside get user");
    req.session.chromeID = req.body.chromeID;

    User.findOne({ where: { chrome_id: req.session.chromeID } })
    .then((user) => {
      console.log("user from getUser", user);
      if (user === null) {
        user = 'User';
      }
      res.status(201).json(user);
    })
    .catch((err) => {
      console.log("error sending username", err);
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

  const getDomArr = () => {
   let domArr = [];
   return domains.then((domains) => {
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
    });

    const getCatObj = () => {
      let catObjs = {};
      return categories
             .then((categories) => {
               for (let i = 0; i < categories.length; i++) {
                 catObjs[categories[i].dataValues.category] = categories[i].dataValues.id;
               }
               return catObjs;
             });
    };

    let categoryObj = new Promise((resolve, reject) => {
      return resolve(getCatObj());
    });

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
             console.log('domain inside domArr: ', domain);
             if (catData[i].id === domain.categoryId) {
              // catData[i].domains.push(domain.name);
              catData[i].domains.push({ label: domain.name, count: domain.count })
              catData[i].totalCount += domain.count;

             }
           }
         }

         res.status(201).json(catData);
      });
    });
  },

  getWeekData: (req, res) => {
    console.log("ID:::", req.session.chromeID)

    const todayRaw = new Date();
    const today = todayRaw.getUTCDate();
    const month = todayRaw.getMonth() + 1;
    const year = todayRaw.getFullYear();

    const daysOfTheWeek = {
      today: year + '-' + month + '-' + (today),
      yesterday: year + '-' + month + '-' + (today - 1),
      twoDaysAgo: year + '-' + month + '-' + (today - 2),
      threeDaysAgo: year + '-' + month + '-' + (today - 3),
      fourDaysAgo: year + '-' + month + '-' + (today - 4),
      fiveDaysAgo: year + '-' + month + '-' + (today - 5),
      sixDaysAgo: year + '-' + month + '-' + (today - 6),
    }

    // construct an array of dates. We will map over this array, feeding each date into a
    // promised query to the database to return domain information for each day

    const getWeek = () => {
      const weekArray = [];
      for(let dia in daysOfTheWeek) {
        weekArray.push(daysOfTheWeek[dia]);
      }
      return weekArray;
    }
    // array that will be mapped. A promise function will be called for each date
    const week = getWeek();

  // initial function to be called for each date. Returns a domainId, dateId and count
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
          let id;
          if(response !== null) {
            id = response.dataValues.id;
          } else { id = 1; }
          DateDomain
          .findAll({
            where: {
              dateId: id,
            },
          })
          .then((response) => { // save all domains to array and return them

              const domainsByDate = response.map((instance) => {
                return instance.dataValues;
              });

             return resolve(domainsByDate);
          })
          .catch((err) => {
            console.log('ERROR INSIDE DATEDOMAIN QUERY: ', err);
          });
        })
        .catch((err) => {
          console.log('ERROR: ', err);
        });
      })
    };

    // promisedWeek is the result of calling each function for each date. Returns an array
    // of promised arrays. Will be resolved by calling promise.all(promisedWeek)
    const promisedWeek = week.map((day) => {
      return getIds(day);
    });

    // next promise function to call. Will be called for each object inside each promised
    // array inside promisedWeek
    const getNameAndDate = (entry) => {
      return new Promise((resolve, reject) => {
       User.findOne({ where: { chrome_id: req.session.chromeID } })
        .then((user) => {
        Domain.findOne({ where: { id: entry.domainId, userId: user.dataValues.id } })
        .then((domain) => {
          console.log("DOMAIN", domain.dataValues)
          DateTable.findOne({ where: { id: entry.dateId } })
          .then((date) => {
            console.log("DATE", date.dataValues)
            DateDomain.findOne({ where: { domainId: entry.domainId } })
            .then((datedDom) => {
              console.log("DATEDDOM", domain.dataValues.domain)
              const nameDateCount = { count: datedDom.dataValues.count, domain: domain.dataValues.domain, date: date.dataValues.dateOnly }
               return resolve(nameDateCount);
            })
            .catch((err) => {
              console.log("ERROR GETTING COUNT IN GETNAME: ", err)
            })
          })
          .catch((err) => {
            console.log("ERROR MATCHING DATE AND NAME IN GETNAME: ", err)
          });
        })
        .catch((err) => {
          console.log("ERROR FINDING DOM IN GETNAME: ", err)
        });
       })
     })
    .catch((err) => {
      console.log("ERROR FINDING USER IN GETNAME: ", err)
    });
  }

    // make all promised arrays inside promisedArray wait to resolve until their promised
    // objects have resolved
    Promise.all(promisedWeek)
    .then((thisWeek) => {
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
        console.log("PROMISED ARRAY", promisedArray)
        const resolvedArrays = promisedArray.map((subArray) => {
          return Promise.all(subArray);
        });
        return Promise.all(resolvedArrays)
      })
      .catch((err) => {
        console.log("ERROR RESOLVING SUB ARRAYS: ", err)
      })
      .catch((err) => {
        console.log("ERROR INSIDE PROMISED ARRAY: ", err)
      })
      .then((finalArray) => {
        // console.log("FINAL ARRAY", _.uniq(finalArray.map((arr) => {
        //   const finalObj = {};
        //   const date = arr[0].date.toISOString().slice(0, 10).replace(/-/g, '');
        //     finalObj.date = date;
        //     finalObj.domains = arr.map((obj) => {
        //       return { domain: obj.domain, count: obj.count };
        //     });
        //     const toSum = arr.map((obj) => {
        //       return obj.count;
        //     });
        //     finalObj.totalCount = toSum.reduce((mem, curr) => {
        //       return mem + curr;
        //     });
        //   return finalObj;
        // }), ((obj) => { return obj.date; })))
        res.status(200).send(
          _.uniq(finalArray.map((arr) => {
            console.log("FINAL ARRAY", finalArray)
            const finalObj = {};
            const date = arr[0].date.toISOString().slice(0, 10).replace(/-/g, '');
              finalObj.date = date;
              finalObj.domains = arr.map((obj) => {
                return { domain: obj.domain, count: obj.count };
              });
              const toSum = arr.map((obj) => {
                return obj.count;
              });
              finalObj.totalCount = toSum.reduce((mem, curr) => {
                return mem + curr;
              });
            return finalObj;
          }), ((obj) => { return obj.date; })));
      })
      .catch((err) => {
        console.log("ERROR INSIDE FINAL OBJECT CONSTRUCTION: ", err);
      })
    })
    .catch((err) => {
      console.log("ERROR IN THERE SOMEWHERE! ", err)
    });

  },

};
