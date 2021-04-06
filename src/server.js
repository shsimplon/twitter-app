const { request, response } = require("express");
const express = require('express');

const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { flash } = require('express-flash-message');

const server = express();

// appliquer le midelleware session sur notre serveur


server.use(session({
    secret: 'keyboard cat', //               c'est grace a cette clé quon peut crypté et dycrepter le cookie
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } //on le mis en false parceque on le fait en local mais c'est imporantttttttttttttttt de le mettre à true pour le mettre en public pour quil s'affcihe en protocole https
}))
server.use(flash({ sessionKeyName: 'flashMessage' }));


const router = require("./routers");



server.engine("ejs", ejs.renderFile);

server.set("views", "./src/views");

server.use(express.static("./src/assets"));




server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());

server.use(router);

server.listen(8085, () => {
    console.log("Server running at port 8085");

});