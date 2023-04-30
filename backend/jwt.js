const express = require('express');
const app = express();
require('dotenv').config();
const jwt = require('jsonwebtoken');
const port = process.env.PORT;
const jwtKey = process.env.JWT_KEY;

// We need to create the token for user and check if users have the token when server allow users to access certain functionalities
// both of the following functions can be middleware functions.

// creating a token for login user
app.get('/token', (req, res) => {
  // creating the payload for token, you can put anything you want in payload, maybe include user id...
  // payload itself is just Javascript object
  // idFromSqlite is retrieved from sqlite
  let id = idFromSqlite.toString(36).substring(2, 8);
  // Date.now() gets you a millisecond value, divided by 1000 will get you second
  // expiry time stamp in payload is measured in seconds
  let limit = 60 * 3; // 3 minutes
  // Math.floor(Date.now() / 1000) is current time in seconds, meaning expires instantly
  let expires = Math.floor(Date.now() / 1000) + limit;
  let payload = {
    id,
    exp: expires,
  };
  // sign() is the method to create the token, will return to us a token
  // payload is the data we sending back to client
  // pass in jwtKey to be able to sign this key
  let token = jwt.sign(payload, jwtKey);

  // we created a token and a user, and we send them back an object to client, JSON going back
  res.status(201).send({ code: 0, message: 'ok', data: token });
});

// you need a token in order to access this
// For the test, we need to create a 'Authorization' header where we will include token
app.get('/test', (req, res) => {
  const header = req.header('Authorization');
  // destructuring header's Authorization part, split it on space, type is 'bearer'
  // then we get variable type and token
  const [type, token] = header.split(' ');
  // if so, we know somebody is sending us token
  if (type === 'Bearer' && typeof token !== 'undefined') {
    try {
      // ask jwt to use jwt_key to verify if it is a good token that sent from the browser
      // verify() will give us a payload we created before with id property.
      // if verify() failed, the module will throw an error, that is why we use try and catch
      let payload = jwt.verify(token, jwt_key);
      let current = Math.floor(Date.now() / 1000);
      let diff = current - payload.exp;
      res.status(200).send({ code: 0, message: `all good. ${diff} remaining` });
    } catch (err) {
      res.status(401).send({ code: 123, message: 'Invalid or expired token.' });
    }
  } else {
    res.status(401).send({ code: 456, message: 'Invalid token' });
  }
});
