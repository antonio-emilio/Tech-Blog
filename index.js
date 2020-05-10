const expressEdge = require("express-edge");
const express = require("express");
const edge = require("edge.js");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const expressSession = require('express-session'); 
const connectMongo = require('connect-mongo');
const auth = require("./middleware/auth");
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated')
const connectFlash = require("connect-flash");
const storePost = require('./middleware/storePost')

const createPostController = require('./controllers/createPost');
const homePageController = require('./controllers/homePage');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const createUserController = require("./controllers/createUser");
const storeUserController = require('./controllers/storeUser');
const loginController = require("./controllers/login");
const loginUserController = require('./controllers/loginUser');
const app = new express();

mongoose.connect('mongodb+srv://antonio:ef9rYhyMftWx06q6@cluster0-awgkb.gcp.mongodb.net/techblog?authSource=admin&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass%20Community&retryWrites=true&ssl=true', { useNewUrlParser: true })
    .then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong', err))

const mongoStore = connectMongo(expressSession);
 
var favicon = require('serve-favicon');

app.use(favicon(__dirname + '/public/img/favicon.png'));

app.use(expressSession({
    secret: 'secret',
    store: new mongoStore({
        mongooseConnection: mongoose.connection
     })
 }));
     
app.use(connectFlash());    
app.use(fileUpload());
app.use(express.static('public'));
app.use(expressEdge.engine);
app.set('views', __dirname + '/views');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('*', (req, res, next) => {
    edge.global('auth', req.session.userId)
    next()
});

app.get("/", homePageController);
app.get("/createPost", createPostController);
app.use('/postsimage', storePost);
app.get('/login', loginController);
app.post('/usersLogin', loginUserController);
app.get("/createUser", createUserController);
app.get("/:id", getPostController);
app.post("/postsimage", storePostController);
app.post("/usersReg", storeUserController);
app.get("/new", createPostController);


app.listen(4000, () => {
    console.log('App listening on port 4000')
});