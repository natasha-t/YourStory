const db = require('../db/config');


// Establishes the connection to the database
db.authenticate().then(() => {
  console.log('Connection established');
}).catch((err) => {
  console.log('Unable to connect: ', err);
});

// database routes / queries
module.exports = {

  // tested with Postman. will not post to DB but should return dummy array
  postHistory: (req, res) => {
    const dummyData = [
                       { domain: 'google', visits: 50 },
                       { domain: 'facebook', visits: 30 },
                       { domain: 'twitter', visits: 20 },
                       { domain: 'instagram', visits: 100 },
                       { domain: 'apple', visits: 5 }];
    res.status(201).json(dummyData);
  },
};
