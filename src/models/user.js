const db = require("../db")

// verifier si l'username existe deja
exports.getByUsername = (username, callback) => {
        db.query(`SELECT * FROM users WHERE username = "${username}";`, (error, result) => {
            if (error) {
                console.log("error: ", error);
                callback(error, null);
                return;
            }

            callback(null, result);
        })
    }
    // creation de compte


exports.create = (user, info, callback) => {
    db.query(`INSERT INTO users VALUES(id, "${user.last_name}", "${user.first_name}", "${info.birth_date}", "${user.username}", "${info.mail}", "${user.password}", "${info.phone}", "${info.city}");`, (error, result) => {
        if (error) {
            console.log("error: ", error);

            callback(error, null);
            return;
        }

        callback(null, result);
    })
}