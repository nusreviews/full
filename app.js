const express = require('express');
const mysql = require('mysql');

// create connection
const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password: 'limtaeu'
});

// connect
db.connect((err) => {
    if(err){
        //throw err;
    }
    console.log('My sql Connected');
});

const app = express();

// Create db
app.get('/createdb', (req, res) =>{
    let sql = 'CREATE DATABASE testsql';
    db.query(sql, (err, result)=>{
        if(err){
            //throw err;
        } 
        console.log(result);
        res.send("database created...");
    });
});


app.listen('3000', ()=>{
    console.log('Server started on port 3000');
});

