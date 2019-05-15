class Cannon {
    constructor() {
        this.group = new THREE.Group // Object3D
        this.wheels = new THREE.Group
        this.group.add(this.wheels)


        var barrelGeometry = new THREE.CylinderGeometry(25, 25, 150, 8, 8);
        var barrelMaterial = new THREE.MeshBasicMaterial({ color: 0x4286f4 });
        this.barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
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

        this.wheels.add(wheel1)
        this.wheels.add(wheel2)

        this.group.position.y = 50

        this.ball = false
    }
    addTo(parent) {
        parent.add(this.group)
    }
    rotateCannon(deg) {
        this.group.rotation.y = deg * π / 180
        this.setBallPosition()
    }
    rotateBarrel(deg) {
        this.barrel.rotation.z = deg * π / 180
        this.setBallPosition()
        console.log('rotation:' + this.barrel.rotation.z);
    }
    get position() {
        return this.group.position
    }
    async fire() {
        if (this.ball) {
            this.ball.fly(π / 2 - this.barrel.rotation.z).then(() => {
                setTimeout(() => {
                    this.load()
                }, 1000)
            })
            this.ball = false
        }
    }
    load() {
        var ball = new Ball()
        this.ball = ball
        ball.addTo(this.group.parent)

        this.setBallPosition()
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
        }
    }
}