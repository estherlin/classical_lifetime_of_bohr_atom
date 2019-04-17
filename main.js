$(document).ready(function () {

    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
        document.getElementById('container').innerHTML = "";
    }

    /* global variables */
    var container;
    var camera, scene, renderer, stats;
    var electron;
    var initTime = Date.now()*0.0001;

    // Start the simulation
    init();
    animate();

    /*
     * Creates the scene by assigning scene, camera and renderer
     * Also creates all elements of the simulation
     */
    function init() {

        // Initialize the container
        var container = document.getElementById( 'container' );
        stats = new Stats();
        container.appendChild( stats.dom );

        // Initialize the scene
        scene = new THREE.Scene();

        // Create the setting: bulb, floor
        createSetting();

        // Initialize the renderer
        renderer = new THREE.WebGLRenderer();
        renderer.physicallyCorrectLights = true;
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        renderer.toneMapping = THREE.ReinhardToneMapping;
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );
        var controls = new THREE.OrbitControls( camera, renderer.domElement );
        window.addEventListener( 'resize', onWindowResize, false );

        // Add controls interface
        initGui();
    }

    /*
     * Initializes and customizes the gui
     */
    function initGui() {
        var gui = new dat.GUI();
        // make a folder to hold gui parameters
        var folder = gui.addFolder( 'Simulation Parameters' );
        var buttonRestart = {
            restartSimulation: function () {restartSimulation();}
        };
        folder.add( buttonRestart, 'restartSimulation' );
        folder.open();
        gui.open();
    }

    /*
     * Renders the animation
     */
    function animate() {
        timestamp = Date.now()*0.0001;
        var time = timestamp - initTime;
        requestAnimationFrame( animate );
        //electron.position.x = 8*Math.exp(-0.1*(time))*Math.sin(time*2*Math.PI);
        //electron.position.z = 8*Math.exp(-0.1*(time))*Math.cos(time*2*Math.PI);
        if ((1-time*time*time) >= 0) {
            electron.position.z = 8*(1-time*time*time)*Math.cos(time*4*Math.PI);
            electron.position.x = 8*(1-time*time*time)*Math.sin(time*4*Math.PI);
        } else {
            electron.position.z = 0;
            electron.position.x = 0;
        }

		render();
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    function createSetting() {
        // Initialize the camera and its perspective
        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 100 );
        camera.position.x = 0;
        camera.position.z = 0;
        camera.position.y = 20;

        // Add the floor for this simulation
        var size = 16;
        var divisions = 40;
        var gridHelper = new THREE.GridHelper( size, divisions );
        scene.add( gridHelper );

        // Add proton
        var geometry = new THREE.SphereGeometry( 0.25, 32, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0x63DFEC} );
        var proton = new THREE.Mesh( geometry, material );
        scene.add( proton );

        // Add electron
        var geometry = new THREE.SphereGeometry( 0.125, 32, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0xEC7063} );
        electron = new THREE.Mesh( geometry, material );
        scene.add( electron );
        electron.position.set( 0, 0, -8 );
    }

    function restartSimulation() {
        initTime = Date.now()*0.0001;
        electron.position.set( 0, 0, -8 );
    }

    /*
     * Render lighting of the simulation
     */
	function render() {
		renderer.render( scene, camera );
		stats.update();
	}
});
