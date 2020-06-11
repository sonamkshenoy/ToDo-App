const path = require('path');
var bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();

const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
})


module.exports = function(app){

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Display todos
  app.get('/mylist', function(req,res){
    // if user tries to go to TODO page, without loggin in/signing up.
    const sess = req.session;
    if(!sess.email){
      return res.redirect('/');
    }    
    // todos = {notCompleted: ['Brushing teeth', 'Washing Car'], completed: ['Iron Clothes','Cook food','Clean room']};
    todos = {notCompleted: [], completed: []};
    
    
    async function toDisplay(){
      let results = await pool.query('SELECT todoitem FROM notcompleted JOIN users ON (users.userid = notcompleted.userid AND users.emailid = $1)',[sess.email]);
      // , (error, results)=>{
      // if(error)
      // throw error

      // console.log(results.rows);
      var records = results.rows;
      await records.forEach(element => {
        console.log(element['todoitem']);
        todos.notCompleted.push(element['todoitem']);
        // console.log(todos);
      });


      results = await pool.query('SELECT todoitem FROM completed JOIN users ON (users.userid = completed.userid AND users.emailid = $1)',[sess.email]);
      // console.log(todos);
      
      records = results.rows;
      await records.forEach(element => {
        console.log(element['todoitem']);
        todos.completed.push(element['todoitem']);
        // console.log(todos);
      });

      res.render('todo', todos);
      // });
    }
    toDisplay();
  })

  // Marking a todo complete
  app.post('/mylist', function(req, res){
    var sess = req.session;
    
    console.log(req.body.toMarkComplete);
    // one more step left, pop from notCompleted array, long process in JS. Let's try once and for all in Mongo
    // pool.query('SELECT userid FROM users WHERE emailid = $1', [sess.email], (error, results) => {
    //   if (error) {
    //     throw error
    //   }
    //   userid = results.rows[0]['userid'];
    //   console.log("Query result",results.rows[0]['userid']);
    //   pool.query('INSERT INTO completed VALUES ($1, $2)', [userid, req.body.toMarkComplete], (error, results) => {
    //     if (error) {
    //       throw error
    //     }
    //     console.log("insertiong to todos successful");
    //   });
    // });


    async function toMarkCompleteTodo(){
      var results = await pool.query('SELECT userid FROM users WHERE emailid = $1', [sess.email]);
      var userid = results.rows[0]['userid'];
      console.log("Query result",results.rows[0]['userid']);
      result = await pool.query('INSERT INTO completed VALUES ($1, $2)', [userid, req.body.toMarkComplete]);
      result = await pool.query('DELETE FROM notcompleted WHERE todoitem = $1', [req.body.toMarkComplete]);
    }
    toMarkCompleteTodo();
    res.status(200).send("Successful Application");
  })


  // Adding a todo
  app.post('/addTodo', function(req, res){
    const sess = req.session;
    // pool.query('SELECT userid FROM users WHERE Emailid = $1)', [sess.emailID], (error, results) => {
    //   if (error) {
    //     throw error
    //   }
    //   console.log(results.rows)
    // })

    var userid;
    pool.query('SELECT userid FROM users WHERE emailid = $1', [sess.email], (error, results) => {
      if (error) {
        throw error
      }
      userid = results.rows[0]['userid'];
      console.log("Query result",results.rows[0]['userid']);
      pool.query('INSERT INTO notcompleted VALUES ($1, $2)', [userid, req.body.newTodo], (error, results) => {
        if (error) {
          throw error
        }
        console.log("insertiong to todos successful");
      });
    });
    // console.log("user id is",userid);
    // pool.query('INSERT INTO notcompleted VALUES ($1, $2)', [userid, sess.email], (error, results) => {
    //   if (error) {
    //     throw error
    //   }
    //   console.log("insertiong to todos successful");
    // });
    return res.status(200).send("successful");
})
}
