const { ifError } = require('assert');
const { json } = require('body-parser');
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const MongoDB = require("mongodb");
const mongoose = require("mongoose");
const endpoint = require("./urls/endpoints.js");
var bodyParser = require('body-parser')
const { DbConnection } = require('./services/db_service.js')
var jwt = require('express-jwt');

app.listen(7230);
// DbConnection.open();

let parser = bodyParser.json();
let endpoints = new endpoint.Endpoint();

jwt({
    secret: 'SAD_Project_Secret',
    algorithms: ['HS256']
  })

app.use(parser);   
// app.use(jwt);//.unless({path: ['/token']});

app.get(endpoints.signIn, async function(req, res){
    var fireUid = await get_fireUid(req.params.phoneNumber);
    res.send(fireUid);
});


// app.post(urls.get_all_stories, parser, async function(req, res){    
//     var phoneNumber = req.body.phoneNumber; 
//     let stories = await getUserStories(phoneNumber);  
//     let final_stories = [];
//     stories.toArray(async function(err, result) {
//         if (err) throw err;
//         result = result.sort(function(a, b){
//             return a.numOfStory - b.numOfStory; // sort can be implemented according to the timestamp
//         });
//         result.forEach(element => {
//             final_stories.push({"storyUrl": `https://hyandrdos.com/cosmect_messaging_app_api/${element.storyUrl}`, "creationTimestamp": element.creationTimestamp});
//         });
        
//         res.json(final_stories);   
//     });   
// });  

// app.post(urls.check_read_status, parser, async function(req, res){    
//     var fromNum = req.body.fromNum;
//     var toNum = req.body.toNum;
//     var isRead = await checkIfRead(fromNum, toNum);
//     // console.log("isMessageRead: " + !isRead);
//     res.json({
//         isSuccess: !isRead
//     });
// });   

// app.get(urls.get_firUid_ofUser_url + "/:phoneNumber", parser, async function(req, res){
//     var fireUid = await get_fireUid(req.params.phoneNumber);
//     res.send(fireUid);
// });

// async function uploadPPToDatabase(fileName, phoneNumber){
//     try {
//         let client;
//         // client = await MongoClient.connect(urls.db_url, {
//         //     // useUnifiedTopology: true,
//         // });
//         client = Connection.db
//         const db = client.db(urls.main_db);
//         let record = await db.collection("Users").findOneAndUpdate(
//             {"phoneNumber": phoneNumber},
//             {$set : {"avatarUrl": fileName}}
//         );
//         console.log(record);
//         if(record === null)
//         return false;
//         else
//         return true;
//     } catch (error) {
//         console.log(error);
//         return false;
//     }
// }

// async function uploadStoryToDatabase(phoneNumber, filePath, lastStoryIndex){
//     try {
//         let client;
//         // client = await MongoClient.connect(urls.db_url, {
//         //     // useUnifiedTopology: true,
//         // });
//         client = Connection.db
//         const db = client.db(urls.main_db);
//         let record = await db.collection("Stories").insertOne(
//             {
//                 "fromNum": phoneNumber,
//                 "numOfStory": lastStoryIndex,
//                 "storyUrl": filePath,
//                 "creationTimestamp": Date.now(),
//                 "createdAt": new Date(),
//             },
//         );
//         console.log(record);
//         if(record === null)
//         return false;
//         else
//         return true;
//     } catch (error) {
//         console.log(error);
//         return false;
//     }
// }

// async function getUserStories(phoneNumber){
//     try {
//         let client;
//         client = Connection.db
//         const db = client.db(urls.main_db);
//         let records = await db.collection("Stories").find({"fromNum": phoneNumber})
//         return records;
//     } catch (error) {
//         console.log(error);
//         return false;
//     }
// }

// async function checkUserExistance(phoneNumber){
//     try {
//         let client;
//         // client = await MongoClient.connect(urls.db_url, {
//         //     // useUnifiedTopology: true,
//         // });
//         client = Connection.db
//         const db = client.db(urls.main_db);
//         let record = await db.collection("Users").findOne({phoneNumber: phoneNumber});
//         console.log(record);
//         if(record === null)
//         return false;
//         else
//         return true;
//     } catch (error) {
//         console.log(error);
//         return false;
//     }
// }

// async function createUser(isError, userData) {
//     try{
//         let client;
//         // client = await MongoClient.connect(urls.db_url, {
//         //     // useUnifiedTopology: true,
//         // });
//         client = Connection.db
//         const db = client.db(urls.main_db);
//         let r = await db.collection('Users').insertOne(userData);
//         // await db.collection('Users').updateOne({_id: userData._id}, {$push: {pendngMessages: 55}});
//         // client.close();
//         return isError;
//     }catch(e){
//         isError = !isError; 
//         console.log(e);
//         return isError;
//     }
// }

// async function getPendingMessages(phoneNumber){
//     try {
//         let client;
//         // client = await MongoClient.connect(urls.db_url, {
//         //     // useUnifiedTopology: true,
//         // });
//         client = Connection.db
//         const db = client.db(urls.main_db);
//         let record = await db.collection("Users").findOne({phoneNumber: phoneNumber});
//         // console.log(record);
//         if(record === null)
//         return null;
//         else
//         return record;
//     } catch (error) {
//         console.log(error);
//         return null;
//     }
// }

// async function getAvatar(phoneNumber){
//     try {
//         let client;
//         // client = await MongoClient.connect(urls.db_url, {
//         //     // useUnifiedTopology: true,
//         // });
//         client = Connection.db
//         const db = client.db(urls.main_db);
//         let record = await db.collection("Users").findOne({phoneNumber: phoneNumber});
//         // console.log(record);
//         if(record === null)
//         return null;
//         else
//         return record;
//     } catch (error) {
//         console.log(error);
//         return null;
//     }
// }

// async function get_fireUid(phoneNumber){
//     try {
//         let client;
//         // client = await MongoClient.connect(urls.db_url, {
//         //     // useUnifiedTopology: true,
//         // });
//         client = Connection.db
//         const db = client.db(urls.main_db);
//         let record = await db.collection("Users").findOne({phoneNumber: phoneNumber});
//         // console.log(record);
//         if(record === null)
//         return null;
//         else
//         return record.fireUid;
//     } catch (error) {
//         console.log(error);
//         return null;
//     }
// }


// async function deleteFromPending(userNumber, fromNumber){
//     try {
//         let client;
//         // client = await MongoClient.connect(urls.db_url, {
//         //     // useUnifiedTopology: true,
//         // });
//         client = Connection.db
//         const db = client.db(urls.main_db);
//         // let record = await db.collection("Users").findOne({phoneNumber: userNumber});
//         let updatedRecord = await db.collection("Users").findOneAndUpdate(
//             {_id: `${userNumber}`, "pendingMessages.fromNum": `from_${fromNumber}`},
//                 { $pull: {"pendingMessages": {"fromNum": `from_${fromNumber}`}}},
//         );
//         // console.log(updatedRecord);
//         // if(record === null)
//         // return null;
//         // else
//         // return record;
//         return true
//     } catch (error) {
//         console.log(error);
//         return false;
//     }
// }
  