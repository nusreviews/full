const express = require('express');
const mysql = require('mysql');

// create connection
const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password: '!qW2#eR4'
});

// connect
db.connect((err) => {
    if(err){
        throw err;
    } else {
        console.log('MySQL Connected');
    }
});

const app = express();

app.get('/', (req, res) => {
    res.json({
        message: "Hello World"
    });
});

app.listen('3000', ()=>{
    console.log('Server started on port 3000');
});

