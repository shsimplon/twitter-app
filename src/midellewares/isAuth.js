const jwt = require('jsonwebtoken');

const SECRET = "pouetpouet";

const isAuth = (request, response, next) => {
    const token = request.cookies.authcookie;

    // secret pour montrer que c'est nous quil'ont creer
    jwt.verify(token, SECRET, (error, user) => {
        if (error) {
            response.send(error.message);
        } else {
            // si la date de cookie ext expéré connecte toi donc on peut pas accéder a la deuxieme page
            const { last_name, id, username, exp } = user;

            // Useless or not ?!
            if (Date.now() / 1000 >= exp) {
                response.clearCookie("authcookie");
                response.send("Session expired. Try to reconnect you.");
            }
            // si valide connect toi et  request.user sera ajouter sur la page montrer les tweets de chaque users
            request.user = { last_name, id, username };
            next();
        }
    })
};

module.exports = isAuth;