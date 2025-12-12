const express = require("express");
const cors = require("cors");
const mongoClient = require("mongodb").MongoClient;

const url = "mongodb://127.0.0.1:27017";

const app = express();


app.use(cors());
app.use(express.urlencoded({
  extended:true
}));
app.use(express.json());

app.get("/",(req,res)=>{
  res.send("<h2>Hello! Welcome to campus dashboard</h2>");
});
////////////////////////////users///////////////////////
app.get("/users",(req,res)=>{
  mongoClient.connect(url)
  .then(clientObject=>{
    var database = clientObject.db("campus-dashboard");
    database.collection("users").find({}).toArray()
    .then((document)=>{
      res.send(document);
    })
  })
});

app.get("/users/:id",(req,res)=>{
  const user_id = parseInt(req.body.id);
  mongoClient.connect(url)
  .then(clientObject=>{
    var database = clientObject.db("campus-dashboard");
    database.collection("users").find({id:user_id}).toArray().then(document=>{
      res.send(document[0]);
    })
  })
});

app.post("/registeruser",(req,res)=>{
  let user={
    "username":req.body.username,
    "password":req.body.password,
    "gmail":req.body.gmail,
    "mobile":req.body.mobile,
    "points":0
  }
  mongoClient.connect(url).then(clientObject=>{
    var database = clientObject.db("campus-dashboard");
    database.collection("users").insertOne(user)
    .then(()=>{
      res.redirect("/users");
    })
  })
});


////////////////////question set///////////////////////

app.get("/questions",(req,res)=>{
  mongoClient.connect(url)
  .then(clientObject=>{
    var database = clientObject.db("campus-dashboard");
    database.collection("questionsets").find({}).toArray()
    .then((documents)=>{
      res.send(documents);
    })
  })
});

app.post("/questionsets",(req,res)=>{
  let questions={
    "id":req.body.id,
    "title":req.body.title,
    "company":req.body.company,
    "numberofquestions":req.body.numberofquestions,
    "description":req.body.description,
    "questionset":req.body.questionset
  }
  mongoClient.connect(url).then(clientObject=>{
    var database = clientObject.db("campus-dashboard");
    database.collection("questionsets").insertOne(questions)
    .then(()=>{
      console.log(questions," inserted successfully");
    })
    .catch(err=>{
      console.log(err);
    })
  })
});

app.listen(9000);

console.log("server started at port number 9000");
