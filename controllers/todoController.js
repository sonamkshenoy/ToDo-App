const path = require('path');
var bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();


const {MongoClient} = require('mongodb');
const uri = process.env.MONGOURI;
const client = new MongoClient(uri);

module.exports = function(app){

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Display todos
  app.get('/mylist', function(req,res){
    // if user tries to go to TODO page, without loggin in/signing up.
    var todos = {"notCompleted":[], "completed":[]};
    const sess = req.session;
    if(!sess.email){
      return res.redirect('/');
    }
    async function run(){
      try{
        await client.connect();
        console.log('Connected...');
        const db = client.db(process.env.MONGODB);
        const col = db.collection(process.env.MONGOTODOTABLE);
        var record = await col.find({'_id':sess.email});
        console.log("hello"+record);
        record.forEach(function(doc, err){
        // console.log(doc.todos.notCompleted);
          todos['notCompleted'] = doc.todos.notCompleted;
          todos['completed'] = doc.todos.completed;
          console.log(todos);
        });        
      }
      catch(err){
        console.log(err.stack);
      }
      finally{
        await client.close();
        res.render('todo', todos);  
      }
    }
    run().catch(console.dir);
    
    // todos = {notCompleted: ['Brushing teeth', 'Washing Car'], completed: ['Iron Clothes','Cook food','Clean room']};
    // res.render('todo', todos);
  })

  // Deleting a todo
  app.post('/mylist', function(req, res){
    console.log(req.body.toMarkComplete);
    todos.completed.push(req.body.toMarkComplete);
    // one more step left, pop from notCompleted array, long process in JS. Let's try once and for all in Mongo
    console.log(todos);
    res.status(200).send("Successful Application");
  })


  // Adding a todo
  app.post('/addTodo', function(req, res){
    const sess = req.session;
    var todos = {"notCompleted":[], "completed":[]};

    async function run(){
    try{
      // await client.connect();
      console.log('Connected...');
      const db = client.db(process.env.MONGODB);
      const col = db.collection(process.env.MONGOTODOTABLE);
      await col.updateOne(
          { _id: sess.email },
          {
            $set: { 'notCompleted': "helo" },
          }
        );
      // var record = await col.find({'_id':sess.email});
      // console.log("hello"+record);
      // record.forEach(function(doc, err){
      // // console.log(doc.todos.notCompleted);
      //   todos['notCompleted'] = doc.todos.notCompleted;
      //   todos['completed'] = doc.todos.completed;
      //   console.log(todos);
      // });        
    }
    catch(err){
      console.log(err.stack);
    }
    finally{
      await client.close();
      res.render('todo', todos);  
    }
  }
  run().catch(console.dir);
  
    // async function run(){
    //   try{
    //     await client.connect();
    //     console.log('Connected inside addTodo...');
    //     const db = client.db(process.env.MONGODB);
    //     const col = db.collection(process.env.MONGOTODOTABLE);
    
    //     var record = await col.find({'_id':sess.email});
    //     console.log(record);
        
        // var oldtodos;
        // record.forEach(function(doc, err){
        //   console.log(doc);
        // //   // oldtodos = doc.todos.notCompleted;
        // //   // console.log("oldtodos:",oldtodos);
        // //   // oldtodos.push(req.body.newTodo);
        // })
        // .catch((err) => {
        //   //error, its handled now!
        // });        

        // await col.updateOne(
        //   { _id: sess.email },
        //   {
        //     $set: { 'notCompleted': oldtodos },
        //   }
        // );
      // }
  //     catch(err){
  //       console.log(err.stack);
  //     }
  //     finally{
  //       // await client.close();
  //       res.status(200).send("successful");
  //     }
  //   }
  //   run().catch(console.dir);
  // })
})
}
