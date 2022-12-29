const express = require('express');
const randomId = require('random-id');
const app = express(),
      bodyParser = require("body-parser"),
      fs = require('fs'),
      port = 3080;

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const customCss = fs.readFileSync((process.cwd()+"/swagger.css"), 'utf8');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://admin:admin@cluster0.dfxf3ml.mongodb.net/?retryWrites=true&w=majority";



// place holder for the data


app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {customCss}));

app.get('/api/todos', (req, res) => {
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("customers").findOne({}, function(err, result) {
    if (err) throw err;
    res.json(result);
    db.close();
  });
});
});

app.post('/api/todo', (req, res) => {
   MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myobj = req.body;
    dbo.collection("customers").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
})

// app.delete('/api/todo/:id', (req, res) => {
//   console.log("Id to delete:::::", req.params.id)
//   tasks = tasks.filter(task => task.id != req.params.id);
//   res.json(tasks);
// })

// app.put('/api/todos/:id', (req, res) => {
//   console.log("Id to update:::::", req.params.id)
//   const taskToUpdate = req.body.task;
//   tasks = tasks.map(task => {
//     if (task.id == req.params.id) {
//       task = taskToUpdate;
//       task.id = parseInt(req.params.id);
//     }
//     return task;
// });
//   res.json(tasks);
// });

app.get('/', (req,res) => {
  res.send(`<h1>API Running on port ${port}</h1>`);
});

app.listen(port, () => {
    console.log(`Server listening on the port::::::${port}`);
});