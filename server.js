var express = require('express');
var mysql = require('mysql');
var bodyparser = require("body-parser");
var appController = require("./controllers");
//var appController = require("./controllers/test.js");

var app = express();

app.set('view engine', 'ejs');

app.use(express.static('./public'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));


var pool = mysql.createPool({
	connectionLimit : 25,
	host     : 'academic-mysql.cc.gatech.edu',
	user     : 'cs4400_56',
	password : '_DL4kIIw',
	database : 'cs4400_56'
});

pool.getConnection(function (err, connection) {
	if (!err) {
		console.log("Database is connected ... ");
		connection.release();
	} else {
		console.log("Error connecting database ... ");
	}
	console.log("releasing connection ... ");
});

appController(app, pool);
//appController(app);

var server = app.listen(4400, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("listening at: " + host + ":" + port);

});
