var express = require('express');
var RedditAPI = require('./reddit.js');
var bodyParser = require('body-parser')
var app = express();

app.set('view engine', 'pug');


// load the mysql library
var mysql = require('promise-mysql');

// create a connection to our Cloud9 server
var connection = mysql.createPool({
  host: 'localhost',
  user: 'root', // CHANGE THIS :)
  password: '',
  database: 'reddit',
  connectionLimit: 10
});

// load our API and pass it the connection
var RedditAPI = require('./reddit');

var myReddit = new RedditAPI(connection) // request handler 

// app.get('/', function (req, res) {
//   res.send('Hello World!');
//
// app.get('/hello', function(request, response) {
//     response.send("<h1>Hello World!</h1>");
// });

app.use(bodyParser.urlencoded({extended: false}));

app.get('/hello', function(request, response) {

  if (request.query.name) {
    response.send("<h1>Hello " + request.query.name + "</h1>");
  }
  else {
    response.send("<h1>Hello, World</h1>");
  }

});

app.get('/calculator/:operation', function(req, res) {

  var num1 = Number(req.query.num1); // converts a string into a number
  var num2 = Number(req.query.num2);

  if (req.params.operation === "add") {
    res.send(`{
        "operation": "add",
        "firstOperand": ${num1},
        "secondOperand": ${num2},
        "solution": ${num1 + num2}
     }`)

  }
  else if (req.params.operation === "multiply") {

    res.send(`{
        "operation": "multiply",
        "firstOperand": ${num1},
        "secondOperand": ${num2},
        "solution": ${num1 * num2}
      }`)
  }
  else {
    res.status(400); // send a status code of 400 -- bad request
  }

});
//EXCERCISE 4
app.get('/posts1', function(req, res) {
      myReddit.getAllPosts()
        .then(function(posts) {
            var htmlString = `
            <div id="posts">
              <h1>List of posts</h1>
              <ul class="posts-list">
                ${posts.map(post => `
                    <li class="post-item">
                      <h2 class="post-item__${post.title}">
                        <a href="${post.url}">${post.title}</a>
                      </h2>
                      <p>Created by ${post.user.username}</p>
                    </li>
                  `
                ).join("")}
              </ul>
            </div>
          `
          res.send(htmlString);
        })
    });

// EXERCISE 5
app.get('/new-post', function(request, response) {
    
           response.send(`
            <form action="/createPost" method="POST"><!-- why does it say method="POST" ?? -->
                <p>
                  <input type="text" name="url" placeholder="Enter a URL to content">
                </p>
                <p>
                  <input type="text" name="title" placeholder="Enter the title of your content">
                </p>
                  <button type="submit">Create!</button>
            </form>
          `)
        })
        
//EXERCISE 6

app.post('/createPost', function(request, response) {
    myReddit.createPost({
      url: request.body.url,
      title: request.body.title,
      subredditId: 1,
      userId: 1
    }).then(function (result) {
        response.redirect("posts")
    });
})

//EXCERCISE 7

app.get('/createContent', function(request,response){
  response.render('create-content');
});

//EXCERCISE 8

app.get('/posts', function(req, res) {
      myReddit.getAllPosts()
        .then(function(posts) {
          console.log(posts);
           res.render('post-list', {posts: posts});
        })
})

/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */

// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function () {
  console.log('Example app listening at http://%s', process.env.C9_HOSTNAME);
});
