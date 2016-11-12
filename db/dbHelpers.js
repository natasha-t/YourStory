module.exports = {

  tallyVisitCount: (urls) => {
    let totalVisitCount = 0;
    urls.forEach((url) => {
      totalVisitCount += url.visitCount;
    });
    return totalVisitCount;
  },


}
