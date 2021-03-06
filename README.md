# ToDo-App
ToDo App using Node.js, EJS, PostgreSQL and Semantic UI.   

# Description  
Using this application, a user can save all his todos and mark them as complete or delete them as he wishes. The todos as well of credentials of each user are saved in PostgreSQL. To create a soothing user experience, the API calls have mostly been done via AJAX. There are two tabs in the website, one which shows the tasks which are incomplete and the other one keeps a record of the completed tasks.  

User authentication is done via email id and password. The password is stored in the database by hashing. `bcrypt` has been used for this purpose. Care has been taken not to allow duplicate users or new users to sign in. Nor is a user allowed to go to the todo page without signing in.  

# Tools
`bcrypt` : To store passwords in database by hashing   
`express-session` : To store user sessions   

# Technologies  
`Node.js` (Express.js and EJS)  
`PostgreSQL` (Pg)    
`Semantic UI`  

# Running the project  
```
npm install  
node app   
```

# Configuration files  
`dot.env` contains all the variables to be set before running the app.
Create a `.env` file in the root folder with these variables.


# Database configurations  
PostgreSQL has been used as the database for this application. The structure of the database and the queries to be run have been shown [here](https://github.com/sonamkshenoy/ToDo-App/blob/master/assets/database_structure). Once the database is created, add the database credentials in the `.env` file.
