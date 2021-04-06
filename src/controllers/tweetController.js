const { response, request } = require("express");

// consulter les 20 derniers tweets tous utilisateurs confondus
const twitter = require("../models/tweets");


exports.findAll = (request, response) => {
    // recuperer les user qui se trouve dans is auth
    const { user } = request
    twitter.getAll((error, tweets) => {
        if (error) {
            response.send(error.message);
        }

        // console.log("tweet ", tweets);

        response.render("home.ejs", { tweets, user });
        console.log('hi ', user)
    });
}




// 2//  consulter la liste des tweets d'un utilisateur précis
exports.findUserTweets = (request, response) => {


    const { id } = request.params;
    const { user } = request;
    // l'envoi de id permet de référencier les users
    console.log('id')

    twitter.getTweets(id, (error, userTweet) => {
        if (error) {
            response.send(error.message);
        }

        console.log(userTweet[0].last_name)
        response.render('userTweets.ejs', { userTweet, user });

    });


}

// acceder à mes tweets quqnd je suis connecte
// exports.myTweet = (request, response) => {


//         const { user } = request;
//         // l'envoi de id permet de référencier les users
//         console.log('users')

//         twitter.getTweets(user, (error, userTweet) => {
//             if (error) {
//                 response.send(error.message);
//             }

//             // console.log(userTweet[0].last_name)
//             response.render('userTweets.ejs', { userTweet, user });

//         });


//     }
// créer un tweet

exports.addTweet = (request, response) => {
    // response.send('bien')=== faire en premier pour verifier la route d'envoi
    const { text } = request.body // const text = request.body.text;
    const id = request.user.id
    console.log('ccc', id)
    console.log('bbbb', text)

    twitter.insertTweet(id, text, (error, result) => {

        if (error) {
            response.send(error.message);
        }

        // recharger la page directement aprés l'ajout d'une donnée

        response.redirect('/');
        // response.send(request.body);


    });


}

// détail d'un tweet
exports.findtweetDetail = (request, response) => {
    // des taches
    const { id } = request.params;
    const { tweetId } = request.params;
    twitter.gettweetDetail(id, tweetId, (error, result) => {
        if (error) {
            response.send(error.message);
        }
        const tweet = result[0];
        response.render("tweetDetails.ejs", { tweet, id, tweetId });


    });

}



// modofier un tweet

exports.updateTweet = (request, response) => {


    const { tweetId } = request.params;

    twitter.updateTweet(request.body, tweetId, (error, result) => {
        if (error) {
            response.send(error.message);
        }


        response.redirect("/username");

    });

}


// 2.ETQ visiteur je veux consulter la liste des tweets d'un utilisateur précis
exports.profileUser = (request, response) => {

    const { user } = request;

    twitter.getUser(user, (error, result) => {
        if (error) {
            response.send(error.message);
        }

        const infoUser = result[0]; //recuperer luser connecté
        const tweets = result; //recuperer tous le tweet de l'utilisateur
        response.render("profile.ejs", { infoUser, tweets });


    });
}