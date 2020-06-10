const path = require('path');
var bodyParser = require('body-parser');


module.exports = function(app){

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get('/', function(req,res){
    todos = {notCompleted: ['Brushing teeth', 'Washing Car'], completed: ['Iron Clothes','Cook food','Clean room']};
    res.render('index', todos);
  })
  app.post('/', function(req, res){
    console.log(req.body.toMarkComplete);
    todos.completed.push(req.body.toMarkComplete);
    console.log(todos);
    res.status(200).send("Successful Application");
  })
}
