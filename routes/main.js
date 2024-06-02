// The main.js file of your application
module.exports = function(app) 
{ 
    // render index page
    app.get("/", function(req, res)
    { 
        res.render("index.html");
    });

    // render about page
    app.get("/about", function(req, res)
    {
        res.render("about.html");
    });

    // render device status page
    app.get("/devicestatus", function(req, res) { 
        // query database to get all the books
        // set status 1 or 0 to on or off
        let sqlquery = "SELECT id, name, type, CASE WHEN status THEN 'On' ELSE 'Off' END AS status, volume, temperature, speed FROM devices";
        // execute sql query
        db.query(sqlquery, (err, result) => { 
            if (err) { 
                res.redirect("/");
            } 
            res.render("devicestatus.html", {availabledevices: result});
        });
    });


    // render add device page
    app.get("/adddevice", function(req, res) { 
        res.render("adddevice.html");
    });
    
    app.post("/deviceadded", function (req,res) {
        // saving data in database 
        let sqlquery = "INSERT INTO devices (name, type, status, temperature, volume, speed) VALUES (?,?,?,?,?,?)"; 
        // execute sql query
        let newrecord = [req.body.name, req.body.type, req.body.status, req.body.temperature, req.body.volume, req.body.speed]; 
        newrecord = changeEmptyToNull(newrecord);
        db.query(sqlquery, newrecord, (err, result) => { 
            if (err) { 
                res.redirect("/adddevice");
            }else {
                res.redirect("/devicestatus");
            }  
        }); 
    });

    // render delete device page
    app.get("/deletedevice", function(req, res) { 
        res.render("deletedevice.html");
    });
    
    app.post("/devicedeleted", function (req,res) {
        // saving data in database 
        let sqlquery = "DELETE FROM devices WHERE id = ? AND name = ? AND type = ?";
        // execute sql query
        let newrecord = [req.body.id, req.body.name, req.body.type]; 
        db.query(sqlquery, newrecord, (err, result) => { 
            if (err) { 
                res.redirect("/deletedevice"); 
            }else {
                res.redirect("/devicestatus");
            }  
        }); 
    });


    // render control page
    app.get("/control", function(req, res) { 
        // query database to get all the books
        let sqlquery = "SELECT * FROM devices";
        // execute sql query
        db.query(sqlquery, (err, result) => { 
            if (err) { 
                res.redirect("/");
            } 
            res.render("control.html", {availabledevices: result});
        });
    });

    app.post("/deviceupdated", function (req,res) {
        // saving data in database
        let sqlquery = "UPDATE devices SET name = ?, type = ?, status = ?, temperature = ?, volume = ?, speed = ? WHERE id = ?";
        // execute sql query
        let newrecord = [req.body.name, req.body.type, req.body.status, req.body.temperature, req.body.volume, req.body.speed, req.body.id];
        newrecord = changeEmptyToNull(newrecord);
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                res.redirect("/control");
            }else {
                res.redirect("/devicestatus");
            }
        });
    });
}

// If form input is empty, changes it to null
function changeEmptyToNull(list) 
{
    
    for(i = 0; i < list.length; i++)
    {
        if(list[i] == '')
        {
            list[i] = null;
        }
    }
    return list;
}

app.post("/create-user", function (req, res) {
    //gets username, email and password
    var username = req.body.username
    var email = req.body.email
    var password = req.body.password

    //registers the new user
    User.register(new User ({username: username}), ({ email: email }), password, function (err, user) {
        //if error, refreshes the page
        if (err) {
            console.log(err);
            return res.render("create-user");
        }
        //authenticate
        passport.authenticate("local")(req, res, function () {
        
        //if successful, displays message and send user to home page
        req.flash('Success', 'You created a new account')
        res.render("home");
        });
    });
});


//render workouts page
app.get("/workouts", function(req, res) { 
    // query database to get all the workouts
    let sqlquery = "SELECT * FROM workouts";
    // execute sql query
    db.query(sqlquery, (err, result) => { 
        //refreshes page
        if (err) { 
            res.redirect("/");
        } 
        res.render("workouts.html", {availableworkouts: result});
    });
});