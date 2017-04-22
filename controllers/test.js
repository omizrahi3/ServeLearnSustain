

var users = ['john'];

var password = 123456;


module.exports  = function(app) {
    app.get('/', function (req, res) {
    		console.log("GET Request /");
    		res.render('index');
    });

    app.get('/register', function (req, res) {
        console.log("GET Request /register");

        var cities = [];
        cities.push("Atlanta");
        cities.push("Orlando");
        cities.push("Miami");
        cities.push("Springfield");
        res.locals.cities = cities;
        res.locals.states = [];
        res.render('register');
    });

    app.post('/signup', function (req, res) {
        console.log("GET Request /signup");

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
    });

    app.post('/states', function (req, res) {
    		console.log("GET Request /states");

        var states = [];
        var city = req.body.city;
        if (city === "Atlanta") {
           states.push('Georgia');
        }
        if (city === "Miami" || city === "Orlando") {
           states.push('Florida');
        }
        if (city === "Springfield") {
           states.push('Illinois');
           states.push('Missourri');
        }

        return res.status(200).json({
            success: true,
            states: states,
        });
    });
};
