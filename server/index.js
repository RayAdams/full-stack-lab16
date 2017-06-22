var path = require('path');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'Rach',
    password: 'sourcream',
    database: 'Chirper'
});

var app = express();

var clientPath = path.join(__dirname, '../client');
app.use(express.static(clientPath));
app.use(bodyParser.json());

//GET ALL
app.get('/api/chirps', function(req, res){
    getChirps()
    .then(function(chirps) {
        res.status(200).send(chirps);
    }, function(err) {
        console.log(err);
        res.sendStatus(500);
    });
});

//GET ONE
app.get('/api/chirp/:id', function(req, res){
    getChirp(req.params.id)
    .then(function(chirp) {
        res.status(200).send(chirp);
    }, function(err) {
        console.log(err);
        res.sendStatus(500);
    });
});

//POST/CREATE NEW ONE
app.post('/api/chirps', function(req,res){
   insertChirp(req.body.user, req.body.message)
    .then(function(id) {
        res.status(201).send(id);
    }, function(err) {
        console.log(err);
        res.sendStatus(500);
    });
});

//UPDATE ONE
app.put('/api/chirps', function(req, res){
    updateChirp(req.body.message, req.body.id)
    .then(function(){
        res.sendStatus(204);
    });
});

//DELETE ONE
app.delete('/api/chirps', function(req, res){
    deleteChirp(req.body.id)
    .then(function(){
        res.sendStatus(204);
    });
});

//server port
app.listen(3000);

//GET ALL FUNC
function getChirps() {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if(err) {
                reject(err);
            }
            else {
                connection.query('CALL GetChirps();', function(err, resultsets) {
                    connection.release();
                    if(err){
                        reject(err);
                    }
                    else {
                        resolve(resultsets[0]);
                    }
                });
            }
        });
    });
}

//GET ONE FUNC
function getChirp(id) {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if(err) {
                reject(err);
            }
            else {
                connection.query('CALL GetChirp(?);', [id], function(err, resultsets) {
                    connection.release();
                    if(err){
                        reject(err);
                    }
                    else {
                        resolve(resultsets[0][0]);
                    }
                });
            }
        });
    });
}

//ADD ONE FUNC
function insertChirp(user, message) {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject(err);
            }
            else {
                connection.query('CALL InsertChirp(?,?);', [user, message], function(err, resultsets) {
                    connection.release();
                    if (err){
                        reject(err);
                    }
                    else {
                        resolve(resultsets[0][0]);
                    }
                });
            }
        });
    });
}

//UPDATE ONE MESSAGE FUNC
function updateChirp(message, id) {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject(err);
            }
            else {
                connection.query('CALL UpdateChirp(?);', [message, id], function(err, resultsets) {
                    connection.release();
                    if (err){
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            }
        });
    });
}

//DELETE ONE FUNC
function deleteChirp(id) {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject(err);
            }
            else {
                connection.query('CALL DeleteChirp(?);', [id], function(err, resultsets) {
                    connection.release();
                    if (err){
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            }
        });
    });
}