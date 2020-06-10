let express = require('express');
let app = express();
require('dotenv').config();
// const {MongoClient} = require('mongodb');

app.set('view engine', 'ejs');


const MongoClient = require('mongodb').MongoClient;

// replace the uri string with your connection string.
const uri = "mongodb+srv://hello:hello@cluster0-omncj.mongodb.net/<dbname>?retryWrites=true&w=majority"
MongoClient.connect(uri, function(err, client) {
   if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
   }
   console.log('Connected...');
   const collection = client.db("test").collection("devices");
   // perform actions on the collection object
   client.close();
});

// async function main(){
//   const uri = "mongodb+srv://hello:hello@cluster0-omncj.mongodb.net/<dbname>?retryWrites=true&w=majority"
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
todoController(app);

let server = app.listen(PORT, function(){
  console.log(`Listening on ${ PORT }`);
});
