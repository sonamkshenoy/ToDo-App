var bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();

const bcrypt = require('bcrypt');
const saltRounds = 10;

const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
  })

// Log
const log = require('simple-node-logger').createSimpleFileLogger('project.log');
log.setLevel('info');

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
        // console.log("User details posted");
        log.info("User details posted");
        var sess = req.session;
        
        // console.log(req.body.emailID);
        
        async function checkAndSignup(){
            try{
                var result = await pool.query('SELECT * FROM users WHERE emailid = $1',[req.body.emailID]);

                // console.log("count", result);
                // console.log("count", result.rows.length);

                result = result.rows.length;

                if(result == 0){

                    var password = await bcrypt.hash(req.body.password, saltRounds);

                    // console.log("Signup password", password);

                    pool.query('INSERT INTO users (emailid, password) VALUES ($1, $2)', [req.body.emailID, password], (error, results) => {
                        if (error) {
                        log.error(error)
                        }
                        // console.log("successful")
                        log.info(sess.email,"user saved successfully");
                    })
                    // only need to create session of emailID, not password
                    sess.email = req.body.emailID;
                    // console.log(sess.email);
                    return res.redirect('/myList');
                }
                else{
                    var userNotPresent;
                    res.render('signup',{'userPresent':'User already exists','userNotPresent':userNotPresent});
                }
            }
            catch(err){
                log.error(err);
            }
        }
        
        checkAndSignup();
    })

    // login user
    app.post('/login', function(req, res){
        
        var email = req.body.emailID;
        var password = req.body.password;

        // here completely used callback-promise instead of async-await

        // bcrypt.hash(password, saltRounds)
        // .then((password)=>{
        //     console.log("not same?",password);
        // });
            
        pool.query('SELECT * FROM users WHERE emailid = $1',[email]).then((results, error)=>{
            if(error)
            log.error('Database SELECT error during login', error);

            // console.log(results.rows.length);
            // console.log(results);
            if(results.rows.length>0){

                bcrypt.compare(req.body.password, results.rows[0].password, function(err, result) {
                    // console.log("Compare hashes",result);
                    if(result){
                        var sess = req.session; 
                        sess.email = email;
                        return res.redirect('/myList');
                    }
                    else{
                        var userPresent;
                    return res.render('signup',{userPresent:userPresent, userNotPresent:"Make sure your password is right."});
                    }
                });
            }
            else{
                var userPresent;
                return res.render('signup',{userPresent:userPresent, userNotPresent:"User doesn't exist. Please sign up first."});
            }
        });
            // console.log(sess.email);
        // });
    })

    // In case, user tries to go to these API endpoints
    app.get('/login', function(req, res){
        res.redirect('/');
    })
    app.get('/signup', function(req, res){
        res.redirect('/');
    })
}