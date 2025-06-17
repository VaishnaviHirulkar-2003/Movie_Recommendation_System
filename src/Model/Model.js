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