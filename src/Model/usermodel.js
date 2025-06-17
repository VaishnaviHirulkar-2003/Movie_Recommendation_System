const { resource } = require("../app");
let con=require("../Config/db");
let bcrypt=require("bcrypt");


exports.addwatchlist=(mid,user)=>
{
    //first select user id
    console.log(user);
    return new Promise((resolve,reject)=>
    {
         con.query("select * from  users where username=?",[user],(err,r)=>
            {   
            if(err)
            {
                console.log(err);
                reject("not added");
            }
            else
            {
            let uid=r[0].user_id;
            let role=r[0].role;
            con.query("insert into watchlist(user_id,movie_id) values(?,?)",[uid,mid],(err,r1)=>
            {
                if(err)
                    {
                        console.log(err);
                        reject("err");
                    }       
                    else
                    {
                        if(role=="Admin")
                        {
                        resolve("Added By Admin");
                        }
                        else
                        {
                            resolve("Added By User");
                        }
                    }
            });
        }
        });
    })
};