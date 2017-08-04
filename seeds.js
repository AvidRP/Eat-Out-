var mongoose = require("mongoose");
var User = require("./models/user.ejs");


function seedDB() {
  User.remove({}, function (err) {
    if(err) {
      console.log(err)
    }
    console.log("User removed");
  })

  User.create

}

module.exports = seedDB;
