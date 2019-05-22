var scene;
var renderer;
var π = Math.PI //xd

$(document).ready(() => {
    // #region initial
    $(window).on("resize", () => {
        camera.aspect = $(window).width() / $(window).height()
        camera.updateProjectionMatrix()
        renderer.setSize($(window).width(), $(window).height())
    })

    scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(
        45,    // kąt patrzenia kamery (FOV - field of view)
        $(window).width() / $(window).height(),   // proporcje widoku, powinny odpowiadać proporjom naszego ekranu przeglądarki
        0.1,    // minimalna renderowana odległość
        50000    // maxymalna renderowana odległość od kamery 
    );
    camera.position.set(600, 400, 600)
    camera.lookAt(scene.position)

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xffffff);
    renderer.setSize($(window).width(), $(window).height());
    //shadows
    //renderer.shadowMap.enabled = true
    //renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    $("#root").append(renderer.domElement);
    // #endregion initial

    let grid = new Grid(10000)
    grid.addTo(scene)

    var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControl.addEventListener('change', function () {
        renderer.render(scene, camera)
    });

    var axesHelper = new THREE.AxesHelper(5000);
    scene.add(axesHelper);

    let wall = new Wall(5, 4, 50)
    wall.addTo(scene)
    wall.position.y = 25

    var raycaster = new THREE.Raycaster(); // obiekt symulujący "rzucanie" promieni
    var mouseVector = new THREE.Vector2()


    $('#root').click(() => {
        mouseVector.x = (event.clientX / $(window).width()) * 2 - 1
        mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1
        raycaster.setFromCamera(mouseVector, camera);

        var intersects = raycaster.intersectObjects(wall.blocks, true);

        if (intersects.length > 0) {
            let block = intersects[0].object
            console.log(block);
        }
    })


    function render() {

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    } render()
})