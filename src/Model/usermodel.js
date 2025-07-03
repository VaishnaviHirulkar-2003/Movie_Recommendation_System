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
        con.query(`SELECT mi.title, mi.poster_url, mi.trailer_url, mi.full_movie_url,m.watchlist_id
FROM users u
INNER JOIN watchlist m ON u.user_id = m.user_id
INNER JOIN movies mi ON mi.movie_id = m.movie_id
WHERE u.username = ? OR u.username = ?
`, [username, u], (err, result) => {
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

exports.getuserdata = (name) => {
    return new Promise((resolve, reject) => {
        con.query("select * from users where username=?", [name], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                if (result.length == 0) {
                    return reject("invalid");
                }
                else {
                    resolve(result[0]);
                }
            }
        });
    });
};

exports.UpdateuserafterProfile = (id, oldpass, newHashedPass, username, email) => {
    return new Promise((resolve, reject) => {
        con.query("SELECT password FROM users WHERE user_id=?", [id], async (err, result) => {
            if (err) return reject(err);
            if (result.length === 0) return resolve("false");

            const currentHashedPass = result[0].password;
            const isMatch = await bcrypt.compare(oldpass, currentHashedPass);

            if (!isMatch) return resolve("false");

            con.query(
                "UPDATE users SET username=?, email=?, password=? WHERE user_id=?",
                [username, email, newHashedPass, id],
                (err2) => {
                    if (err2) return reject(err2);
                    return resolve("true");
                }
            );
        });
    });
};
exports.deleteuser = (id) => {
  return new Promise((resolve, reject) => {
    // Step 1: Delete from watchlist using INNER JOIN
    const deleteWatchlist = `
      DELETE m FROM watchlist m
      INNER JOIN users u ON u.user_id = m.user_id
      WHERE u.user_id = ?
    `;

    con.query(deleteWatchlist, [id], (err, result1) => {
      if (err) {
        console.error("Error deleting from watchlist:", err);
        return reject(err);
      }

      // Step 2: Delete the user
      const deleteUser = `DELETE FROM users WHERE user_id = ?`;
      con.query(deleteUser, [id], (err2, result2) => {
        if (err2) {
          console.error("Error deleting user:", err2);
          return reject(err2);
        }

        resolve("success");
      });
    });
  });
};

exports.getuserdatabyid = (userid) => {
    return new Promise((resolve, reject) => {
        con.query("select * from users where user_id=?", [userid], (err, r) => {
            if (err) {
                return reject(err);
            }
            resolve(r[0]);
        });
    });
}

//for delete watchlist

exports.removewatchlistuser=(id,wid)=>
{
    return new Promise((resolve,reject)=>
    {
            con.query("delete from watchlist where movie_id=? and watchlist_id=?",[id,wid],(err,result)=>
            {
                    if(err)
                    {
                        reject("false");
                    }
                    else
                    {
                        resolve("true");
                    }
            });
    });
}
