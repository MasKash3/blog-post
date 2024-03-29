const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv:CREDENTIALS", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const postSchema = {
  title: {
    type: String,
    required: [true, "Please enter a title."]
  },
  content: String
}

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  Post.find({}, function(err, foundPosts){
    if(foundPosts.length === 0){
      res.render("home", {startingContent: homeStartingContent, posts: []})
    } else{
      res.render("home", {startingContent: homeStartingContent, posts: foundPosts})
    }
  })
})

app.get("/about", function(req, res){
  res.render("about", {aboutStartingContent: aboutContent});
})

app.get("/contact", function(req, res){
  res.render("contact", {contactStartingContent: contactContent});
})

app.get("/compose", function(req, res){
  res.render("compose");
})

app.get("/posts/:postName", function(req, res){
  const lowerpostName = _.lowerCase(req.params.postName);
  Post.find({}, function(err, foundPosts){
    if(!err){
      foundPosts.forEach(function(post){
        const lowerpostTitle = _.lowerCase(post.title);
        if(lowerpostName === lowerpostTitle){
          res.render("post", {title: _.capitalize(post.title), content: _.capitalize(post.content)});
        } else{
          console.log("Don't know what wrong!");
        }
      })
    }
  })

})


app.post("/compose", function(req, res){
  const title = req.body.myTitle;
  const content = req.body.myText;
  const post = new Post({title: _.capitalize(title), content: _.capitalize(content)});
  post.save();
  res.redirect("/");
})

app.post("/delete", function(req, res){
  const postID = req.body.trashButton;
  Post.findByIdAndRemove(postID, function(err){
    if(!err){
      console.log("Successfully removed post.");
      res.redirect("/");
    }
  })
})



app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
