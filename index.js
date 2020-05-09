const path = require('path');
const expressEdge = require('express-edge');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Post = require('./database/models/Post');
const fileUpload = require("express-fileupload");
 
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


app.post("/postsimage", (req, res) => {
    const {
        image
    } = req.files
 
    image.mv(path.resolve(__dirname, 'public/posts', image.name), (error) => {
        Post.create({
            ...req.body,
            image: `/posts/${image.name}`
        }, (error, post) => {
            res.redirect('/');
        });
    })
});

app.get('/', async (req, res) => {
    const posts = await Post.find({})
    res.render('index', {
        posts
    })
});

app.get('/', (req, res) => {
    res.render('index')
});

app.get('/criarPost', (req, res) => {
    res.render('create');
});
 
app.get('/about', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/about.html'));
});
 
app.get('/contact', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/contact.html'));
});
 
app.get('/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('post', {
        post
    })
});
app.listen(4000, () => {
    console.log('App listening on port 4000')
});