class Cannon {
    constructor(power, cannonball_weight, autoreload) {
        this.power = power ? power : 100
        this.cannonball_weight = cannonball_weight ? cannonball_weight : 9.81
        this.autoreload = autoreload ? true : false

        this.group = new THREE.Group // Object3D
        this.wheels = new THREE.Group
        this.group.add(this.wheels)


        var barrelGeometry = new THREE.CylinderGeometry(25, 25, 150, 8, 8);
        var barrelMaterial = new THREE.MeshBasicMaterial({ color: 0x4286f4 });
        this.barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
        this.barrel.name = 'barrel'
        this.group.add(this.barrel)



        let wireframeBarrelMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
        this.barrel.add(new THREE.Mesh(barrelGeometry, wireframeBarrelMaterial))

        barrelGeometry.translate(0, 50, 0)


        var wheelGeometry = new THREE.CylinderGeometry(50, 50, 20, 16);
        var wheelMaterial = new THREE.MeshBasicMaterial({ color: 0x4286f4 });
        var wireframeWheelMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });

        let wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial)
        wheel1.add(new THREE.Mesh(wheelGeometry, wireframeWheelMaterial))
        wheel1.rotation.x = Math.PI / 2
        wheel1.position.z = 35

        let wheel2 = wheel1.clone()
        wheel2.position.z = -35

        this.wheel1 = wheel1
        this.wheel2 = wheel2

        this.wheels.add(wheel1)
        this.wheels.add(wheel2)

        this.group.position.y = 50

        this.ball = false

        this.aimAssistEnabled = false
        this.aimAssist = null

        this.followWithCamera = false

        this.camParams = {}
    }
    addTo(parent) {
        parent.add(this.group)
    }
    rotateCannon(deg) {
        this.group.rotation.y = deg * π / 180
        this.setBallPosition()

        this.wheel1.rotation.y = - deg * π / 180
        this.wheel2.rotation.y = deg * π / 180
    }
    rotateBarrel(deg) {
        this.barrel.rotation.z = deg * π / 180
        this.setBallPosition()
    }
    get position() {
        return this.group.position
    }
    get rotation() {
        return this.group.rotation
    }
    fire() {
        if (this.ball) {
            if (this.followWithCamera) {
                this.camParams = {
                    position: camera.position.clone(),
                    rotation: camera.rotation.clone(),
                }

                this.ball.mesh.add(camera)
                camera.position.set(0, 200, 1600)
                camera.lookAt(this.ball.position)

                console.log(this.camParams);
            }

            this.ball.fly(π / 2 - this.barrel.rotation.z, this.group.rotation.y - π / 2, this.power, this.cannonball_weight).then(() => {
                if (this.autoreload) this.load(this.followWithCamera)
            })
            this.ball = false
        }
    }
    load(follow) {
        if (!this.ball) {
            var ball = new Cannonball(follow)
            this.ball = ball
            ball.addTo(this.group.parent)
            this.setBallPosition()


            this.displayAimAssist()
        }
    }
    setBallPosition() {
        if (this.ball) {
            let r = 130
            let azymut = -this.group.rotation.y
            let zenit = -this.barrel.rotation.z

            let x = this.position.x + r * Math.sin(zenit) * Math.cos(azymut)
            let z = this.position.z + r * Math.sin(zenit) * Math.sin(azymut)
            let y = this.position.y + r * Math.cos(zenit)
            this.ball.position.set(x, y, z)

            this.ball.rotation.y = this.rotation.y
        }
    }
    aim() { // calcualtes where shot will land with current parameters
        if (this.ball) {
            return this.ball.aim(π / 2 - this.barrel.rotation.z, this.group.rotation.y - π / 2, this.power, this.cannonball_weight)
        }
    }
    displayAimAssist() {
        if (this.ball) {
            if (this.aimAssistEnabled) {
                console.log('here');
                if (!this.aimAssist) {
                    this.aimAssist = new THREE.Mesh(new THREE.SphereGeometry(22, 8, 8), new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true }))
                    this.group.parent.add(this.aimAssist)
                }
                this.aim().then(cords => {
                    console.log(cords);
                    let pos = new THREE.Vector3(cords.x, cords.y, cords.z)
                    this.aimAssist.position.copy(pos)
                })
            }
            else {
                if (this.aimAssist) {
                    this.aimAssist.parent.remove(this.aimAssist)
                    this.aimAssist = null
                }
            }
        }
    }
}