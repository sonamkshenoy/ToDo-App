let express = require('express');
let app = express();
require('dotenv').config();



app.set('view engine', 'ejs');

const session = require('express-session');
app.use(session({secret: process.env.SESSIONSECRET ,saveUninitialized: true,resave: true}));

const PORT = process.env.PORT || 5000;

app.use(express.static(__dirname+'/public'));

var todoController = require('./controllers/todoController');
var userController = require('./controllers/userController');
todoController(app);
userController(app);

let server = app.listen(PORT, function(){
  console.log(`Listening on ${ PORT }`);
});
