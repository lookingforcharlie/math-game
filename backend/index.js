'use strict';
const express = require('express');
const app = express();
const cors = require('cors');
// set up redis
const redis = require('redis');
// make a redis connection
const client = redis.createClient({
  url: 'redis://redis-14498.c16.us-east-1-2.ec2.cloud.redislabs.com:14498',
  password: 'C6TQ5GDEAj9yNoDfViqdtHfi5ZFIkdMK',
});
// we use client to do all the redis work
client.connect();
// run the function if error occurs regarding redis
client.on('error', (err) => console.log('Error from Redis: ', err));

// testing Redis commands
const runCommands = async () => {
  // set will return true or false depends on it sets the value or not
  const result1 = await client.set('string as key', 'string as value');
  // will return ok
  console.log(result1);

  // retrieve the value,
  const result2 = await client.get('string as key');
  // will return 'string as value'
  console.log(result2);

  // set another key-value
  const result3 = await client.set('charlie', 'Wrong');
  // will return ok
  console.log(result3);

  const result4 = await client.hSet('customer:23', {
    firstname: 'Charlie',
    lastname: 'Fong',
    city: 'Hamilton',
    membership: 'Gold',
  });
  console.log(result4);

  const result5 = await client.hSet('customer:24', {
    firstname: 'Michael',
    lastname: 'Francesse',
    city: 'New Jersey',
    membership: 'Primun',
  });
  console.log(result5);

  // retrieve the hash
  const customer23 = await client.hGetAll('customer:23');
  // returns an object of customer
  console.log('From hGetAll', customer23);

  // check if a key exists
  const exists23 = await client.exists('customer:23');
  // will return 1, meaning exists
  console.log(exists23);

  const exists24 = await client.exists('customer: 24');
  // will return 0, meaning doesn't exist
  console.log(exists24);

  // delete key-value
  const del23 = await client.del('customer:23');
  // returns 1, means delete 1 pair
  console.log(del23);
};
runCommands();

// start to config sqlite3
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mydb.db');
// create a table in db
db.serialize(function () {
  // create a fresh version of the table
  db.run('DROP TABLE IF EXISTS mathgamers');
  db.run(
    'CREATE TABLE mathgamers (username TEXT NOT NULL, password TEXT NOT NULL)'
  );

  // insert initial records into the table
  var stmt = db.prepare('INSERT INTO mathgamers VALUES (?,?)');
  stmt.run('michael', 'test123');
  stmt.run('sonny', 'test123');
  // const temp = db.run('SELECT username FROM mathgamers');
  // console.log('temp file: ', temp);

  stmt.finalize();
});

// invoke the module for generating JSON Web Token
const jwt = require('jsonwebtoken');
// because we installed dotenv package, we can invoke it and run command
require('dotenv').config();
// Because we have .env file, we don't necessarily need to say port number explicitly
const port = process.env.PORT;
const jwtKey = process.env.JWT_KEY;

const bcrypt = require('bcrypt');

// how many times we need to go through the hashing process to generate the password
// it is 2 of the power of 13 times here
const saltRounds = 9;

// middleware to handle json body request
// express.json() means:
// every request comes to my server, will check if there's a body, if so, get the JSON out of the body
// because I want to be able to use it or turn the body into an object.
// Basically, take the string and turn into an object that I can work with
app.use(express.json());
// enables CORS (cross-origin resource sharing)
// In order for server to be accessible by other origins (domains)
app.use(cors());

// TO-DO-LIST
// const users = fetch data from sqlite, convert it into array stored in users, it looks like
// [{id: 1, email: jd@email.com, password: hashed-xxxx}, {id: 2, email: jd1@email.com, password: hashed-xxxx}]
// Need server activity for signing out

app.get('/', (req, res) => {
  res.send('<h2>Welcome to Assignment 6</h2>');
});

// because we use express.json() middleware, req object has a property called body
// we have req.body.email, and req.body.password, that user sends over
app.post('/signup', async (req, res) => {
  //get the username and password from req.body
  //TODO: check for no duplicate username
  // TODO: hash the password
  try {
    let newUser = {
      username: req.body.username,
      password: req.body.password,
    };
    db.run('INSERT INTO mathgamers(username,password) VALUES (?,?)', [
      req.body.username,
      req.body.password,
    ]);
    res.send({ status: 'success', data: newUser });
    console.log('gamer added in db');
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ error: { code: 400, message: 'Email address already used' } });
  }
});

app.post('/login', async (req, res) => {
  //get the email and password from req.body
  const { username, password } = req.body;
  // echo my route back to me
  // res.json({ username, password });
  console.log('Username: ', username, 'Password: ', password);
  //find the match for the email
  db.all(
    `SELECT * FROM mathgamers WHERE username = '${username}' and password = '${password}'`,
    (err, rows) => {
      if (err) {
        console.log(err);
      } else if (rows.length > 0) {
        //route to get a token
        // login successfully
        // if you want to send web token, you can send it from here
        // make a function of genToken, put here as a middleware
        console.log('Row lenght: ', rows.length);
        let id = Math.random().toString(36).substring(2, 8);
        let limit = 60 * 3; // 180 seconds
        let expires = Math.floor(Date.now() / 1000) + limit;
        let payload = {
          id,
          exp: expires,
        };
        let token = jwt.sign(payload, jwtKey);
        console.log('token in backend: ', token);
        res
          .status(201)
          .send({ status: 'success', code: 0, message: 'ok', data: token });
      } else {
        res.status(401).send({
          status: 'failure',
          error: { code: 400, message: 'Invalid username or password.' },
        });
      }
    }
  );
});

// client.exists('key'), return 1 means exists, return 0 means doesn't exist
app.post('/update', async (req, res) => {
  let exists = await client.exists('record_id');

  let record_id;
  if (exists == 0) {
    record_id = 1;
    await client.set('record_id', record_id);
  } else {
    record_id = await client.get('record_id');
  }

  try {
    let dataForRedis = {
      // michael: 'correct',
      // sonny: 'correct',
    };
    const username = `${req.query.username}_${record_id}`;
    const result = req.query.result;
    console.log(
      'Username in Redis: ',
      username,
      '   Result in Redis: ',
      result
    );
    dataForRedis[username] = 'correct';
    await client.hSet('mathgamer', { ...dataForRedis });
    await client.set('record_id', parseInt(record_id) + 1);

    const dataRetrieveFromHash = await client.hGetAll('mathgamer');

    console.log('redis data from backend: ', dataRetrieveFromHash);
    // Send the data retrieved from redis to the frontend
    res.status(201).json(dataRetrieveFromHash);
  } catch (error) {
    console.log(error);
  }
});

app.post('/getresult', async (req, res) => {
  try {
    const dataRetrieveFromHash = await client.hGetAll('mathgamer');
    // Send the data retrieved from redis to the frontend
    res.status(201).json(dataRetrieveFromHash);
  } catch (error) {
    console.log(error);
    res.json({ status: failure });
  }
});

app.listen(port, (err) => {
  if (err) {
    return console.log('The Error: ', err);
  }
  console.log(`listening on port: ${port}`);
});
