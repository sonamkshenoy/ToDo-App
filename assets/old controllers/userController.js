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

    app.get('/', function(req, res){
        console.log("hello");

        pool.query('SELECT * FROM users', (error, results) => {
            // console.log(results.rows);
            if (error) {
            throw error
            }
        })
        res.render('signup');
    })

    app.post('/signup', function(req, res){
        console.log("User details posted");
        var sess = req.session;

        // only need to create session of emailID, not password
        sess.email = req.body.emailID;
        // save user in mongodb
        console.log(sess.email);

        pool.query('INSERT INTO users (emailid, password) VALUES ($1, $2)', [req.body.emailID, req.body.password], (error, results) => {
            if (error) {
              throw error
            }
            console.log("successful")
          })
        return res.redirect('/myList');
    })

    app.post('/login', function(req, res){
        
        var email = req.body.emailID;
        var password = req.body.password;
        
        pool.query('SELECT * FROM users WHERE emailid = $1 AND password = $2',[email, password]).then((results, error)=>{
            if(error)
            throw error;

            console.log(results.rows.length);
            if(results.rows.length>0){
                var sess = req.session; // HAHA, basically forgot to create session on successful authentication, so though it was redirecting to myList, that page was redirecting to home page (/). Nice joke! At least learnt to write .then()
                sess.email = email;
                return res.redirect('/myList');
            }
            else
                return res.redirect('/');
        });
        // console.log(sess.email);
    })
}