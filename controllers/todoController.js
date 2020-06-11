const path = require('path');
var bodyParser = require('body-parser');
const session = require('express-session');

module.exports = function(app){

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get('/mylist', function(req,res){
    // if user tries to go to TODO page, without loggin in/signing up.
    const sess = req.session;
    if(!sess.email){
      return res.redirect('/');
    }
    todos = {notCompleted: ['Brushing teeth', 'Washing Car'], completed: ['Iron Clothes','Cook food','Clean room']};
    res.render('todo', todos);
  })
  app.post('/mylist', function(req, res){
    console.log(req.body.toMarkComplete);
    todos.completed.push(req.body.toMarkComplete);
    // one more step left, pop from notCompleted array, long process in JS. Let's try once and for all in Mongo
    console.log(todos);
    res.status(200).send("Successful Application");
  })
}
