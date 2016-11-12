const db = require('../db/config');
const Sequelize = require('sequelize');
const _ = require('underscore');
const User = require('../db/schema').User;
const Domain = require('../db/schema').Domain;
const Promise = require('bluebird');

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
    for (const key in uniqueDomains) {
      Domain
      .findOrCreate({ where: { domain: key } })
      .then(() => {
        const dummyData = [
              { domain: 'google', visits: 50 },
              { domain: 'facebook', visits: 30 },
              { domain: 'twitter', visits: 20 },
              { domain: 'instagram', visits: 100 },
              { domain: 'apple', visits: 5 }];

        res.status(201).json(dummyData);
      })
      .catch((err) => {
        console.log(err);
      })
      .done(() => {
        console.log('Done saving all domains!');
      });
    }
    // ======= insert into users_domains table =====

    User.findOne({ where: { chrome_id: req.session.chromeID } }).then((user) => {
      
    });

  },

  postUser: (req, res) => {
    console.log('inside routehelpers.js postUser API');
    // save to the session object the chrome id
    req.session.chromeID = req.body.chromeID;
    console.log('session chrome id', req.session.user);
    // find or create user in the db
    User.findOrCreate({ where: { chrome_id: req.session.user },
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
