//player info that everyone knows  about each othetr

class PlayerData{

    constructor(playerName,settings){
        this.name=playerName;
        this.locX=Math.floor(settings.worldWidth * Math.random())
        this.locY=Math.floor(settings. worldHeight  *  Math.random())
        this.radius=settings.defaultSize
        this.color=this.getRandomColor();
        this.score=0;
        this.orbsAbsorbed=0;
        this.playerAbsorbed=0;

    }
    getRandomColor(){
        let r=Math.floor(Math.random()*255)
        let g=Math.floor(Math.random()*255)
        let b=Math.floor(Math.random()*255)
        return `rgb(${r},${g},${b})`
    }
}
module.exports=PlayerData;