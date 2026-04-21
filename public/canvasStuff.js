
////////////////////////////////////////////////////////////////
///////////draw////////////////////////////////
////////////////////////////////////////////////////////////////
   
//starting axis of player between 10 to 510
//    player.locX=Math.floor(500*Math.random()+10)
//    player.locY=Math.floor(500*Math.random()+10)

const draw=()=>{
  
    

    //reset the context back to default
    context.setTransform(1,0,0,1,0,0)
      //clears everythig drawn before
    context.clearRect(0,0,canvas.width,canvas.height)
    
    //vclamp the vw port to player location
    const camX=-player.locX+canvas.width/2;
    const camY=-player.locY+ canvas.height/2;
    //moves canvas
    context.translate(camX, camY)
   
   players.forEach(p=>{
    if(!p.playerData){
        return;}
    context.beginPath()
    context.fillStyle=p.playerData.color
    context.arc(p.playerData.locX,p.playerData.locY,p.playerData.radius,0,2*Math.PI)
 //    context.arc(200,200,10,0,2*Math.PI)
    //context.arc(x, y, r, sAngle, eAngle, counterclockwise)
    //x=The x-coordinate of the center of the circle
    //y=The y-coordinate of the center of the circle
    //r=The radius of the circle
    //sAngle=The starting angle of the arc, measured in radians 
    //eAngle=The ending angle of the arc, measured in radians  PI=90 ,2*Pi=180
    //counterclockwise=If true, the arc is drawn counterclockwise, otherwise, it is drawn clockwise.
    context.fill();
    context.lineWidth =3//how wide to draw the line
    context.strokeStyle=p.playerData.color
    context.stroke();//border
   })
  

   
   
   
   //draw inital 500 orbs on canvas
   //console.log(orbs)
   orbs.forEach(orb=>{
    context.beginPath()
    context.fillStyle=orb.color
    context.arc(orb.locX,orb.locY,orb.radius,0,2*Math.PI)
    context.fill();

   })

   
   //requestAnimaionFrame() causes a conistent loop
   //called recusively ,every paint/frame,if framerate i 35fps ,the requestAnimationFramei s called 35 times
   requestAnimationFrame(draw)

}




canvas.addEventListener("mousemove",(event)=>{
   
    const mousePosition={
        x:event.clientX,
        y:event.clientY
    }

    const angleDeg = Math.atan2(mousePosition.y - (canvas.height/2), mousePosition.x - (canvas.width/2)) * 180 / Math.PI;
    if(angleDeg >= 0 && angleDeg < 90){
        xVector = 1 - (angleDeg/90);
        yVector = -(angleDeg/90);
        //0=3a.m for angledeg
        //90=6am
       // console.log("4th qaud")

    }

    
    else if(angleDeg >= 90 && angleDeg <= 180){
        xVector = -(angleDeg-90)/90;
        yVector = -(1 - ((angleDeg-90)/90));
        //180=9a.m for angledeg
        //90=6am
       //// console.log("3rd qaud")
    }
    else if(angleDeg >= -180 && angleDeg < -90){
        xVector = (angleDeg+90)/90;
        yVector = (1 + ((angleDeg+90)/90));
        //console.log("1st qaud")
    }
    else if(angleDeg < 0 && angleDeg >= -90){
        xVector = (angleDeg+90)/90;
        yVector = (1 - ((angleDeg+90)/90));
        //console.log("2nd qaud")
    }

    //speed with which player moves
    speed = 10
    xV = xVector;
    yV = yVector;

    if((player.locX < 5 && xV < 0) || (player.locX > 500) && (xV > 0)){
        player.locY -= speed * yV;
        //if wants to go in y axis up inv the grid,no x movement
    }else if((player.locY < 5 && yV > 0) || (player.locY > 500) && (yV < 0)){
        player.locX += speed * xV;
         //if wants to go in x axis up inv the grid,no y movement if the stmts are satisfi\ed
    }else{
        player.locX += speed * xV;
        player.locY -= speed * yV;
         //move on the same screen

    }   
    //local player
    player.xVector= xVector? xVector: .1;
    player.yVector= yVector? yVector: .1;
    //console.log(player)


})