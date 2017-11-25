function Vehicle(x, y) {
    this.location = createVector(x,y)
    this.plocation = createVector(0,0)
    this.velocity = createVector(0,0)
    this.acceleration = createVector(0,0)
    this.r = 3.0
    this.maxspeed = 1
    this.maxforce = 6

    // Our standard “Euler integration” motion model
    this.update = function() {
        this.plocation = this.location.copy()
        this.velocity.add(this.acceleration)
        this.velocity.limit(this.maxspeed)
        this.location.add(this.velocity)
        this.acceleration.mult(0)
        line(this.location.x,this.location.y,this.plocation.x,this.plocation.y)
    }

    // Newton’s second law; we could divide by mass if we wanted.
    this.applyForce = function(force) {
        this.acceleration.add(force)
    }

    // Newton’s second law; we could divide by mass if we wanted.
    this.expulsion = function() {
        direction = p5.Vector.sub(this.location, createVector(width/2,height/2))

        direction.div(0.00000000001)
        // console.log(direction.mag())
        direction.limit(100)
        this.acceleration.add(direction)
    }

    // Our seek steering force algorithm
    this.seek = function(target) {
        desired = p5.Vector.sub(target,this.location)
        desired.normalize()
        desired.mult(this.maxspeed)
        steer = p5.Vector.sub(desired,this.velocity)
        steer.limit(this.maxforce)
        this.applyForce(steer)
    }

    this.display = function() {
        // Vehicle is a triangle pointing in
        // the direction of velocity; since it is drawn
        // pointing up, we rotate it an additional 90 degrees.
        // ellipse(this.location.x, this.location.y, 10,10)
    }

}

function distance(vehicule, circle) {
    return p5.Vector.sub(vehicule.location, circle).magSq()
}

function setup() {
    var canvas = createCanvas(windowWidth,windowHeight)
  r = 200;
  background(0)



  init = 0
  state = 0
  stepTurn = 0.01
  numberPoints = 15
  nbVehicules = 1000

  vehicle = new Array(nbVehicules);
  for(i=0;i<nbVehicules; i++) {
      vehicle[i] = new Vehicle(width/2 + random(-100,100), height/2 + random(-100,100))
  }
}

function draw() {
    stroke(255,170,255,10)
    if (state == 2000) save()
    state += 1
    console.log(state)
    // background(0,0,0,20)
    init+=stepTurn
    for (i = init; i < init+2*PI; i+= (PI/(numberPoints/2))) {
        // ellipse(width/2+r*cos(i),height/2+r*sin(i),1,1)
        for(j=0;j<nbVehicules; j++) {
            vehicle[j].expulsion()
            if (distance(vehicle[j], createVector(width/2+r*cos(i),height/2+r*sin(i))) < 15000) {
                // ellipse(width/2+r*cos(i),height/2+r*sin(i),3,3)
                vehicle[j].seek(createVector(width/2+r*cos(i),height/2+r*sin(i)))
            }
            vehicle[j].update()
            vehicle[j].display()
        }
   }


}
