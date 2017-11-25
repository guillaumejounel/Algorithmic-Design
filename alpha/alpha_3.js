function Vehicle(x, y) {
    this.location = createVector(x,y)
    this.plocation = createVector(0,0)
    this.velocity = createVector(0,0)
    this.acceleration = createVector(0,0)
    this.r = 3.0
    this.maxspeed = 50
    this.color = 0

    // Our standard “Euler integration” motion model
    this.update = function() {
        this.plocation = this.location.copy()
        this.velocity.add(this.acceleration)
        this.velocity.limit(this.maxspeed)
        this.location.add(this.velocity)
        this.acceleration.mult(0)

        stroke(30,190,255,150)
        line(this.location.x,this.location.y,this.plocation.x,this.plocation.y)
    }

    // Newton’s second law; we could divide by mass if we wanted.
    this.applyForce = function(force) {
        this.acceleration.add(force)
    }

    // Our seek steering force algorithm
    this.seek = function(target) {
        desired = p5.Vector.sub(target.location,this.location)
        desired.normalize()
        desired.mult(this.maxspeed)
        steer = p5.Vector.sub(desired,this.velocity)
        steer.normalize()
        steer.mult(target.force)
        this.applyForce(steer)
    }

    this.display = function() {
        // Vehicle is a triangle pointing in
        // the direction of velocity; since it is drawn
        // pointing up, we rotate it an additional 90 degrees.
        ellipse(this.location.x, this.location.y, 1,1)
    }

}

function Attractor(a, r) {
    this.alpha = a
    this.r = r
    this.location = createVector(width/2 + r*cos(a), height/2 + r*sin(a))
    this.force = 1

    this.update = function(step) {
        this.alpha += step
        this.location.x = width/2 + this.r*cos(this.alpha)
        this.location.y = height/2 + this.r*sin(this.alpha)
    }

    this.display = function() {
        ellipse(this.location.x, this.location.y, 1, 1)
    }
}

function distance(vehicule, circle) {
    return p5.Vector.sub(vehicule, circle).magSq()
}

function setup() {
    var canvas = createCanvas(windowWidth,windowHeight)
    background(0)

    radius = 200;
    state = 0
    step = 0.001
    nbAttractors = 30
    nbVehicules = 3000

    vehicle = new Array(nbVehicules);
    for(i=0; i<nbVehicules; i++) {
        posRandom = random(map(noise(i), 0, 1, 0, TWO_PI))
        delta = 100
        vehicle[i] = new Vehicle(width/2 + radius*1.1*cos(posRandom), height/2 + radius*1.1*sin(posRandom))
    }

    attractor = new Array(nbAttractors)
    angle = 0
    for (i=0; i<nbAttractors; i++) {
        attractor[i] = new Attractor(angle,radius)
        angle += (PI/(nbAttractors/2))
    }
    center = createVector(width/2, height/2)
}

function draw() {

    state += 1

    background(0,0,0,10)
    if (state > 100) {
        for(i=0; i<nbAttractors; i++) {
            attractor[i].force = map(noise(attractor[i].alpha*100), 0, 1, -1, 3)
            attractor[i].update(step)
            // attractor[i].display()
            for (j=0; j<nbVehicules; j++) {
                if (pow(vehicle[j].location.x - width/2,2) + pow(vehicle[j].location.y - height/2,2) > 40000)
                if ( distance(attractor[i].location, vehicle[j].location) < 35000) {
                    // Display attracted attractor
                    // ellipse(attractor[i].location.x, attractor[i].location.y,5,5)
                    vehicle[j].seek(attractor[i])
                }
            }
        }
        for(i=0; i<nbVehicules; i++) {
            vehicle[i].update()
            // vehicle[i].display()
        }
    } else if (state == 1000) {
        save()
    }

}
