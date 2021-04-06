const { request } = require("express");
const db = require("../db");
// consulter les 20 derniers tweets tous utilisateurs confondus

exports.getAll = (callback) => {
    db.query("SELECT * FROM users INNER JOIN tweets ON users.id= tweets.id_user ORDER BY tweets.id DESC LIMIT 20", (error, result) => {
        if (error) {
            console.log("error: ", error);
            callback(error, null);
            return;
        }

        callback(null, result);
    })
}

//  // acceder à mes tweets quqnd je suis connecté


exports.getTweets = (id, callback) => {


        db.query(`SELECT *,tweets.creation_date, tweets.text FROM users INNER JOIN tweets ON users.id= tweets.id_user;`, (error, userTweet) => {
            if (error) {
                console.log("error: ", error);
                callback(error, null);
                return;
            }
            console.log(userTweet)

            callback(null, userTweet);

        })
    }
    // créer un tweet
exports.insertTweet = (id, text, callback) => {
    db.query(`Insert into twitter.tweets (id_user,  text) values ("${id}", "${text}")`, (error, result) => {
        if (error) {
            callback(error, null);
            return;
        }
        // console.log(request.body);

        callback(null, result);
    })
}

// détail d'un tweet

exports.gettweetDetail = (id, tweetId, callback) => {
    db.query(`SELECT * FROM users INNER JOIN tweets ON users.id = tweets.id_user WHERE tweets.id_user= ${id} AND tweets.id = ${tweetId} `, (error, result) => {
        if (error) {
            console.log('error :', error);
            callback(error, null);
            return;
        }
        // console.log(result);
        callback(null, result);
    })

}


// modifier un tweet
exports.updateTweet = (requestBody, tweetId, callback) => {

    var queryUpdate = ` UPDATE tweets set text="${requestBody.message}"   WHERE tweets.id = ${tweetId} `
    console.log(queryUpdate);
    db.query(queryUpdate, (error, result) => {
        if (error) {
            console.log(error);
            callback(error, null);
            return;
        }

        callback(null, result);
    });
}
exports.getUser = (user, callback) => {


    db.query(`SELECT * FROM users LEFT JOIN tweets ON users.id = tweets.id_user WHERE username = "${user.username}";`, (error, result) => {
        if (error) {
            console.log("error: ", error);
            callback(error, null);
            return;
        }
        console.log("bonjour", result)

        callback(null, result);

    })
}