const routeHelpers = require('./routehelpers');


module.exports.router = (app) => {
  app.post('/history', routeHelpers.postHistory);
};
