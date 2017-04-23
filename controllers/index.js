var mysql = require('mysql');

module.exports  = function(app, pool) {

    //Render Login Page
    app.get('/', function (req, res) {
        console.log("GET Request /");
        res.render('index');
    });

    //Render Admin Dashboard
    app.get('/admin-dashboard', function (req, res) {
        console.log("GET Request /");
        res.render('admin-dashboard');
    });

    //CREATE a datapoint
    app.post('/datapoint', function (req, res) {
    		console.log("POST Request /datapoint");

        var datetime = req.body.date+" "+req.body.time;
        var query = "INSERT INTO DATA_POINT (Date_Time, POI_LN, Approved, D_Type, D_Value) VALUES (?,?,?,?,?)";
        var table = [datetime, req.body.poi, null, req.body.datatype, req.body.datavalue];
        query = mysql.format(query, table);

        pool.getConnection(function(err, connection) {
            connection.query(query, function (err, rows, fields) {
                connection.release();
                if (err) {
                  return res.status(400).send('Could Not Save Datapoint');
                }
                else {
                  return res.status(200).json({
                      success: true
                  });
                }
            });
        });
    });

    //Render New POI Page
    app.get('/city-scientist-poi', function (req, res) {
    		console.log("GET Request /city-scientist-poi");

        var query = "SELECT DISTINCT City_Name FROM CITY_STATE";

        pool.getConnection(function(err, connection) {
            connection.query(query, function (err, rows, fields) {
                connection.release();
                var cities = [];
                console.log(rows);
                rows.map(function(record) {
                    cities.push(record.City_Name);
                });
                res.locals.cities = cities;
                res.locals.states = [];
                res.render('city-scientist-poi');
            });
        });
    });

    //Create new POI
    app.post('/poi', function (req, res) {
    		console.log("POST Request /poi");

        console.log(req.body);

        var statement = "INSERT INTO POI (Location_Name, Zip_Code, City, State) VALUES (?,?,?,?)";
        var table = [req.body.poiname, req.body.zipcode, req.body.city, req.body.state];
        var query = mysql.format(statement, table);

        pool.getConnection(function(err, connection) {
            connection.query(query, function (err, rows, fields) {
                connection.release();
                if (err) {
                  return res.status(400).send('Could Not Save POI');
                }
                else {
                  return res.status(200).json({
                      success: true
                  });
                }
            });
        });
    });

    //Reject Pending City Official
    app.post('/reject-official', function (req, res) {
    		console.log("POST Request /reject-official");
        console.log(req.body);
    });

    //Accept Pending City Official
    app.post('/accept-official', function (req, res) {
    		console.log("POST Request /accept-official");
        console.log(req.body);
    });

    //Reject Pending Datapoint
    app.post('/reject-datapoint', function (req, res) {
    		console.log("POST Request /reject-datapoint");
        console.log(req.body);
    });

    //Accept Pending Datapoint
    app.post('/accept-datapoint', function (req, res) {
    		console.log("POST Request /accept-datapoint");
        console.log(req.body);
    });

    //Render City Official Filter/Search POI Page
    app.get('/city-official-filter-POI', function (req, res) {
    		console.log("GET Request /city-official-filter-POI");

        var statement1 = "SELECT DISTINCT Location_Name FROM POI";
        var statement2 = "SELECT DISTINCT City_Name FROM CITY_STATE";

        pool.getConnection(function(err, connection) {
            connection.query(statement1, function (err, rows, fields) {
                var pois = [];
                rows.forEach(function(record) {
                    pois.push(record.Location_Name);
                });
                res.locals.pois = pois;
                connection.query(statement2, function (err, rows, fields) {
                    connection.release();
                    var cities = [];
                    rows.forEach(function(record) {
                        cities.push(record.City_Name);
                    });
                    console.log(cities);
                    res.locals.cities = cities;
                    res.render('city-official-filter-POI');
                });
            });
        });
    });

    //Render Admin Pending City Officials Page
    app.get('/admin-pending-city-officials', function (req, res) {
    		console.log("GET Request /admin-pending-city-officials");

        var pendingQuery = "SELECT u.Username, u.Email_Address, o.City, o.State, o.Title FROM USER u JOIN CITY_OFFICIAL o ON u.Username = o.User WHERE o.Approved IS NULL";

        pool.getConnection(function(err, connection) {

            connection.query(pendingQuery, function (err, rows, fields) {
                connection.release();
                console.log(rows);

                var pending_city_officials = [];
                rows.forEach(function(record) {
                    var pending_official = {
                      user : record.Username,
                      title : record.Title,
                      email: record.Email_Address,
                      approved : record.Approved,
                      city : record.City,
                      state : record.State
                    };
                    pending_city_officials.push(pending_official);
                });
                console.log(pending_city_officials);
                res.locals.officials = pending_city_officials;
                res.render('admin-pending-city-officials');
            });
        });
    });

    //Render Admin pending Datapoints page
    app.get('/admin-pending-data-points', function (req, res) {
    		console.log("GET Request /admin-pending-data-points");

        var query = "SELECT * FROM DATA_POINT WHERE Approved IS NULL";

        pool.getConnection(function(err, connection) {

            connection.query(query, function (err, rows, fields) {
                connection.release();
                console.log(rows);

                var pending_data_points = [];
                rows.forEach(function(record) {
                    var pending_point = {
                      poi : record.POI_LN,
                      datetime : record.Date_Time,
                      datatype: record.D_Type,
                      datavalue : record.D_Value
                    };
                    pending_data_points.push(pending_point);
                });
                console.log(pending_data_points);
                res.locals.datapoints = pending_data_points;
                res.render('admin-pending-data-points');
            });
        });
    });

    //Get All States associates with city
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
                console.log(states);
                return res.status(200).json({
                    success: true,
                    states: states,
                });
            });
        });
    });

    //Render Register Page
    app.get('/register', function (req, res) {
        console.log("GET Request /register");
        pool.getConnection(function(err, connection) {
            connection.query("SELECT DISTINCT City_Name FROM CITY_STATE", function (err, rows, fields) {
                connection.release();
                var cities = [];
                console.log(rows);
                rows.map(function(record) {
                    cities.push(record.City_Name);
                });
                console.log(cities);
                res.locals.cities = cities;
                res.locals.states = [];
                res.render('register');
            });
        });
    });

    //Create new user account
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

    //Login
    app.post('/signin', function (req, res) {
    		console.log("GET Request /signin");
        console.log(req.body);

        var userQuery = "SELECT * FROM USER WHERE Username = ?";
        var userTable = [req.body.username];
        query1 = mysql.format(userQuery, userTable);
        console.log(query1);

        pool.getConnection(function(err, connection) {
            connection.query(query1, function (err, rows, fields) {
                connection.release();
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
                    }
                    else if (rows[0].User_Type === 'city_scientist') {
                        res.redirect('/city-scientist-datapoint');
                    }
                    else {
                        res.render('city-official-dashboard');
                    }
                  }
                }
            });
        });
    });

    //Render City Scientist Create Datapoint page
    app.get('/city-scientist-datapoint', function (req, res) {
        console.log("GET Request /city-scientist-datapoint");
        var query1 = "SELECT * FROM DATA_TYPE";
        pool.getConnection(function(err, connection) {
            connection.query(query1, function (err, rows, fields) {
              var data_types = [];
              rows.map(function(record) {
                  data_types.push(record.Type);
              });
              res.locals.data_types = data_types;
              var query2 = "SELECT * FROM POI";
              connection.query(query2, function (err, rows, fields) {
                  var pois = [];
                  rows.map(function(record) {
                      pois.push(record.Location_Name);
                  });
                  res.locals.pois = pois;
                  res.render('city-scientist-datapoint');
              });
            });
        });
    });

};
