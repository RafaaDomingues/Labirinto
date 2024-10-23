function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}
let player;
let ghosts = [];
let points = [];
let mazeWidth = 800;
let mazeHeight = 600;
let score = 0;
let maze;

function setup() {
  createCanvas(mazeWidth, mazeHeight);
  player = new Player(50, 50);
  
  // Criar fantasmas
  ghosts.push(new Ghost(200, 200));
  ghosts.push(new Ghost(400, 400));
  
  // Criar pontos
  for (let i = 0; i < 10; i++) {
    points.push(createVector(random(50, width - 50), random(50, height - 50)));
  }
  
  // Criar o labirinto
  maze = new Maze();

}

function draw() {
  background(0);
  
  // Desenhar labirinto
  maze.show();
  
  // Desenhar pontos
  fill(255, 255, 0);
  for (let p of points) {
    ellipse(p.x, p.y, 10);
  }
  
  // Mover e mostrar jogador
  player.move();
  player.show();
  
  // Mover e mostrar fantasmas
  for (let ghost of ghosts) {
    ghost.move(player.x, player.y);
    ghost.show();
  }
  
  // Checar colisões com fantasmas
  for (let ghost of ghosts) {
    if (player.checkCollision(ghost)) {
      fill(255, 0, 0);
      textSize(32);
      text('Game Over!', width / 2 - 80, height / 2);
      noLoop(); // Para o jogo
    }
  }
  
  // Checar se o jogador coletou pontos
  for (let i = points.length - 1; i >= 0; i--) {
    if (player.collectPoint(points[i])) {
      points.splice(i, 1);
      score++;
    }
  }
  
  // Mostrar pontuação
  fill(255);
  textSize(24);
  text(`Score: ${score}`, 10, 30);
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.speed = 5;
  }
  
  move() {
    let nextX = this.x;
    let nextY = this.y;
    
    if (keyIsDown(LEFT_ARROW)) {
      nextX -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      nextX += this.speed;
    }
    if (keyIsDown(UP_ARROW)) {
      nextY -= this.speed;
    }
    if (keyIsDown(DOWN_ARROW)) {
      nextY += this.speed;
    }
    
    // Restrições de borda
    nextX = constrain(nextX, 0, width - this.size);
    nextY = constrain(nextY, 0, height - this.size);
    
    // Verificar colisão com o labirinto
    if (!maze.checkCollision(nextX, nextY, this.size)) {
      this.x = nextX;
      this.y = nextY;
    }
  }
  
  show() {
    fill(0, 0, 255);
    ellipse(this.x, this.y, this.size);
  }
  
  checkCollision(ghost) {
    let d = dist(this.x, this.y, ghost.x, ghost.y);
    return d < (this.size / 2 + ghost.size / 2);
  }
  
  collectPoint(point) {
    let d = dist(this.x, this.y, point.x, point.y);
    return d < (this.size / 2 + 5);
  }
}

class Ghost {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.speed = 2;
  }
  
  move(targetX, targetY) {
    if (this.x < targetX) {
      this.x += this.speed;
    } else if (this.x > targetX) {
      this.x -= this.speed;
    }
    if (this.y < targetY) {
      this.y += this.speed;
    } else if (this.y > targetY) {
      this.y -= this.speed;
    }
    
    // Restrições de borda
    this.x = constrain(this.x, 0, width - this.size);
    this.y = constrain(this.y, 0, height - this.size);
  }
  
  show() {
    fill(255, 0, 0);
    ellipse(this.x, this.y, this.size);
  }
}

class Maze {
  constructor() {
    this.walls = [];
    this.createWalls();
  }
  
  createWalls() {
    // Adiciona algumas paredes ao labirinto
    this.walls.push(new Wall(100, 100, 600, 20));
    this.walls.push(new Wall(100, 200, 20, 400));
    this.walls.push(new Wall(200, 300, 20, 200));
    this.walls.push(new Wall(200, 500, 400, 20));
    this.walls.push(new Wall(200, 205, 500, 20));
    this.walls.push(new Wall(679, 205, 20, 200));
    this.walls.push(new Wall(680, 80, 20, 20));
    this.walls.push(new Wall(200, 300, 200, 20));
    this.walls.push(new Wall(579, 300, 100, 20));
  }
    checkCollision(x, y, size) {
    for (let wall of this.walls) {
      if (wall.collide(x, y, size)) {
        return true;
      }
    }
    return false;
  }
  
  show() {
    fill(150);
    for (let wall of this.walls) {
      wall.show();
    }
  }
}

class Wall {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  
  collide(px, py, size) {
    return (px + size > this.x && 
            px < this.x + this.w && 
            py + size > this.y && 
            py < this.y + this.h);
  }
  
  show() {
    fill(100);
    rect(this.x, this.y, this.w, this.h);
  }
}
