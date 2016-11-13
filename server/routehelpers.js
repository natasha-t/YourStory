const db = require('../db/config');
const Sequelize = require('sequelize');
const _ = require('underscore');
const User = require('../db/schema').User;
const Domain = require('../db/schema').Domain;
const UserDomain = require('../db/schema').UserDomain;
const Promise = require('bluebird');
const dbHelpers = require('../db/dbHelpers')

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
    for (let key in uniqueDomains) {
      Domain
      .findOrCreate({ where: { domain: key } })
      .catch((err) => {
        console.log(err);
      })
      .done(() => {
        console.log('Done saying all domains');
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
        })
        .catch((err) => {
          console.log(err);
        })
        .done(() => {
          console.log('Done saving domain for user');
        });
      } 
      // .catch((err) => {
      //   console.log(err);
      // })
      // .done(() => {
      //   console.log('Done saving to join table');
      // })  
    });


    User.findOne({ where: { chrome_id: req.session.chromeID } })
    .then((user) => {

      let visData = [];

      user.getDomains()
      .then((domains) => {
        for (let i = 0; i < domains.length; i++) {
          visData.push({ domain: domains[i].dataValues.domain, visits: domains[i].dataValues.users_domains.count });
        }
        res.status(201).json(visData);    
      });

    });

  },

  postUser: (req, res) => {
    console.log('inside routehelpers.js postUser API');
    // save to the session object the chrome id
    req.session.chromeID = req.body.chromeID;
    console.log('session chrome id', req.session.chromeID);
    // find or create user in the db
    User.findOrCreate({ where: { chrome_id: req.session.chromeID },
      defaults: { username: req.body.username },
    })
      .spread((user, created) => {
        console.log(user.get({
          plain: true,
        }));
        console.log('user_created:', created);
        // send back to the client unique client identifier(Chrome_id)
        console.log('SERVER: sent chrome id', req.session.user)
        res.json(req.session.chromeID);
      });
  },

};
