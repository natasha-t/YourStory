'use strict';

const db = require('../db/config');
const Sequelize = require('sequelize');
const _ = require('underscore');
const User = require('../db/schema').User;
const Domain = require('../db/schema').Domain;
const UserDomain = require('../db/schema').UserDomain;
const Category = require('../db/schema').Category;
const Promise = require('bluebird');
const dbHelpers = require('../db/dbHelpers')
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

    // ================ save domain to Domains table in db ================
    for(let key in uniqueDomains) {
      Domain
      .findOrCreate({ where: { domain: key } })
      .then((domain) => {
      })
      .catch((err) => {
        console.log(err);
      })
      .done(() => {
        console.log('Done saving all domains');
      });
    }

    // ====== add domain and user to users_domains join table =====
    User.findOne({ where: { chrome_id: req.session.chromeID } })
    .then((user) => {

      // ==== save domains for a current user =====
      for (let key in uniqueDomains) {
        Domain.findOne({ where: { domain: key } })
        .then((domain) => {
          let totalCount = dbHelpers.tallyVisitCount(uniqueDomains[key]);

          user.addDomain(domain, { count: totalCount });
          domain.getCategory()
         .then((category) => {
           if (category === null) {
            const apiUrl = 'https://api.webshrinker.com/categories/v2/'
            const hashURL = btoa('http://www.' + domain.dataValues.domain)
            axios({
              method: 'get',
              url: apiUrl + hashURL,
              auth: {
                username: 'fkKRkyRahQhQZHW765Jr',
                password: '6qwnBSgBc3ndn6Vzviql'
              }
            })
              .then((response) => {
                Category.findOrCreate({ where: { category: response.data.data[0].categories[0] } })
                .then((cat) => {
                  domain.updateAttributes({
                    categoryId: cat[0].dataValues.id,
                  })
                })
              })
             }
          });


        })
        .catch((err) => {
          console.log(err);
        })
        .done(() => {
          console.log('Done saving and categorizing domain for user');
        });
      }
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
        })
      })
      .catch((err) => {
        console.log(err);
      })
    }

   let domains = new Promise((resolve, reject) => {
        return resolve(getAllUserDomains());
      })


   const getCategories = () => {
      return Category.findAll()
      .catch((err) => {
        console.log(err);
      })
    }

   let categories = new Promise((resolve, reject) => {
        return resolve(getCategories());
      })

   categories
   .then((categories) => {
    console.log('categories', categories.length);
   })





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
         })
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

};
