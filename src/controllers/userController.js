const { response } = require("express")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const { request } = require("http");
const SECRET = "pouetpouet";
const MAXAGE = Math.floor(Date.now() / 1000) + (60 * 60); //transformer la durée de stochage de token en milisecondes  1 hour of expiration




exports.signup = (request, response) => {
    response.render('signup.ejs')
}


// I... inscription

// 1...verifier si lutilisateur n'existe pas
// recuperer un utilisateur par son username afin de 1///verifier quil existe un seul user
exports.newAccount = (request, response) => {
    const { last_name, first_name, birth_date, username, mail, password, phone, city } = request.body; //recuperer ce qui a dans mon request.body dans variable separer pour les recuperer plus facilement
    // console.log(request.body);
    User.getByUsername(username, async(error, result) => {
        if (error) {
            response.send(error.message);
        } else if (result.length !== 0) {
            await request.flash('warning', "A user with this username already exists!");
        } else {
            //    2.....si non récuperer le mot de passe et effectuer un hashage de mot de passe
            // hashage de mot de passe
            const saltRounds = 10;

            bcrypt.hash(password, saltRounds, (error, hash) => {
                if (error) {
                    response.send(error.message);
                }


                //    3. recuperer le mp hasher puis  // creation de compte

                const newUser = {
                    id,
                    last_name,
                    first_name,
                    birth_date,
                    username,
                    mail,
                    phone,
                    city,

                    password: hash
                }

                User.create(newUser, (error, result) => {
                    if (error) {
                        response.send(error.message);

                    }

                    response.redirect("/login");
                })
            })
        }
    });
}


// II.....se connecter
// verifier si username existe déja en voulant se connecter
// on peut reutiliser la meme function plusieurs fois ds le code

exports.login = async(request, response) => {
    // methode fleche:asynchrone
    // request.consumeFlash('warning'); //elle prend un seul paramettre qui'est l'identifiant quon a ceer leur de warning msg. il retourn un tableau avec tous les msg contenant la clé warning
    const alerts_warning = await request.consumeFlash('warning');
    console.log(alerts_warning);
    response.render("login.ejs", { alerts_warning });

}



exports.authenticate = async(request, response) => {
    const { username, password } = request.body;
    if (!username || !password)
        await request.flash('warning', 'veuillez remplir tout les champs.')

    User.getByUsername(username, async(error, result) => {
        if (error) {
            response.send(error.message);
        } else if (result.length === 0) {
            // response.send("A user with this username already exists!");   => redirection vers le login
            //  flesh message permet d'associer l'erreur avec le warning qui sera stocker 
            await request.flash('warning', "this user dosen't exist.")


            response.redirect('/login');
        } else {
            // s'il existe donc on verifie le mot de passe de bd avec bycrypt.compare
            // const hash = result[0].password=>parceque c'est un tableau de mot de passe
            const hash = result[0].password;

            bcrypt.compare(password, hash, async(error, mpcorrect) => {
                if (error) {
                    response.send(error.message);
                }
                // !mpcorrect=(mpcorrect=false)
                else if (!mpcorrect) {
                    await request.flash('warning', "Invalid password!");
                } else {
                    // si oui forger un token jwt pour stocker le mp dans un cookie
                    //    recuperer les infos nécessaire pour la connxeion
                    const user = {
                            id: result[0].id,
                            last_name: result[0].last_name,
                            username: result[0].username,
                            // date d'experation d'un token
                            exp: MAXAGE
                        }
                        // je creer un jwt et je le stock dans un cookie
                        //faire cookie
                    jwt.sign(user, SECRET, (error, token) => {
                        if (error) {
                            response.send(error.message);
                        }

                        request.user = {

                            last_name: result[0].last_name,
                            username: result[0].username,
                            id: result[0].id,
                            city: result[0].city
                        };
                        response.cookie('authcookie', token, { maxAge: MAXAGE });
                        response.redirect('/');
                    });
                }
            });
        }
    })
}



// se deconnecter

exports.logout = (request, response) => {
    response.clearCookie("authcookie");
    response.redirect("/");
}