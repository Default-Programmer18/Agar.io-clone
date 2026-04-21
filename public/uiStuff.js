 //set width and height of canvas to window
 //client sside
 let wHeight=window.innerHeight
 let wWidth=window.innerWidth;
 const canvas=document.querySelector("#the-canvas")
 const context=canvas.getContext("2d");
 canvas.width=wWidth;
 canvas.height=wHeight;

 const player={}//this will be all things that this player will have
 let orbs=[]//global for all non player orbs
 let players=[]//this is array of all players

//modal acquiring
 const loginModal = new bootstrap.Modal(document.querySelector("#loginModal"))
 const spawnModal=new bootstrap.Modal(document.querySelector("#spawnModal"))

 //windiow onload
 window.addEventListener("load",()=>{
    loginModal.show();
   

 })

 //name input of player
 document.querySelector(".name-form").addEventListener("submit",(e)=>{
    e.preventDefault();
    player.name=document.querySelector("#name-input").value;
    loginModal.hide();
    spawnModal.show();
 })


 //play solo player after work
 document.querySelector("#play-solo-btn").addEventListener("click",(e)=>{
   spawnModal.hide(); 

   const elArray=Array.from(document.querySelectorAll(".hiddenOnStart"))
   elArray.forEach((el)=>{
       el.removeAttribute("hidden")
   })
//its in socketstuffs
 init();


 })

 document.querySelector("#join-team-btn").addEventListener("click",(e)=>{
   spawnModal.hide(); 

 })
