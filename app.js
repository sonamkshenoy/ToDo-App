let express = require('express');
let app = express();
require('dotenv').config();
// const {MongoClient} = require('mongodb');

app.set('view engine', 'ejs');

const session = require('express-session');
app.use(session({secret: process.env.SESSIONSECRET ,saveUninitialized: true,resave: true}));



// async function main(){
//   const uri = process.env.MONGOURI
//
//   const client = new MongoClient(uri);
//
//   try{
//     await client.connect();
//     await listDatabases(client);
//   }
//   catch(e){
//     console.log(e);
//   }
//   finally{
//     await client.close();
//   }
// }

// main().catch(console.error);
//
// async function listDatabases(client) {
//     databasesList = await client.db().admin().listDatabases();
//
//     console.log("Databases:");
//     databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// };

const PORT = process.env.PORT || 5000;

app.use(express.static(__dirname+'/public'));

var todoController = require('./controllers/todoController');
var userController = require('./controllers/userController');
todoController(app);
userController(app);

let server = app.listen(PORT, function(){
  console.log(`Listening on ${ PORT }`);
});
