//client side  socket stuff
const socket =io.connect("http://localhost:8000")

//works wg=hen player starts playing
const init=async()=>{
    const initData=await socket.emitWithAck('init',{
          playerName:player.name//from uistuff
})
     
        
        //console.log(orbs)
    
    //await is over ,so we need to tock to inform our mouse position
    setInterval(async()=>{
        socket.emit('tock',{
            xVector:player.xVector ? player.xVector : .1 ,
            yVector:player.yVector ? player.yVector :  .1
        })
    },33)

    // socket.emit('init',{playerName:player.name})
    // socket.on('initret',(data)=>{
    //     orbs=data.orbs;
    //     console.log(orbs)
      
    // })
    ;

    orbs=initData.orbsdata
    player.indexInPlayers=initData.indexInPlayers
    draw();
}
//server sends out the location and data of all the palyers 
socket.on('tick',(playersArray)=>
{
   //console.log(players)
    players=playersArray
    // console.log(players)
    //updating the location of the palyer from global players array also used to calm the camera
    if(players[player.indexInPlayers].playerData){
    player.locX=players[player.indexInPlayers].playerData.locX;
    // console.log("jlhyiggm")
    // console.log(players[player.indexInPlayers].playerData.locX)
     player.locY=players[player.indexInPlayers].playerData.locY;
     document.querySelector('.player-score').innerHTML =` ${players[player.indexInPlayers].playerData.score}`}
     //console.log(player)


})

socket.on('orbSwitch',orbData=>{
    //the server just told us that an orb was absorbed. Replace it in the orbs array!
    orbs.splice(orbData.capturedOrbI,1,orbData.newOrb);
})

socket.on('playerAbsorbed',absorbData=>{
    //the server just told us that an orb was absorbed. Replace it in the orbs array!
   document.querySelector('#game-message').innerHTML=
   `${absorbData.absorbed} was absorbed by ${absorbData.absorbedBy}`;
   document.querySelector('#game-message').style.opacity=1;
   window.setTimeout(()=>{
    document.querySelector('#game-message').style.opacity=0;
   },2000)
    

})


socket.on('updateLeaderBoard',(leaderBoardArray)=>{
    // console.log(leaderBoardArray)
    leaderBoardArray.sort((a,b)=>{
        return b.score - a.score
    })

    document.querySelector('.leader-board').innerHTML = ""
    
    leaderBoardArray.forEach(p => {
        if(!p.name)
        return;

        document.querySelector('.leader-board').innerHTML+=
        `<li class="leaderboard-player">${p.name} - ${p.score}</li>`
     
        

    })
        
    });
