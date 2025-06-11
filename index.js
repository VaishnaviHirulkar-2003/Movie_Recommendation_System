let app=require("./src/app");
require("dotenv").config();
let port=process.env.PORT||3000;
app.listen(port,()=>
{
    console.log("Server Started on port"+ port);
});
