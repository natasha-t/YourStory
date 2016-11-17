'use strict';

module.exports = {

  tallyVisitCount: (urls) => {
    let totalVisitCount = 0;
    urls.forEach((url) => {
      totalVisitCount += url.visitCount;
    });
    return totalVisitCount;
  },

  // tallyAllVisitCount: (domain) => {
  //   let allVisitCount = 0;
  //   domain.forEach((domain) => {
  //     allVisitCount += domain.visits;
  //   })
  // }


};
