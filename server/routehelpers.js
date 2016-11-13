const db = require('../db/config');
const Sequelize = require('sequelize');
const _ = require('underscore');
const User = require('../db/schema').User;
const Domain = require('../db/schema').Domain;

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
    const id = req.body.chromeID //TODO: change name to whatever natasha calls this variable

    // ======= parse url to get unique domain =======
    allData.map((historyItem) => {
      const url = historyItem.url;
      let domain;
      if (url.indexOf('://') > -1) {
        domain = url.split('/')[2];
      } else {
        domain = url.split('/')[0];
      }
      domain = domain.split(':')[0];
      historyItem.domain = domain;
      return historyItem;
    });
    console.log("allData:", allData);

    // ======= insert domain into Domain db =======
    // allData.map((historyItem) => {
    // });
    // const uniqueDomains = _.unique(allData);
    // console.log("uniqueDomains", uniqueDomains);
    // Domain
    //   .findOrCreate({ where: { domain: historyItem.domain } })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    const dummyData = [
      { domain: 'google', visits: 100, color: 'red' },
      { domain: 'facebook', visits: 300, color: 'blue' },
      { domain: 'twitter', visits: 500, color: 'lightblue' },
      { domain: 'instagram', visits: 100, color: 'purple' },
      { domain: 'apple', visits: 75, color: 'gray' }];
    res.status(201).json(dummyData);
  },

  postUser: (req, res) => {
    console.log('inside routehelpers.js postUser API');
    // save to the session object the chrome id
    req.session.user = req.body.chromeID;
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
        res.send(req.session.user);
      });
  },
};
