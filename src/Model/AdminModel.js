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

      const genre = result[0].name;

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
  console.log(username);
    return new Promise((resolve,resject)=>
    {
       con.query("select * from users where username=?",[username],(err,result)=>
        {
          // console.log(result);
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

// exports.saveregadmin = (username, email, oldpass,password, role,uname) => {
//   console.log("model");
//   return new Promise((resolve, reject) =>
//      {
//     con.query("select * from users where username = ?", [uname], (err, result) => {
//       if (err) return reject("Invalid Credentials");
//       if (result.length > 0) {
//         const existingUser = result[0];
//         const match = bcrypt.compareSync(oldpass, existingUser.password);
//         if (match) 
//           {
//                const hashedPassword = bcrypt.hashSync(password, 8);
//                 const insertQuery = "insert into users (username, email, password, role) values(?, ?, ?, ?)";
//                       con.query(insertQuery, [username, email, hashedPassword, role], (err,result1)=> {
//                         if (err) {
//                                      console.log("Insert error:", err);
//                                       return resolve("Username Already Exits");
//                                  }
//                                  console.log("done");
//                     return resolve("Admin Added Sucesfully");
//                 });
//           }
//       }
//     });
//   });
// };

exports.saveregadmin = (username, email, oldpass, password, role, uname) => {
  console.log("model");

  return new Promise((resolve, reject) => {
    // Step 1: Check if the admin (uname) is valid
    con.query("SELECT * FROM users WHERE username = ?", [uname], (err, result) => {
      if (err) return reject("Invalid Credentials");

      if (result.length > 0) {
        const existingUser = result[0];
        const match = bcrypt.compareSync(oldpass, existingUser.password);

        if (match) {
          // Step 2: Check if new username already exists
          con.query("SELECT * FROM users WHERE username = ?", [username], (err2, existing) => {
            if (err2) return reject("Database error during validation");
            if (existing.length > 0) return resolve("Username Already Exists");

            // Step 3: Proceed to insert
            const hashedPassword = bcrypt.hashSync(password, 8);
            const insertQuery = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";

            con.query(insertQuery, [username, email, hashedPassword, role], (err3, result1) => {
              if (err3) {
                console.log("Insert error:", err3);
                return resolve("Insert Failed");
              }
              console.log("done");
              return resolve("Admin Added Successfully");
            });
          });
        } else {
          return resolve("Invalid Current Admin Password");
        }
      } else {
        return resolve("Admin not found");
      }
    });
  });
};

exports.getmoviedata=()=>
{
    return new Promise((resolve,reject)=>
    {
        con.query("select * from movies",(err,result)=>
        {
          if(err)
          {
            reject("Some Problem is here")
          }
          else
          {
            resolve(result);
          }
        })
    });
}

//to fecth the user data to display

exports.viewuser=()=>
{
  return new Promise((resolve,reject)=>
  {
      con.query("SELECT  user_id,username, email,password,role,TIME(created_at) AS created_time,TIME(updated_at) AS updated_time FROM users where role=?",["user"],(err,result)=>
      {
          if(err)
          {
            console.log(err);
            reject(err);
          }
          else
          {
            resolve(result);
          }
      });
  });
}


//get admin model
exports.getaddmin=()=>{
  return new Promise((resolve,reject)=>{
    con.query("SELECT  user_id,username, email,password,role,TIME(created_at) AS created_time,TIME(updated_at) AS updated_time FROM users where role=?",["admin"],(err,result)=>
    {
          if(err)
          {
            console.log(err);
            reject(err)
          }
          else{
            resolve(result);
          }
    });
  });
}
