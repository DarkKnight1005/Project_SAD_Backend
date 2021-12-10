const { ifError } = require('assert');
const { json } = require('body-parser');
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const MongoDB = require("mongodb");
const mongoose = require("mongoose");
const endpoint = require("./urls/endpoints.js");
const db_urls = require("./urls/db_urls.js");
var bodyParser = require('body-parser')
const { DbConnection } = require('./services/db_service.js')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require("bcrypt");
const sitemap = require('express-sitemap-html')

dotenv.config();

app.listen(7230);
DbConnection.open();

let parser = bodyParser.json();
let endpoints = new endpoint.Endpoint();

app.use(parser);   
app.use(authenticateToken);

Array.prototype.shuffle = function() {
  for (let i in this) {
      if (this.hasOwnProperty(i)) {
          let index = Math.floor(Math.random() * i);
          [
              this[i],
              this[index]
          ] = [
              this[index],
              this[i]
          ];
      }
  }
  
  return this;
}

function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '18000000h' });
}

function authenticateToken(req, res, next) {

  console.log(req.path);
  if(req.path.includes("auth") || req.path.includes("api-docs")) {
    next();
    return;
  };

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, username) => {
    console.log(err)

    if (err) return res.sendStatus(403);

    req.username = username;

    next();
  })
}

async function checkUserExistance(username){
    try {
        let client;
        client = DbConnection.db
        const db = client.db(db_urls.main_db);
        let record = await db.collection(db_urls.users_collection).findOne({username: username});
        console.log(record);
        if(record === null)
        return false;
        else
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function getUserData(username){
  try {
    let client;
    client = DbConnection.db
    const db = client.db(db_urls.main_db);
    let record = await db.collection(db_urls.users_collection).findOne({username: username});
    console.log(record);
    return record;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getRestaraunts(){
  try {
      let client;
      client = DbConnection.db
      const db = client.db(db_urls.main_db);
      let record = await db.collection(db_urls.restaurants_collection).find({}, {
        projection: {
          _id: false,
        }
      });
      let _data;
      _data = await new Promise((resolve)=>{
        record.toArray((err, result)=> {
          if (err) throw err;
          resolve(result);
        });
      })

      return _data;
     
  } catch (error) {
      console.log(error);
      return null;
  }
}

async function getMonuments(){
  try {
      let client;
      client = DbConnection.db
      const db = client.db(db_urls.main_db);
      let record = await db.collection(db_urls.monuments_collection).find({}, {
        projection: {
          _id: false,
          possibleQuestions: false,
        }
      });
      let _data;
      _data = await new Promise((resolve)=>{
        record.toArray((err, result)=> {
          if (err) throw err;
          resolve(result);
        });
      })

      return _data;
     
  } catch (error) {
      console.log(error);
      return null;
  }
}


async function getQuestions(monumentUid){
  try {
      let client;
      client = DbConnection.db
      const db = client.db(db_urls.main_db);
      let record = await db.collection(db_urls.monuments_collection).findOne({uid: monumentUid}, {
        projection: {
          _id: false,
          possibleQuestions: true,
        }
      });

      let questionArr = record.possibleQuestions;
      questionArr = questionArr.shuffle();
      
      let normalizedQuestions = [];

      for (let index = 0; index < 5; index++) {

        const element = questionArr[index];
        
        let answersArray = element.answers;
        answersArray = answersArray.shuffle();
        element.answers = answersArray.slice(0, 3);
        normalizedQuestions.push(element);
      }

      return normalizedQuestions;
     
  } catch (error) {
      console.log(error);
      return null;
  }
}

function generateRandomString(length){
  let result = "", seeds

  for(let i = 0; i < length - 1; i++){
      seeds = [
          Math.floor(Math.random() * 10) + 48,
          Math.floor(Math.random() * 25) + 65,
          Math.floor(Math.random() * 25) + 97
      ]
      
      result += String.fromCharCode(seeds[Math.floor(Math.random() * 3)])
  }

  return result
}

function getPromo(numOfCorrect){
  let promoCodeUid = generateRandomString(11).toUpperCase();
  let promoCode = generateRandomString(6).toUpperCase();
  let promo = {
    "uid": promoCodeUid,
    "promoCode": promoCode,
  };
  return promo;
}

app.post(endpoints.register, async function(req, res){

    try{
      let isUserExist = await checkUserExistance(req.body.username);
      if(isUserExist){
        res.sendStatus(409);
        return;
      }

      const salt = await bcrypt.genSalt(10);
      let _password = await bcrypt.hash(req.body.password, salt);

      const token = generateAccessToken({
        username: req.body.username
      });

      client = DbConnection.db
      const db = client.db(db_urls.main_db);
      let record = await db.collection(db_urls.users_collection).insertOne(
          {
              "username": req.body.username,
              "password": _password,
              "jwt": token,
          },
      );
      res.json({
        username: req.body.username,
        jwt: token
      })
    }catch(error){
      console.log(error);
      res.sendStatus(500);
    }
});


app.post(endpoints.signIn, async function(req, res){

  try {
    let isUserExist = await checkUserExistance(req.body.username);
    if(!isUserExist){
      res.sendStatus(404);
      return;
    }
    const user = await getUserData(req.body.username);
    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if(!isValidPassword){
      res.sendStatus(405)
      return;
    }
    const token = generateAccessToken({
      username: req.body.username
    });
    res.json({
      username: req.body.username,
      jwt: token
    })
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get(endpoints.restaraunts, async function(req, res){
    var restaraunts = await getRestaraunts();
    res.json({"restaraunts" : restaraunts});
});


app.get(endpoints.monuments, async function(req, res){
  var monuments = await getMonuments();
  res.json({"monuments" : monuments});
});

app.post(endpoints.question, async function(req, res){
  var questionData = await getQuestions(req.body.monumentUid);
  res.json(questionData);
});

app.post(endpoints.checkResults, async function(req, res){
  var promo = getPromo(req.body.numOfCorrect);
  res.json(promo);
});

sitemap.swagger('SAD', app);