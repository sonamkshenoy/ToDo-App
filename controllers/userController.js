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

    // signup and login page
    var userPresent, userNotPresent;
    app.get('/', function(req, res){
        res.render('signup',{'userPresent':userPresent, 'userNotPresent':userNotPresent});
    })

    // signup user
    app.post('/signup', function(req, res){
        console.log("User details posted");
        var sess = req.session;
        
        console.log(req.body.emailID);

        async function checkAndSignup(){
            var result = await pool.query('SELECT * FROM users WHERE emailid = $1',[req.body.emailID]);

            // console.log("count", result);
            console.log("count", result.rows.length);

            result = result.rows.length;
            
            if(result == 0){
                pool.query('INSERT INTO users (emailid, password) VALUES ($1, $2)', [req.body.emailID, req.body.password], (error, results) => {
                    if (error) {
                      throw error
                    }
                    console.log("successful")
                  })
                // only need to create session of emailID, not password
                sess.email = req.body.emailID;
                console.log(sess.email);
                return res.redirect('/myList');
            }
            else{
                var userNotPresent;
                res.render('signup',{'userPresent':'User already exists','userNotPresent':userNotPresent});
            }
        }
        
        checkAndSignup();
    })

    // login user
    app.post('/login', function(req, res){
        
        var email = req.body.emailID;
        var password = req.body.password;
        
        // here using callback-promise instead of async-await
        pool.query('SELECT * FROM users WHERE emailid = $1 AND password = $2',[email, password]).then((results, error)=>{
            if(error)
            throw error;

            console.log(results.rows.length);
            if(results.rows.length>0){
                var sess = req.session; 
                sess.email = email;
                return res.redirect('/myList');
            }
            else{
                var userPresent;
                return res.render('signup',{userPresent:userPresent, userNotPresent:"User doesn't exist. Please sign up first."});
            }
        });
        // console.log(sess.email);
    })
}