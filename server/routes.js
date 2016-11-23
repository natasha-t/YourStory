'use strict';

const routeHelpers = require('./routehelpers');

module.exports.router = (app) => {
  app.post('/api/history', routeHelpers.postHistory);
  app.post('/api/users', routeHelpers.postUser);
  app.get('/api/username', routeHelpers.getUser);
  app.get('/api/catData', routeHelpers.getCatData);
  app.get('/api/weekData', routeHelpers.getWeekData);
};
