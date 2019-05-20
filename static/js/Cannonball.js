class Cannonball {
    static DESPAWNTIME = false
    static TIME = 0.5
    static SPAWNED_CANNONBALLS = []
    constructor() {
        var geometry = new THREE.SphereGeometry(22, 8, 8);
        var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        var materialWireframe = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
        this.mesh = new THREE.Mesh(geometry, material)

        this.mesh.add(new THREE.Mesh(geometry, materialWireframe))

        this.flying = false

        // this.mesh.add(new THREE.AxesHelper(100))
    }
    addTo(parent) {
        parent.add(this.mesh)
    }
    get position() {
        return this.mesh.position
    }
    get rotation() {
        return this.mesh.rotation
    }
    fly(angle, direction, velocity, weight) {
        return new Promise(res => {
            this.gravity = weight != undefined ? weight : 9.81
            this.velocity = velocity ? velocity : 100
            this.angle = angle
            this.direction = direction
            this.flying = 0.01
            console.log(this);

            this.startPos = this.position.clone()

            var keepFlying = () => {
                if (this.flying !== false) {
                    this.position.x = this.startPos.x + this.velocity * this.flying * Math.cos(this.angle) * Math.sin(this.direction)
                    this.position.y = this.startPos.y + this.velocity * this.flying * Math.sin(this.angle) - ((this.gravity * this.flying * this.flying) / 2)
                    this.position.z = this.startPos.z + this.velocity * this.flying * Math.cos(this.angle) * Math.cos(this.direction)
                    this.flying += Cannonball.TIME
                    if (this.position.y <= 22) {
                        this.flying = false
                    }
                    requestAnimationFrame(keepFlying)
                }
                else {
                    res(this.position)
                    if (Cannonball.DESPAWNTIME !== false) { // only despawn inf despawntime is set
                        setTimeout(() => {
                            this.mesh.parent.remove(this.mesh)
                        }, Cannonball.DESPAWNTIME)
                    }
                    else { // if dispawn is disabled
                        Cannonball.SPAWNED_CANNONBALLS.push(this)
                    }
                }
            }
            keepFlying()
        })
    }
    aim(angle, direction, velocity, weight) { //calcualtes where ball will land
        return new Promise(async res => { // async so while() wont freeze code
            let startPos = this.position.clone()
            var i = 0.01
            var y
            // var goBackward = false
            // do {
            //     if (goBackward) i = i - 0.1
            //     else {
            //         if (y > 0) i = i + 2 // if above ground go forward fast
            //         if (y < 0) goBackward = true// if below ground go backward slow
            //     }
            //     y = startPos.y + velocity * i * Math.sin(angle) - ((weight * i * i) / 2)
            //     // console.log(y);
            // } while (y > 30 || y < 20)

            do {
                i += Cannonball.TIME > 0 ? Cannonball.TIME : 0.05
                y = startPos.y + velocity * i * Math.sin(angle) - ((weight * i * i) / 2)
            } while (y > 22)

            var x = startPos.x + velocity * i * Math.cos(angle) * Math.sin(direction)
            var z = startPos.z + velocity * i * Math.cos(angle) * Math.cos(direction)

            res({ x: x, y: y, z: z })
        })
    }

}