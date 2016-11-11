const db = require('../db/config');
const _ = require('underscore');
const Sequelize = require('sequelize');

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
      const uniqueDomains = _.unique(allData);
      console.log("uniqueDomains", uniqueDomains);

      
      
      Domain
        .findOrCreate({ where: { domain: historyItem.domain } })
        .catch((err) => {
          console.log(err);
        });    
    // Domain
    //   .findAll({ where: { domain: "google.com" } }).then(function(domain) {
    //     console.log('found domain', domain);
    //   });

    const dummyData = [
                       { domain: 'google', visits: 50 },
                       { domain: 'facebook', visits: 30 },
                       { domain: 'twitter', visits: 20 },
                       { domain: 'instagram', visits: 100 },
                       { domain: 'apple', visits: 5 }];
    res.status(201).json(dummyData);
  },
};

