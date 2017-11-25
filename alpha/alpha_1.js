
var rayon = 100

function Ball() {
    this.l = createVector(random(width/2+10, width/2-10), random(height/2+10, height/2-10))
    this.v = createVector(0,0)
    this.a = createVector(0,0)
    this.state = "alive"
    this.bom = 1

    this.move = function() {
            var vtemp = 0
            var ltemp = 0
            k = 1
            this.dir = createVector(random(-10,10), random(-10,10))
            this.dir.normalize()
            this.dir.mult(0.05)
            this.a = createVector(width/2, height/2).sub(this.l)
            this.a.normalize()
            if ((Math.sqrt(Math.pow(((width/2)-this.l.x), 2) + Math.pow(((height/2)-this.l.y), 2))-rayon) < 0)
                this.a.mult((Math.sqrt(Math.pow(((width/2)-this.l.x), 2) + Math.pow(((height/2)-this.l.y), 2))-rayon)/10000)
            else
                this.a.mult((Math.sqrt(Math.pow(((width/2)-this.l.x), 2) + Math.pow(((height/2)-this.l.y), 2))-rayon)/10000)
            this.v.add(this.a)
            this.v.add(this.dir)
                this.before=this.l.copy()
                this.l.add(this.v)
                line(this.l.x,this.l.y,this.before.x,this.before.y)

                if (Math.sqrt(Math.pow(((width/2)-this.l.x), 2) + Math.pow(((height/2)-this.l.y), 2)) > rayon) {
                    console.log("stop")
                    this.state = "bam"
                }

            if (this.state == "bam") this.bom ++
            if (this.bom > 50) this.state = "stop"
        }
}

var nbParticules = 300

function setup() {


  stroke(0,0,0,40)
  var canvas = createCanvas(windowWidth,windowHeight)
  background(255)
  balls = new Array(nbParticules);
  for(i=0;i<nbParticules; i++) {
      balls[i] = new Ball()
  }
}

function draw() {
background(255,255,255,10)
for(i=0; i<nbParticules; i++) {
      if (balls[i].state != "stop")
        balls[i].move()
  }
}
