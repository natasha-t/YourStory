const db = require('../db/config')
const User = require('../db/schema')

// Establishes the connection to the database
db.authenticate().then(() => {
  console.log('Connection established')
}).catch((err) => {
  console.log('Unable to connect: ', err)
})

// database routes / queries
module.exports = {

  // tested with Postman. will not post to DB but should return dummy array
  postHistory: (req, res) => {
    console.log('inside routehelpers.js postHistory API')
    const allData = req.body.history // array of all data
    // console.log('====FROM SERVER====', allData.map((historyItem) => {
    //   return historyItem


    const dummyData = [
      { domain: 'google', visits: 50 },
      { domain: 'facebook', visits: 30 },
      { domain: 'twitter', visits: 20 },
      { domain: 'instagram', visits: 100 },
      { domain: 'apple', visits: 5 }]
    res.status(201).json(dummyData)
  },

  postUser: (req, res) => {
    console.log('inside routehelpers.js postUser API')
    // save to the session object the chrome id
    req.session.user = req.body.chromeID
    // find or create user in the db
    User.findOrCreate({where: {chrome_id: req.session.user}, defaults: {username: req.body.username}})
      .spread(function (user, created) {
        console.log(user.get({
          plain: true
        }))
        console.log('user_created:', created)
        // send back to the client unique client identifier(Chrome_id)
        res.send(req.session.user)
      })
  }
}
