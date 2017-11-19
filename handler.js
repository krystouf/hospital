'use strict';

var MongoClient = require('mongodb').MongoClient;

let cachedDb = null;
let uri = process.env.MONGODB_ATLAS_CLUSTER_URI


/*
* Function to insert new doctors for the hospital
* Take a Json file for event (doctors.json)
* serverless invoke --function hpInsertDocs --region ap-southeast-1 --stage dev --path doctors.json
* https://1bcv403ouf.execute-api.ap-southeast-1.amazonaws.com/dev/hospital/addDocs
*/
module.exports.hpInsertDocs = (event, context, callback) => {
  var jsonContents = JSON.parse(JSON.stringify(event));
    
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        if (cachedDb == null) {
            MongoClient.connect(uri, function (err, db) {
                cachedDb = db;
                return createEntries(db, jsonContents, callback, "doctors");
            });
        }   
        else {
            createEntries(cachedDb, jsonContents, callback, "doctors");
        }
    }
    catch (err) {
        callback(err, null);
    }
};

/*
* Function to retrieve all doctors for the hospital
* $ serverless invoke --function hpRetreiveDocs --region ap-southeast-1 --stage dev --data
* https://1bcv403ouf.execute-api.ap-southeast-1.amazonaws.com/dev/hospital/getAllDocs
*/
module.exports.hpRetreiveDocs = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
    try {
        if (cachedDb == null) {
            MongoClient.connect(uri, function (err, db) {
                cachedDb = db;
                return retrieveAll(db, callback, "doctors");
            });
        }   
        else {
            retrieveAll(cachedDb, callback, "doctors");
        }
    }
    catch (err) {
        callback(err, null);
    }
};


/*
* Function to insert new servies for the hospital
* Take a Json file for event (services.json)
* serverless invoke --function hpInsertServ --region ap-southeast-1 --stage dev --path services.json
* https://1bcv403ouf.execute-api.ap-southeast-1.amazonaws.com/dev/hospital/addServices
*/
module.exports.hpInsertServ = (event, context, callback) => {
    var jsonContents = JSON.parse(JSON.stringify(event));
    
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        if (cachedDb == null) {
            MongoClient.connect(uri, function (err, db) {
                cachedDb = db;
                return createEntries(db, jsonContents, callback, "services");
            });
        }   
        else {
            createEntries(cachedDb, jsonContents, callback, "services");
        }
    }
    catch (err) {
        callback(err, null);
    }
};

/*
* Function to retrieve all servies for the hospital
* $ serverless invoke --function hpRetrieveAllServices --region ap-southeast-1 --stage dev --data
* https://1bcv403ouf.execute-api.ap-southeast-1.amazonaws.com/dev/hospital/getAllServices
*/
module.exports.hpRetrieveAllServices = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        if (cachedDb == null) {
            MongoClient.connect(uri, function (err, db) {
                cachedDb = db;
                return retrieveAll(db, callback, "services");
            });
        }   
        else {
            retrieveAll(cachedDb, callback, "services");
        }
    }
    catch (err) {
        callback(err, null);
    }
};

/*
* Function to insert new patients for the hospital
* Take a Json file for event (patients.json)
* serverless invoke --function hpNewPatient --region ap-southeast-1 --stage dev --path patients.json
* https://1bcv403ouf.execute-api.ap-southeast-1.amazonaws.com/dev/hospital/addPatients
*/
module.exports.hpNewPatient = (event, context, callback) => {
  var jsonContents = JSON.parse(JSON.stringify(event));
    
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        if (cachedDb == null) {
            MongoClient.connect(uri, function (err, db) {
                cachedDb = db;
                return createEntries(db, jsonContents, callback, "patients");
            });
        }   
        else {
            createEntries(cachedDb, jsonContents, callback, "patients");
        }
    }
    catch (err) {
        callback(err, null);
    }
};


/*
* Function to retrieve all patients for the hospital
* $ serverless invoke --function hpRetrievePatient --region ap-southeast-1 --stage dev --data
* https://1bcv403ouf.execute-api.ap-southeast-1.amazonaws.com/dev/hospital/getAllPatients
*/
module.exports.hpRetrievePatient = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
    try {
        if (cachedDb == null) {
            MongoClient.connect(uri, function (err, db) {
                cachedDb = db;
                return retrieveAll(db, callback, "services");
            });
        }   
        else {
            retrieveAll(cachedDb, callback, "services");
        }
    }
    catch (err) {
        callback(err, null);
    }
};

/*
* Function to add any entry into the database
* Takes into parameter the json file with the data and the name of the table to work with
*/
function createEntries (db, json, callback, table) {
    db.collection(table).insert( json, function(err, result) {
        if(err!=null) {
            callback(null, { statusCode: 400, body: JSON.stringify(err) });
        }
        else {
            callback(null, { statusCode: 200, body: JSON.stringify('Services added successfully') });

        }
    });
};

/*
* Function to retrieve all entries from one table (parameter)
*/
function retrieveAll (db, callback, table) {
    db.collection(table).find({}).toArray(function(err, result) {
        if(err!=null) {
            console.log(JSON.stringify(err));
            callback(null, { statusCode: 400, body: JSON.stringify(err) });
        }
        else {
            console.log(JSON.stringify(result));
            callback(null, { statusCode: 200, body: JSON.stringify(result) });
        }
    });
};

