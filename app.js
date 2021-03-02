const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https=require("https");

const app = express();

app.use(express.static("public")); //used to post static(local) files of the system on the server

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {   //when a user request something from the server
  res.sendFile(__dirname + "/signup.html"); //fulfiling the request of the user
})

app.post("/", function(req, res) {

  const fname = req.body.fname; //getting data that user has inputted
  const lname = req.body.lname;
  const email = req.body.email;
  const data = {            //making an object of the user's data
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fname,
        LNAME: lname
      }
    }]
  };

  const jsonData = JSON.stringify(data);
  const url = "https:us17.api.mailchimp.com/3.0/lists/1a71ee1ba4"
  const options = {
    method: "POST",
    auth: "kunal:f59387cc70506fdaf5fa49b0f7b19505-us17"
  }

  const request = https.request(url, options, function(response) { //posting the user data on mailchimp server

    if (response.statusCode === 200) {  //if the return status code is 200, means the request was successful
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html")
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
})



// API key  = f59387cc70506fdaf5fa49b0f7b19505-us17

// list id = 1a71ee1ba4
