var express = require('express')
var app = express()

var path = require('path');

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

//app.use('/static', express.static(path.join(__dirname, 'public')))
//app.use(express.static('app'))
app.use(express.static(path.join(__dirname, 'public')));

app.listen(8000, function () {
  console.log('Example app listening on port 8000!')
})


//app.get('/', function (req, res) {
//  res.sendFile(__dirname + "/" + "index.html")
//})



app.get('/test', function(req, res, next) {
  //queryALL();
  res.json(query_result);
});
// this is transfer data to the front end

var flag = false;
var zip = "98178";
var bed = "4";
var priceUpper = "10000000";
var priceLower = "1";

var query = {}

app.post('/name', function (req, res) {
    zip = req.body.zip.toString();
    console.log(zip);
    //bed = req.body.bed.toString()
    priceLower = req.body.pricel.toString();
    priceUpper = req.body.priceh.toString();
    console.log("get query condition");
    if (zip !== "") {
        query.zipcode = parseInt(zip);
    } else {delete query.zipcode};
    if (priceLower === "") priceLower = 0;
    if (priceUpper === "") priceUpper = 10000000000;
    query.price = {$gt: (parseFloat(priceLower)), $lt: (parseFloat(priceUpper))};

      queryRange();
      console.log("get search condition");
      res.json(query_update);
  //});
});


var MongoClient = require('mongodb').MongoClient;
//Create a database named "mydb":
var url = "mongodb://localhost:27017/mydb";
// create db

var query_result = {};
var query_update= {};
// store the query result from mongodb to query_result and transfer it to front end. 

create = function(){
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");

  db.createCollection("customers", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
  });

  db.close();
});
}

//drop collection
drop = function(){
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.collection("customers").drop(function(err, delOK) {
    if (err) throw err;
    if (delOK) console.log("Collection deleted");
    db.close();
  });
});
}

// insert
insert = function(){
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var myobj = { name: "hello Inc", address: "Highway 37" };
  db.collection("customers").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});
};

//query

queryALL = function(){
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  //var query = { };
  db.collection("customers").find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    query_result = result;
    db.close();
  });
});
};


queryZip = function(){
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var query = { zipcode: zip };
  db.collection("customers").find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    query_result = result;
    db.close();
  });
});
};

queryCondition = function(){
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var query = { zipcode: "98178", bedrooms: "4" };
  db.collection("customers").find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    query_result = result;
    db.close();
  });
});
};

queryRange = function(){
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log(query);
  db.collection("customers").find(query).toArray(function(err, result) {
    if (err) throw err;
    query_update = result;
    console.log(query_update.length);
    db.close();
  });
});
};


