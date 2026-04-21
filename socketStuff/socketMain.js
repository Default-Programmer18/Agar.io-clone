//server side socket

const io =require("../servers").io
const app=require("../servers").app

////////////////////////////////CLASSES////////////////////////////////////////////////////////////////
const Player=require("./classes/Player")
const PlayerConfig = require("./classes/PlayerConfig")
const PlayerData=require("./classes/PlayerData")
//get orbs
const Orb=require("./classes/orb")
////////////////////////////////CLASSES////////////////////////////////////////////////////////////////
const checkForOrbCollisions=require("./checkCollisions").checkForOrbCollisions
const checkForPlayerCollisions=require("./checkCollisions").checkForPlayerCollisions


const orbs=[]
const settings={
    defaultNumberOfOrbs:4000,
    defaultSpeed:6,
    defaultSize:6,
    defaultZoom:1.5,//as the player grows bigger ,zoom should be decreasd else player takes up the whole screen
    worldHeight:4000,
    worldWidth:4000,
    defaultGenericOrbSize:5,
}

const players=[]
const playerForUser=[]
let ticktoeInterval;
//all non-player orbs will be made-500/5000

//if one is absorbed ,server makes a new one
//on server start malke initial 500

//a player has joined
io.on("connect",(socket)=>{
    //playerconfig need s to be made-data specific to this player none needs to know
    //playerdata need s to be made-data specific to this player everone needs to know
    //master player
    // socket.on("init",(playerObj,ackCallBack)=>{
    // const playerName=playerObj.playerName;
    // const playerconfig=new PlayerConfig(settings);
    // const playerdata=new PlayerData(playerName,settings);
    // const player=new Player(socket.id,playerconfig,playerdata);
    // ackCallBack(orbs)
       
    // })


    let player={};
    socket.on("init",(playerObj,callbackAck)=>{

        if(players.length===0)//if first player is about to join start set interval,it withh go on till discoonect
        {
            //tick-tock-issue an event to eevery sovcket every 33 ms
            //1000/30=33.333 ,so to achieve 30fps ,we need to send an event every 33 ms
            ticktoeInterval= setInterval(()=>{
                 io.to("game").emit('tick',playerForUser);//inside the room onl

                    },33)
        }

        socket.join("game")
       
        const playerName=playerObj.playerName;
        //console.log("hre",playerName)
        const playerConfig=new PlayerConfig(settings);
        const playerData=new PlayerData(playerName,settings);
         player=new Player(socket.id,playerConfig,playerData);
        players.push(player);//server use only
        playerForUser.push({playerData})
         callbackAck(
            {orbsdata:orbs,
                indexInPlayers:playerForUser.length-1
                //to let client know where they are at in players array because user eill be pushed at the end of the array
            })
  
})
  //the client sent over tock
    socket.on("tock",(data)=>{
        //as if discoonected there will be no playerconfig but the tock will keep comming with empty body,
        //leading to server crash as it will not get below coisdes like player.playerConfig.speed
        if(!player.playerConfig)
        return;

              //speed with which player moves
   speed = player.playerConfig.speed
    const xV =player.playerConfig.xVector= data.xVector;
    const yV =player.playerConfig.yVector= data.yVector;

//if player can move in x ,let him move
    if((player.playerData.locX > 5 && xV < 0) || (player.playerData.locX< settings.worldWidth) && (xV > 0)){
        player.playerData.locX += speed * xV;
        
    }
    //if player can move in y ,let him move
     if((player.playerData.locY > 5 && yV > 0) || (player.playerData.locY < settings.worldWidth) && (yV < 0)){
        player.playerData.locY -= speed * yV;
        
    }
     //check for tocking playerto hit orbs
     const capturedOrbI=checkForOrbCollisions(player.playerData,player.playerConfig, orbs,settings)
    //function returns null ,if no collision and index if collision
    
  
    //function returns null,if no collision and index if collision
    if(capturedOrbI !== null){ //index could be 0, so check !null
        //remove the orb that needs to be replaced (at capturedOrbI)
        //add a new Orb
        orbs.splice(capturedOrbI,1,new Orb(settings));

        //now update the clients with the new orb
        const orbData = {
            capturedOrbI,
            newOrb: orbs[capturedOrbI],
        }
        //emit to all sockets playing the game, the orbSwitch event so it can update orbs... just the new orb
        io.to('game').emit('orbSwitch',orbData);
        //emit to all sockets playing the game, the updateLeaderBoard event because someone just scored
        io.to('game').emit('updateLeaderBoard',getLeaderBoard());
    }
    //console.log(player)
    //player collision
    const absorbData=checkForPlayerCollisions(player.playerData,player.playerConfig, players,playerForUser,socket.id)
    if(absorbData)
    {
        io.to('game').emit('playerAbsorbed',absorbData)
        //emit to all sockets playing the game, the updateLeaderBoard event because someone just scored
        io.to('game').emit('updateLeaderBoard',getLeaderBoard())
    }

    })

    socket.on('disconnect',(reason)=>{
        console.log(reason)
        //if a player closes  a browser ,then orb remains
        //so splice that player if he stops ticking i.e transport  close or browser close happens
        for(let i=0;i<players.length;i++)
        {if(players[i].socketId===player.socketId)
            //error occuring due to trannsport close of this player
            {
                players.splice(i,1,{});
                playerForUser.splice(i,1,{});
                break;
            }

        }

        if(players.length===0)
        clearInterval(ticktoeInterval)
        
    })

})






 const initGame=()=>{

    for(let i=0;i<500;i++)
    {
        orbs.push(new Orb(settings));
    }
 }
 initGame();

 function getLeaderBoard(){
    const leaderBoardArray = players.map(curPlayer=>{
        if(curPlayer.playerData){
            return{
                name: curPlayer.playerData.name,
                score: curPlayer.playerData.score,
                socketId: curPlayer.playerData.socketId
            }
        }else{
            return {}
        }
    })
    return leaderBoardArray;
}