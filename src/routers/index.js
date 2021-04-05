const express = require("express");
const isAuth = require('../midellewares/isAuth')
const tweetController = require("../controllers/tweetController");
const userController = require("../controllers/userController")
const router = express.Router();


// consulter les 20 derniers tweets tous utilisateurs confondus
router.get("/", tweetController.findAll);


//  consulter la liste des tweets d'un utilisateur précis
// isAuth est un midelleware est ajouter pour empecher l'accée à cette page sin on est pas connecter

router.get('/tweets/:id', isAuth, tweetController.findUserTweets);

//  créer un tweet
router.post('/addTweet', isAuth, tweetController.addTweet);
// montre le shemin vers de iduser et son tweet

router.get('/users/:id/tweets/:tweetId', isAuth, tweetController.findtweetDetail);


router.post('/updatetweet/:tweetId', isAuth, tweetController.updateTweet);
router.get('/username', isAuth, tweetController.myTweet);

router.get('/signup', userController.signup);
router.post('/signup', userController.newAccount);
router.post('/login', userController.authenticate)
router.get('/login', userController.login);
router.get("/logout", userController.logout);













module.exports = router;