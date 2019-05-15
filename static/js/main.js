var scene;
var renderer;
var π = Math.PI
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
        10000    // maxymalna renderowana odległość od kamery 
    );
    camera.position.set(300, 100, 300)
    camera.lookAt(scene.position)

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xffffff);
    renderer.setSize($(window).width(), $(window).height());
    //shadows
    //renderer.shadowMap.enabled = true
    //renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    $("#root").append(renderer.domElement);
    // #endregion initial

    let grid = new Grid(2500)
    grid.addTo(scene)

    var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControl.addEventListener('change', function () {
        renderer.render(scene, camera)
    });

    var axesHelper = new THREE.AxesHelper(5000);
    scene.add(axesHelper);

    var cannon = new Cannon()
    cannon.addTo(scene)
    cannon.position.y = 50

    var ball = new Ball()
    ball.addTo(scene)

    ball.fly(90)


    // #region listeneres
    $('#controls-cannon-rotation').on('input', function () {
        cannon.rotateCannon($(this).val())
    })
    $('#controls-barrel-rotation').on('input', function () {
        cannon.rotateBarrel($(this).val())
    })
    // #endregion listeneres


    function render() {
        if (ball) ball.keepFlying()

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    } render()
})