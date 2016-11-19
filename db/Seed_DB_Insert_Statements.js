    DateTable.bulkCreate([{ dateOnly: new Date() }, { dateOnly: '2016-11-17' }, { dateOnly: '2016-11-16' }])
    .then(() => {
      console.log('DateTable created');
    })
    .catch((err) => {
      console.log(err);
    });

    User.bulkCreate([
      { username: 'Natasha' },
      { username: 'Lizzie' },
      { username: 'Bruna' },
      { username: 'Melba' },
    ])
    .then(() => {
      console.log('User Table created');
    })
    .catch((err) => {
      console.log(err);
    });

    Domain.bulkCreate([
      { domain: 'google.com' },
      { domain: 'yelp.com' },
      { domain: 'facebook.com' },
      { domain: 'wsj.com' },
    ])
    .then(() => {
      console.log('Domain Table created');
    })
    .catch((err) => {
      console.log(err);
    });

    DateDomain.bulkCreate([
      { domainId: 1, count: 140, dateId: 1 },
      { domainId: 2, count: 14, dateId: 1 },
      { domainId: 3, count: 24, dateId: 1 },
      { domainId: 4, count: 150, dateId: 1 },
      { domainId: 2, count: 160, dateId: 2 },
      { domainId: 3, count: 46, dateId: 2 },
      { domainId: 1, count: 42, dateId: 2 },
    ])
    .then(() => {
      console.log('DateDomain Table created');
    })
    .catch((err) => {
      console.log('error creating DateDomain table', err);
    });
