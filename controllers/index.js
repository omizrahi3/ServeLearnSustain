var mysql = require('mysql');

module.exports  = function(app, pool) {

    app.get('/amy', function (req, res) {
        console.log("GET Request /");
        res.render('');
    });

    app.get('/', function (req, res) {
    		console.log("GET Request /");
    		res.render('index');
    });

    app.get('/admin-pending-city-officials', function (req, res) {
    		console.log("GET Request /admin-pending-city-officials");

        var pendingQuery = "SELECT * FROM CITY_OFFICIAL WHERE Approved IS NULL";

        pool.getConnection(function(err, connection) {

            connection.query(pendingQuery, function (err, rows, fields) {
                connection.release();
                console.log(rows);

                var pending_city_officials = [];
                rows.forEach(function(record) {
                    var pending_official = {
                      user : record.User,
                      title : record.Title,
                      approved : record.Approved,
                      city : record.City,
                      state : record.State
                    };
                    pending_city_officials.push(pending_official);
                });
                console.log(pending_city_officials);
                res.locals.officals = pending_city_officials;
                res.render('admin-pending-city-officials');
            });
        });
    });

    app.post('/states', function (req, res) {
    		console.log("GET Request /states");
        console.log(req.body.city);
        var city =  "'" + req.body.city + "'";
        console.log(city);

        pool.getConnection(function(err, connection) {

            connection.query("SELECT State_Name FROM CITY_STATE WHERE City_Name="+city, function (err, rows, fields) {
                connection.release();
                console.log(rows);

                var states = [];
                rows.forEach(function(record) {
                    states.push(record.State_Name);
                });

                //res.locals.cities = cities;
                //res.locals.states = [];

                console.log(states);
                return res.status(200).json({
                    success: true,
                    states: states,
                });
            });
        });
    });

    app.get('/register', function (req, res) {
        console.log("GET Request /register");
        pool.getConnection(function(err, connection) {
          //var city = "'Springfield'";
          //var statement = "SELECT * FROM CITY_STATE WHERE City_Name=";
          //var query = statement.concat(city);
          //console.log(query);
            connection.query("SELECT DISTINCT City_Name FROM CITY_STATE", function (err, rows, fields) {
                connection.release();
                var cities = [];
                console.log(rows);
                /*
                rows.forEach(function(record) {
                    console.log(record);
                });
                */
                rows.map(function(record) {
                    //console.log(record.City_Name);
                    cities.push(record.City_Name);
                    //console.log(record.State_Name);
                    //return lecture.lecture_id;
                });
                console.log(cities);
                res.locals.cities = cities;
                res.locals.states = [];
                //res.locals.states = ['Florida', 'Georgia'];
                //console.log(fields);
                //res.locals.city_states = [{city: "Atlanta", State: "Georgia"}, {city: "Cleveland", state: "Ohio"}, {city: "Miami", state: "Florida"}];
                //res.locals.city_state = {city: "Atlanta", state: "Georgia"};
                res.render('register');
            });
        });
        //res.locals.city_states = [{city: "Atlanta", State: "Georgia"}, {city: "Cleveland", state: "Ohio"}, {city: "Miami", state: "Florida"}];
        //res.locals.city_state = {city: "Atlanta", state: "Georgia"};
        //res.render('register');
    });


    app.post('/signup', function (req, res) {
        console.log("GET Request /signup");

        console.log(req.body);

        var userQuery = "INSERT INTO USER (Username, Email_Address, Password, User_Type) VALUES (?,?,?,?)";
        var userTable = [req.body.username, req.body.email, req.body.password, req.body.usertype];
        query1 = mysql.format(userQuery, userTable);
        console.log(query1);

        pool.getConnection(function(err, connection) {
            connection.query(query1, function (err, rows, fields) {
                if (err) {
                  console.log(err);
                  connection.release();
                  return res.status(400).send('User Already Exists');
                }
                else {
                  if (req.body.usertype === 'city_official') {
                    var coQuery = "INSERT INTO CITY_OFFICIAL (User, Title, Approved, City, State) VALUES (?,?,?,?,?)";
                    var coTable = [req.body.username, req.body.title, null, req.body.city, req.body.state];
                    query2 = mysql.format(coQuery, coTable);
                    console.log(query2);
                    connection.query(query2, function (err, rows, fields) {
                        if (err) {
                          console.log(err);
                          connection.release();
                          return res.status(400).send('Unable to Create User');
                        }
                        else {
                          connection.release();
                          return res.status(200).json({
                              success: true,
                              message: 'Signup Success'
                          });
                        }
                    });
                  }
                  else {
                    connection.release();
                    return res.status(200).json({
                        success: true,
                        message: 'Signup Success'
                    });
                  }
                }
            });
        });
    });

    app.post('/signin', function (req, res) {
    		console.log("GET Request /signin");
        console.log(req.body);


        //var userQuery = "SELECT * FROM USER WHERE Username = ? AND Password = ?";
        //var userTable = [req.body.username, req.body.password];
        //query1 = mysql.format(userQuery, userTable);
        var userQuery = "SELECT * FROM USER WHERE Username = ?";
        var userTable = [req.body.username];
        query1 = mysql.format(userQuery, userTable);
        console.log(query1);

        pool.getConnection(function(err, connection) {
            connection.query(query1, function (err, rows, fields) {
                if (err || rows.length === 0) {
                  return res.status(400).send('User Does Not Exist');
                }
                else {
                  console.log(rows[0].Password);
                  if (req.body.password !== rows[0].Password ) {
                     return res.status(400).send('Bad Password');
                  }
                  else {
                    if (rows[0].User_Type === 'admin') {
                        res.render('admin-dashboard');
                        //res.render('admin-dashboard');
                    }
                    else if (rows[0].User_Type === 'city_scientist') {
                        res.render('data-scientist');
                        //res.render('data-scientist');
                    }
                    else {
                        res.render('city-official-dashboard');
                    }
                  }
                }
            });
        });
    });

};
