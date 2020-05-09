const expressEdge = require("express-edge");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
 
const createPostController = require('./controllers/createPost');
const homePageController = require('./controllers/homePage');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const createUserController = require("./controllers/createUser");
const storeUserController = require('./controllers/storeUser');
const app = new express();
 
mongoose.connect('mongodb+srv://antonio:ef9rYhyMftWx06q6@cluster0-awgkb.gcp.mongodb.net/techblog?authSource=admin&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass%20Community&retryWrites=true&ssl=true', { useNewUrlParser: true })
    .then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong', err))

app.use(fileUpload());
app.use(express.static('public'));
app.use(expressEdge.engine);
app.set('views', __dirname + '/views');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

const storePost = require('./middleware/storePost')
app.get("/", homePageController);
app.use('/postsimage', storePost)
app.get("/createUser", createUserController);
app.get("/createPost", createPostController);
app.get("/:id", getPostController);
app.post("/postsimage", storePostController);
app.post("/usersReg", storeUserController);

app.listen(4000, () => {
    console.log('App listening on port 4000')
});