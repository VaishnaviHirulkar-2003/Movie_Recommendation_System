const { resource } = require("../app");
let con=require("../Config/db");
let bcrypt=require("bcrypt");


exports.loginuser = (username, password, role) => {
  return new Promise((resolve, reject) => {
    con.query("SELECT * FROM users WHERE username=? AND role=?", [username, role], (err, result) => {
      if (err) {
        return reject("Database error");
      }

      else if (result.length === 0) {
        return resolve("Invalid Username or Role");
      }

      const npass = result[0].password;
      const comparepass = bcrypt.compareSync(password, npass);

      if (comparepass) {
        // console.log("Login successful");
        resolve("Success");
      } else {
        reject("Invalid Password");
      }
    });
  });
};
exports.savereguser=(username,email,password,role)=>
{
    let pass=bcrypt.hashSync(password,4);
    return new Promise((resolve,reject)=>
    {
        con.query("insert into users(username,email,password,role)values(?,?,?,?)",[username,email,pass,role],(err,result)=>
        {
            if(err)
            {
               console.log("Database Error:", err);
                return resolve("Enter another username and passowrd");
            }
            else
            {
                resolve("Sucess");
            }
        }
        );
    });
    //password incrypt format
}
//for  userdashbaord

exports.gettodata=()=>
{
    return new Promise((resolve,reject)=>
    {
         con.query("Select poster_url,trailer_url,Title from movies order by movie_id desc limit 1",(err,result)=>
        {
            if(err)
            {
              reject("err");
            }
            else
            {
              if(result.length==0)
              {
                reject("Err");
              }
              else
              {
                console.log(result);
                resolve(result[0]);
              }
            }
        });
    });
};

exports.getlatest=()=>
{
  return new Promise((resolve,reject)=>
  {
      con.query("select * from  movies limit 4",(err,result)=>
      {
        if(err)
        {
          reject(err);
        }
        else
        {
          resolve(result);
        }
      })
  });
}

exports.getmarathimovie=()=>
{
  return new Promise((resolve,reject)=>
  {
      con.query("Select * from movies where language=?",["marathi"],(err,result)=>
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

exports.getactionmovies=(req,res)=>
{
  return new Promise((resolve,reject)=>
  {
      con.query("Select * from movies where genre=?",["action"],(err,result)=>
      {
        if(err)
        {
          return reject(err);
        }
          resolve(result);
      });
  });
};

//for recommnadtion
 // adjust path as needed

exports.recommendation = (username) => {
  console.log(username);
  return new Promise((resolve, reject) => {
    const preferenceQuery = `
      SELECT m.genre
      FROM movies m
      JOIN watchlist w ON m.movie_id = w.movie_id
      JOIN users u ON w.user_id = u.user_id
      WHERE u.username = ?
    `;

    con.query(preferenceQuery, [username], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve([]);

      const genreCount = {};
      const categoryCount = {};

      results.forEach(row => {
        if (row.genre) {
          row.genre.split(',').forEach(g => {
            const trimmed = g.trim().toLowerCase();
            genreCount[trimmed] = (genreCount[trimmed] || 0) + 1;
          });
        }
        if (row.category) {
          const trimmed = row.category.trim().toLowerCase();
          categoryCount[trimmed] = (categoryCount[trimmed] || 0) + 1;
        }
      });

      const topGenres = Object.entries(genreCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(g => g[0]);

      const topCategories = Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 1)
        .map(c => c[0]);

      if (topGenres.length === 0 && topCategories.length === 0) return resolve([]);

      const genrePlaceholders = topGenres.map(() => 'genre LIKE ?').join(' OR ');
      const categoryPlaceholders = topCategories.map(() => 'category LIKE ?').join(' OR ');
      const whereClause = [genrePlaceholders, categoryPlaceholders].filter(Boolean).join(' OR ');

      const finalQuery = `
        SELECT * FROM movies
        WHERE (${whereClause})
        AND movie_id NOT IN (
          SELECT w.movie_id FROM watchlist w
          JOIN users u ON w.user_id = u.user_id
          WHERE u.username = ?
        )
        LIMIT 10
      `;

      const values = [
        ...topGenres.map(g => `%${g}%`),
        ...topCategories.map(c => `%${c}%`),
        username
      ];

      con.query(finalQuery, values, (err2, recommended) => {
        if (err2) return reject(err2);
        resolve(recommended);
      });
    });
  });
};

exports.getsports = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM movies WHERE genre = 'Sports'`;

    con.query(sql, (err, result) => {
      if (err) {
        console.error("Error fetching sports movies:", err);
        return reject(err);
      }
      resolve(result);
    });
  });
};
