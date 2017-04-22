

module.exports  = function(app, pool) {
    app.get('/', function (req, res) {
    		console.log("GET Request /");
    		res.render('index');
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
        var username = "'" + req.body.username + "'";
        var email = "'" + req.body.email + "'";
        var password = "'" + req.body.password + "'";
        var user_type = "'" + req.body.usertype + "'";

        var query = "INSERT INTO USER (Username, Email_Address, Password, User_Type) VALUES ("+username+","+email+" ,"+password+" ,"+user_type+" )";
        console.log(query);
        //INSERT INTO USER (Username, Email_Address, Password, User_Type) VALUES ("john", "john@gatech.edu", "123 456", "city_scientist");

        pool.getConnection(function(err, connection) {
            connection.query(query, function (err, rows, fields) {
                connection.release();
                if (err) {
                  return res.status(400).send('User Already Exists');
                }
                else {
                  return res.status(200).json({
                      success: true,
                      message: 'Signup Success'
                  });
                }
            });
        });

        /*
        if (users.indexOf(req.body.username) !== -1) {
            return res.status(400).send('User Already Exists');
        }
        else {
            users.push(req.body.username);
            return res.status(200).json({
                success: true,
                message: 'Signup Success'
            });
        }
        */
    });
};
