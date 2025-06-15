const { resource } = require("../app");
let con=require("../Config/db");
let bcrypt=require("bcrypt");

exports.addmovie = (title, desc, date, dir, lang, country, rup, rev, time, img, url, genre_id) => {
  return new Promise((resolve, reject) => {

    // Step 1: Get the genre name using genre_id
    con.query("SELECT name FROM genres WHERE genre_id = ?", [genre_id], (err, result) => {
      if (err) {
        console.log("Genre fetch error:", err);
        return reject("Failed to fetch genre");
      }

      if (result.length === 0) {
        console.log("Genre not found for ID:", genre_id);
        return reject("Invalid genre ID");
      }

      const genre = result[0].genre;

      // Step 2: Proceed to insert the movie
      const query = `
        INSERT INTO movies (
          title, description, release_date, genre,
          director, language, country, budget,
          revenue, runtime, poster_url, trailer_url, genre_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const values = [title, desc, date, genre, dir, lang, country, rup, rev, time, img, url, genre_id];

      con.query(query, values, (err, insertResult) => {
        if (err) {
          console.log("Insert error:", err.sqlMessage || err);
          return reject("Insert Failed");
        }
        resolve("Success");
      });
    });

  });
};

exports.profileapi=(username)=>
{
    return new Promise((resolve,resject)=>
    {
       con.query("select * from users where username=?",[username],(err,result)=>
        {
            resolve(result[0]);
        });
    });
}

exports.updateadmin = (userid, username, password, npass, email) => {
  return new Promise((resolve, reject) => {
    // console.log(userid);
    // Step 1: Fetch hashed password from DB
    con.query("SELECT password FROM users WHERE user_id = ?", [userid], (err, result1) => {
      if (err) return reject("Database error while fetching password");
      if (result1.length === 0) return reject("User not found");

      const dbHashedPassword = result1[0].password;

      // Step 2: Compare entered old password with hashed DB password
      const isMatch = bcrypt.compareSync(password, dbHashedPassword);
      if (!isMatch) {
        return reject("Invalid password. Please enter correct current password.");
      }

      // Step 3: Hash the new password
      const hashedNewPass = bcrypt.hashSync(npass, 8);

      // Step 4: Update profile
      const updateQuery = `
        UPDATE users 
        SET username = ?, password = ?, email = ?, updated_at = NOW() 
        WHERE user_id = ?
      `;

      con.query(updateQuery, [username, hashedNewPass, email, userid], (err, result2) => {
        if (err) return reject("Error while updating profile");
        resolve("Updated Successfully");
      });
    });
  });
};

