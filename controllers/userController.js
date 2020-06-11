var bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();

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