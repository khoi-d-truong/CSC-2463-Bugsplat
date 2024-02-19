let ladybugs;
let splatCount;
let gameTime = 30;
let finishedPlaying = false;
let splatMulti =1;

function preload()
{
  ladybugs = [];
  for (let i = 0; i < 15; i++)
    ladybugs[i] = new bugSprite(random(20,380),random(20,380));

}


function setup() 
{
  createCanvas(700, 400);
  splatCount =0;
  splatMulti =3;
}

function draw() 
{
  background(250);
  push()
  fill(color('white'));
  strokeWeight(4);
  square(1,1,396);
  pop()

  if (finishedPlaying)
  {
    gameOver();
  }
  else
  {
    playGame();
  }
}

function playGame()
{
  for (let i = 0; i < ladybugs.length; i++)
  {
    if (ladybugs[i].facing == 'left' && ladybugs[i].sprite.x <16) ladybugs[i].turnAround();
    else if (ladybugs[i].facing == 'right' && ladybugs[i].sprite.x > 400-16) ladybugs[i].turnAround();
    else if (ladybugs[i].facing == 'up' && ladybugs[i].sprite.y <16) ladybugs[i].turnAround();
    else if (ladybugs[i].facing == 'down' && ladybugs[i].sprite.y > 400-16) ladybugs[i].turnAround();
  }  

textSize(20);
text ("Time Left : " + ceil(gameTime), 500,60);
text ("Bugs Splat : " + splatCount, 500,80);

  gameTime -= deltaTime /1000;
  if (gameTime <= 0) 
    finishedPlaying = true;
}


function gameOver()
{
  background(250);
  for (let i = ladybugs.length-1; i > 0; i--)
    ladybugs[i].erase();
  push()
  textSize(32);
  text("GAME OVER", 200 ,height/2);
  text("You killed " + splatCount + " bugs!", 200, height/2 + 40);
  textAlign(center);
  pop()
}

class bugSprite 
{
  constructor (x,y)
  {
    this.alive = true;
    
    this.sprite = new Sprite(x,y,32,32);
    this.sprite.collider = "none";
    this.sprite.spriteSheet = 'assets/ladybug sprite.png';
    let animations =
      {
        fly: { row:0, frames: 5},
        splat: { row:0, col: 5, frames: 1}
      };

  this.sprite.anis.frameDelay = 6;
  this.sprite.addAnis (animations);
  this.sprite.changeAni('fly');
  this.sprite.ani.scale = 2;
  this.randomDirection();
  }

  erase ()
  {
    this.sprite.remove();
  }

  isClicked(x,y)
  {
    return (x >= this.sprite.x-16 && x <= this.sprite.x+16) &&
            (y >= this.sprite.y-16 && y <= this.sprite.y+16);
  }

  flyUp()
  {
    this.sprite.changeAni('fly');
    this.sprite.vel.x = 0;
    this.sprite.vel.y = -1 * splatMulti ;
    this.sprite.scale.y = 1;
  }

  flyDown()
  {
    this.sprite.changeAni('fly');
    this.sprite.vel.x = 0;
    this.sprite.vel.y = 1 * splatMulti ;
    this.sprite.scale.y = -1;
  }

  flyRight()
  {
    this.sprite.changeAni('fly');
    this.sprite.rotation = 90;
    this.sprite.vel.x = 1 * splatMulti;
    this.sprite.vel.y = 0;
    this.sprite.scale.x = 1;
  }

  flyLeft()
  {
    this.sprite.changeAni('fly');
    this.sprite.rotation = -90;
    this.sprite.vel.x = -1 * splatMulti;
    this.sprite.vel.y = 0;
    this.sprite.scale.x = -1;
  }

  getSplat()
  {
    this.sprite.ani.scale = 2;
    this.sprite.changeAni('splat');
    this.alive = false;
    this.sprite.vel.x = 0;
    this.sprite.vel.y = 0;
    
  }

  randomDirection()
  {
    switch (ceil(random(0,4)))
    {
      case 1:
        this.facing = 'up';
        this.flyUp();
        break;
      case 2:
        this.facing = 'down';
        this.flyDown();
        break;
      case 3:
        this.facing = 'left';
        this.flyLeft();
        break;
      case 4:
        this.facing = 'right';
        this.flyRight();
        break;
    }
  }

  turnAround()
  {
    switch (this.facing) 
    {
      case 'up':
        this.facing = 'down';
        this.flyDown();
        break;
      case 'down':
        this.facing = 'up';
        this.flyUp();
        break;
      case 'left':
        this.facing = 'right';
        this.flyRight();
        break;
      case 'right':
        this.facing = 'left';
        this.flyLeft();
        break;
    }


  }
}

function mouseClicked()
{
  for (let i=0; i < ladybugs.length; i++)
  {
    if (ladybugs[i].isClicked(mouseX,mouseY) && ladybugs[i].alive)
    {
      ladybugs[i].getSplat();
      splatCount++;
      splatMulti += 3;
    }
  }
}