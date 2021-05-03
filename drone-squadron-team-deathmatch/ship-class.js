var shipClass = {
  id: -1,
  kills: 0,
  position: null,
  velocity: null,
  thrust: null,
  thrusting: false,
  thrustPower: 0,
  speed: 0.1,
  turningSpeed: 1,
  angle: 0,
  direction: 'left',
  colour: '#ff00ff',
  darkColour: '#ff00ff',
  friction: 1,

  create: function (x, y, speed, turningSpeed) {
    var obj = Object.create(this)
    obj.position = vector.create(x, y)
    obj.velocity = vector.create(0, 0)
    obj.velocity.setLength(0)
    obj.velocity.setAngle(Math.random() * Math.PI)
    obj.speed = speed
    obj.turningSpeed = turningSpeed
    return obj
  },

  accelerate: function (accel) {
    this.velocity.addTo(accel)
  },

  angleToPredictedLocation: function (ship) {
    var ghostShip = vector.create(this.position.getX(), this.position.getY())
    ghostShip.setLength(this.position.getLength())
    ghostShip.setAngle(this.position.getAngle())
    this.velocity.multiplyBy(this.friction)
    this.setThrust()
    ghostShip.addTo(this.thrust)
    return Math.atan2(
        ghostShip.getY() - ship.position.getY(),
        ghostShip.getX() - ship.position.getX()
    )
  },

  setThrust: function () {
    this.thrust = vector.create(0, 0)
    if (this.isThrusting()) {
      this.thrust.setLength(this.speed * this.thrustPower)
    } else {
      this.thrust.setLength(0)
    }
    this.thrust.setAngle(this.angle)
  },

  update: function () {
    this.velocity.multiplyBy(this.friction)
    this.position.addTo(this.velocity)
    this.setThrust()
    this.accelerate(this.thrust)
  },

  draw: function (context, isDarkMode) {
    context.translate(this.position.getX(), this.position.getY())
    context.rotate(this.angle)
    context.beginPath()
    context.moveTo(10, 0)
    context.lineTo(-10, -7)
    context.lineTo(-10, 7)
    context.lineTo(10, 0)
    if (this.thrusting) {
      context.moveTo(-10, 0)
      context.lineTo(-15, 0)
    }
    context.strokeStyle = isDarkMode ? this.darkColour : this.colour
    context.stroke()
    context.fillStyle = isDarkMode ? this.darkColour : this.colour
    context.fill()
    context.font = '11px Verdana'
    context.fillText(this.kills, -12, -12)
    context.fillStyle = '#000'
    context.fillText(this.id, -7, 5)
  },

  angleTo: function (p2) {
    return Math.atan2(
        p2.position.getY() - this.position.getY(),
        p2.position.getX() - this.position.getX()
    )
  },

  distanceTo: function (p2) {
    var dx = p2.position.getX() - this.position.getX(),
        dy = p2.position.getY() - this.position.getY()
    return Math.sqrt(dx * dx + dy * dy)
  },

  incrementAngle: function (increment) {
    this.angle += increment
  },

  startThrusting: function (thrustPower) {
    this.thrustPower = thrustPower
    this.thrusting = true
  },

  stopThrusting: function () {
    this.thrustPower = 0
    this.thrusting = false
  },

  isThrusting: function () {
    return this.thrusting
  },

  turnLeft: function (turnSpeed) {
    var turn = turnSpeed * this.turningSpeed
    this.incrementAngle(-turn)
  },

  turnRight: function (turnSpeed) {
    var turn = turnSpeed * this.turningSpeed
    this.incrementAngle(turn)
  },

  stopTurning: function () {
    this.turning = false
  },

  isTurning: function () {
    return this.turning
  },
}
