class Cannon {
    constructor() {
        this.group = new THREE.Group // Object3D
        this.wheels = new THREE.Group
        this.group.add(this.wheels)


        var barrelGeometry = new THREE.CylinderGeometry(25, 25, 200, 8, 24);
        var barrelMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        this.barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
        this.group.add(this.barrel)



        let wireframeBarrelMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
        this.barrel.add(new THREE.Mesh(barrelGeometry, wireframeBarrelMaterial))

        barrelGeometry.translate(0, 70, 0)


        var wheelGeometry = new THREE.CylinderGeometry(50, 50, 20, 16);
        var wheelMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        var wireframeWheelMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });

        let wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial)
        wheel1.add(new THREE.Mesh(wheelGeometry, wireframeWheelMaterial))
        wheel1.rotation.x = Math.PI / 2
        wheel1.position.z = 35

        let wheel2 = wheel1.clone()
        wheel2.position.z = -35

        this.wheels.add(wheel1)
        this.wheels.add(wheel2)
    }
    addTo(parent) {
        parent.add(this.group)
    }
    rotateCannon(deg) {
        this.group.rotation.y = deg * π / 180
    }
    rotateBarrel(deg) {
        this.barrel.rotation.z = deg * π / 180
    }
    get position() {
        return this.group.position
    }
}