
var particles = []

function Particle(dir, location) {
    this.location = location.copy()
    this.ddir = random(0,1)
    this.velocity = createVector(random(2*dir.x-this.ddir,2*dir.x+this.ddir), random(2*dir.y-this.ddir, 2*dir.y+this.ddir))
    this.acceleration = createVector(0,0)
    this.lifespan = 10.0
    this.grown = false

    this.run = function() {
        this.update()
        this.display()
        this.acceleration.mult(0)
    }

    this.display = function() {
        push()
        translate(this.location.x, this.location.y)
        var fonce = random(0,this.lifespan)
        stroke(255-fonce/2,random(0,255)-fonce/2,random(0,255)-fonce/2, this.lifespan)
        fill(255-fonce/2,random(0,255)-fonce/2,random(0,255)-fonce/2, this.lifespan)
        ellipse(0,0, fonce/100, fonce/100)
        pop()
    }

    this.update = function() {
        this.velocity.add(this.acceleration)
        this.location.add(this.velocity)
        if (this.grown) {
            this.lifespan -= 5.0
        } else {
            this.lifespan += 100.0
            if (this.lifespan >= 255.0) {
                this.grown = true
                this.lifespan = 255.0
            }
        }
    }

    this.isDead = function() { return this.lifespan < 0.0 }
}


function Voiture() {
    this.l = createVector(random(width), random(height))
    this.v = createVector(0,0)
    this.a = createVector(0,0)
    this.r = 0
    this.ar = 0

    this.applyForce = function(force) {
        myforce = p5.Vector.div(force, 1)
        this.a.add(myforce)
    }

    this.move = function() {
        friction = this.v.copy()
        friction.normalize()
        friction.mult(-0.05)
        this.applyForce(friction)
        this.v.add(this.a)
        //this.v.limit(15)
        this.l.add(this.v)
        this.r += this.ar
        this.ar *= 0.9
    }

    this.avance = function() {
        this.applyForce(createVector(cos(this.r), sin(this.r)).div(10))
        //console.log("avance! cos:"+cos(this.r)+", sin:"+sin(this.r))

    }

    this.display = function() {
        push()
        rectMode(CENTER)
        translate(this.l.x, this.l.y)
        rotate(this.r)
        noStroke()
        fill(0)
        triangle(0,-10,0,10,30,0)
        rect(-2,-5,5,5)
        rect(-2,5,5,5)
        pop()
    }


    this.checkEdges = function() {
        if (this.l.y >= height-30) {
            this.v.y *= -1
            this.l.y = height-30
        } else if (this.l.x >= width-30) {
            this.v.x *= -1
            this.l.x = width-30
        } else if (this.l.x <= 30) {
            this.v.x *= -1
            this.l.x = 30
        } else if (this.l.y <= 30) {
            this.v.y *= -1
            this.l.y = 30
        }
    }
}


function setup() {
    var canvas = createCanvas(windowWidth,windowHeight)
    background(255)
    voiture = new Voiture()
}
var maxv = 0
function draw() {
    background(255)
    voiture.checkEdges()
    voiture.move()
    if (voiture.a.mag() > 0.05)
        for(i=0; i<2; i++)
            particles.push(new Particle(voiture.a,voiture.l))
    for (i=particles.length-1; i>-1; i--) {
        particles[i].run()
        if (particles[i].isDead()) {
            particles.splice(i, 1)
        }
    }
    voiture.display()
    vitesse = int(voiture.v.mag()*12)
    document.getElementById('score').innerHTML = vitesse
    if (vitesse > maxv) {
        maxv = vitesse
        document.getElementById('record').innerHTML = maxv
    }

    voiture.a.mult(0)
    if (keyIsDown(LEFT_ARROW))
      voiture.ar-=0.03
    if (keyIsDown(RIGHT_ARROW))
      voiture.ar+=0.03
    if (keyIsDown(UP_ARROW))
      voiture.avance()

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
