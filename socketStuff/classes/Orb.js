class Orb{
    constructor(settings){
        this.color=this.getRandomColor();
        this.locX=Math.floor(settings.worldWidth * Math.random())
        this.locY=Math.floor(settings. worldHeight  *  Math.random())
        this.radius=settings.defaultGenericOrbSize;
        }
        getRandomColor(){
            let r=Math.floor(Math.random()*255)
            let g=Math.floor(Math.random()*255)
            let b=Math.floor(Math.random()*255)
            return `rgb(${r},${g},${b})`
        }

}
module.exports=Orb;