
const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = 420

let running = false
let score = 0
let speed = 6

const jumpSound = new Audio("audio/jump.wav")
const hitSound = new Audio("audio/hit.wav")
const gameoverSound = new Audio("audio/gameover.wav")

const bg = new Image()
bg.src = "library"

const playerImg = new Image()
playerImg.src = "player"

const bookImg = new Image()
bookImg.src = "book"

const paperImg = new Image()
paperImg.src = "paper"

const scissorsImg = new Image()
scissorsImg.src = "scissors"

const chairImg = new Image()
chairImg.src = "chair"

const player = {
x:120,
y:260,
w:96,
h:96,
vy:0,
jumping:false
}

let obstacles = []

function spawn(){

const types=["book","paper","scissors","chair"]
const type = types[Math.floor(Math.random()*types.length)]

obstacles.push({
x:canvas.width+50,
y:300,
w:60,
h:60,
type:type
})

}

setInterval(()=>{
if(running) spawn()
},1400)

let lastJump = 0

function jump(){

const now = Date.now()

if(!player.jumping && now-lastJump>150){

player.vy = -16
player.jumping = true

jumpSound.currentTime = 0
jumpSound.play()

lastJump = now

}

}

document.addEventListener("keydown",e=>{
if(e.code==="Space") jump()
})

if('ontouchstart' in window){
canvas.addEventListener("touchstart",e=>{
e.preventDefault()
jump()
},{passive:false})
}

function update(){

player.y += player.vy
player.vy += 0.9

if(player.y>=260){
player.y=260
player.jumping=false
}

obstacles.forEach(o=>o.x -= speed)
obstacles = obstacles.filter(o=>o.x>-100)

obstacles.forEach(o=>{

if(
player.x < o.x + o.w &&
player.x + player.w > o.x &&
player.y < o.y + o.h &&
player.y + player.h > o.y
){

hitSound.play()
gameOver()

}

})

score++

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height)

ctx.drawImage(bg,0,0,canvas.width,canvas.height)

ctx.fillStyle="#444"
ctx.fillRect(0,360,canvas.width,60)

ctx.drawImage(playerImg,player.x,player.y,player.w,player.h)

obstacles.forEach(o=>{

let img

if(o.type==="book") img=bookImg
if(o.type==="paper") img=paperImg
if(o.type==="scissors") img=scissorsImg
if(o.type==="chair") img=chairImg

ctx.drawImage(img,o.x,o.y,o.w,o.h)

})

ctx.fillStyle="white"
ctx.font="20px Arial"
ctx.fillText("Score "+score,20,30)

}

function loop(){

if(!running) return

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
