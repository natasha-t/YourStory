const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + 'client'));


routes.router(app);


app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
  console.log('listening on port: ', app.get('port'));
});

