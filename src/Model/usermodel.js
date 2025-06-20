const { resource } = require("../app");
let con = require("../Config/db");
let bcrypt = require("bcrypt");


exports.addwatchlist = (mid, user) => {
    //first select user id
    console.log(user);
    return new Promise((resolve, reject) => {
        con.query("select * from  users where username=?", [user], (err, r) => {
            if (err) {
                console.log(err);
                reject("not added");
            }
            else {
                let uid = r[0].user_id;
                let role = r[0].role;
                con.query("insert into watchlist(user_id,movie_id) values(?,?)", [uid, mid], (err, r1) => {
                    if (err) {
                        console.log(err);
                        reject("err");
                    }
                    else {
                        if (role == "Admin") {
                            resolve("Added By Admin");
                        }
                        else {
                            resolve("Added By User");
                        }
                    }
                });
            }
        });
    })
};

exports.savedmovies = (username, u) => {
    return new Promise((resolve, reject) => {
        con.query("select mi.title,mi.poster_url,mi.trailer_url,mi.full_movie_url from users u inner join watchlist m inner join movies mi on mi.movie_id=m.movie_id  where u.username=? or username=?", [username, u], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
}

exports.getsearch = (name) => {
    console.log(name);
    return new Promise((resolve, reject) => {
        const searchTerm = `%${name}%`; // Add % wildcards in JS

        const q = `
            SELECT * FROM movies
            WHERE title LIKE ?
            OR language LIKE ?
            OR release_date LIKE ?
            OR genre LIKE ?
            OR director LIKE ?
        `;

        // Pass the same wildcard value for each field
        con.query(q, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};
