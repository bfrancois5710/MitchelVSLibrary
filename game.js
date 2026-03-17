
const canvas=document.getElementById("game")
const ctx=canvas.getContext("2d")

canvas.width=window.innerWidth
canvas.height=420

const playerImg = new Image()
playerImg.src = "player.png"

const bookImg = new Image()
bookImg.src = "book.png"

const paperImg = new Image()
paperImg.src = "paper.png"

const scissorsImg = new Image()
scissorsImg.src = "scissors.png"

const chairImg = new Image()
chairImg.src = "chair.png"

let running=false
let score=0
let speed=6

const jumpSound=new Audio("jump.wav")
const hitSound=new Audio("hit.wav")
const gameoverSound=new Audio( "gameover.wav")

const player={x:120,y:300,w:96,h:96,vy:0,jumping:false}

let obstacles=[]

function spawn(){
const types=["book","paper","scissors","chair"]
const t=types[Math.floor(Math.random()*types.length)]
obstacles.push({x:canvas.width+50,y:310,w:40,h:40,type:t})
}

setInterval(()=>{if(running)spawn()},1400)

function jump(){
if(!player.jumping){
player.vy=-19
player.jumping=true
jumpSound.currentTime=0
jumpSound.play()
}
}

document.addEventListener("keydown",e=>{if(e.code==="Space")jump()})
canvas.addEventListener("touchstart",jump)

function update(){

player.y+=player.vy
player.vy+=0.9

if(player.y>=300){
player.y=300
player.jumping=false
}

obstacles.forEach(o=>o.x-=speed)
obstacles=obstacles.filter(o=>o.x>-50)

obstacles.forEach(o=>{
if(player.x<o.x+o.w&&player.x+player.w>o.x&&player.y<o.y+o.h&&player.y+player.h>o.y){
hitSound.play()
gameOver()
}
})

score++
if(score%500===0)speed+=0.5
}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height)

ctx.fillStyle="#444"
ctx.fillRect(0,350,canvas.width,70)

ctx.fillStyle="#00ffd0"
ctx.drawImage(playerImg,player.x,player.y,player.w,player.h)
obstacles.forEach(o=>{

if(o.type==="book")ctx.fillStyle="red"
if(o.type==="paper")ctx.fillStyle="white"
if(o.type==="scissors")ctx.fillStyle="yellow"
if(o.type==="chair")ctx.fillStyle="orange"

let img

if(o.type==="book") img = bookImg
if(o.type==="paper") img = paperImg
if(o.type==="scissors") img = scissorsImg
if(o.type==="chair") img = chairImg

ctx.drawImage(img,o.x,o.y,o.w,o.h)

})

ctx.fillStyle="white"
ctx.font="20px Arial"
ctx.fillText("Score "+score,20,30)

}

function loop(){
if(!running)return
update()
draw()
requestAnimationFrame(loop)
}

function gameOver(){
running=false
gameoverSound.play()
document.getElementById("gameover").style.display="block"
document.getElementById("score").innerText="Score : "+score
}

document.getElementById("start").onclick=()=>{
document.getElementById("menu").style.display="none"
running=true
loop()
}
