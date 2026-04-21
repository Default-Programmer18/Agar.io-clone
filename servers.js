const express= require("express")
const app=  express();

app.use(express.static(__dirname+ "/public"));
const expressServer=app.listen(8000)

// app.get('/hi',(req,res) =>{
//     console.log ("helllo");
//     res.send("hekkoo")
// })

const socketio=require('socket.io');
const io=socketio(expressServer)

module.exports={
    io,
    app
}