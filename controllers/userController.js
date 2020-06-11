var bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();

const {MongoClient} = require('mongodb');
const uri = process.env.MONGOURI;
const client = new MongoClient(uri);


module.exports = function(app){
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/', function(req, res){
        res.render('signup');
    })

    app.post('/signup', function(req, res){
        console.log("User details posted");
        var sess = req.session;

        // only need to create session of emailID, not password
        sess.email = req.body.emailID;

        async function run(){
            try{
              await client.connect();
              console.log('Connected...');
              const db = client.db(process.env.MONGODB);
              const col = db.collection(process.env.MONGOCUSTOMERTABLE);
          
              let personDocument = {
                "_id": req.body.emailID,
                "password": req.body.password
              }
          
              // Insert a single document, wait for promise so we can read it back
              const p = await col.insertOne(personDocument);
          
              // const record = await col.find();
              // console.log(record);
                // perform actions on the collection object
                //  client.close();
              }
              catch(err){
                console.log(err.stack);
              }
              finally{
                await client.close();
              }
          }
          
          run().catch(console.dir);
        // save user in mongodb
        console.log(sess.email);
        return res.redirect('/myList');
    })

    app.post('/login', function(req, res){
        
        var email = req.body.email;
        var password = req.body.password
        console.log(sess.email);
    })
}