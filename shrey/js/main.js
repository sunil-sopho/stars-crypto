//	CSS/HTML Setup
var masterContainer = document.getElementById('visualization');

//	Clear cross origin flags
THREE.ImageUtils.crossOrigin = null;

//	Graphic Settings
var maxAniso = 1;
var enableDataStar = false;
var enableSkybox = true;
var enableGalaxy = false;
var enableDust = false; // flase form start
var enableSolarSystem = false;
var enableSpacePlane = false;
var enableStarModel = true;
var enableTour = false;
var enableDirector = false;

var firstTime = localStorage ? (localStorage.getItem('first') == null) : true;

// Tour
// var tour = new Tour(GALAXY_TOUR);

var initialAutoRotate = true;

//	animation timing
var startTime = Date.now();
var clock = new THREE.Clock();
var shaderTiming = 0;

var $starName = $('#star-name');

var $iconNav = $('#icon-nav');

var $detailContainer = $('#detailContainer');
var $cssContainer = $('#css-container');

var $spectralGraph = $('#spectral-graph');

//	world transform
var rotating;
var translating;

var lastRotateY = 0;
var rotateYAccumulate = 0;

//	global objects
var starData;
var pSystem;
var pGalacticSystem;
var pDustSystem;
var earth;
var spacePlane;

var screenWhalf, screenHhalf;
var divCSSWorld, divCSSCamera;
var fovValue;

var camera;

var projector;
var raycaster;
// var glCube;

var screenWidth;
var screenHeight;

var planets = [];
var stars = [];

var gradientImage;
var gradientCanvas;

var rtparam = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBufer: false };
var rt;

var antialias = gup('antialias') == 1 ? true : false;

//	called from body onload
function start( e ){
	// detect for webgl and reject everything else
	if ( ! Detector.webgl ) {
	  if ( Detector.Chrome ) {
	    Detector.addGetWebGLMessage([
         'Your graphics card does not support WebGL. Please try again on a different Windows, Mac, or Linux computer using <a href="http://www.google.com/chrome/" style="color:#ffffff; text-decoration:underline; text-transform:capitalize">Google Chrome</a><br>',
         'or another <a href="http://www.khronos.org/webgl/wiki_1_15/index.php/Getting_a_WebGL_Implementation" style="color:#ffffff; text-decoration:underline; text-transform:none"> WebGL-Compatible browser</a>. You can watch a video preview of the experiment below:',
         '<p><iframe style="margin-top:4em;" id="trailer" width=800 height=600 src="http://www.youtube.com/embed/TU6RAjABX40" frameborder="0" allowfullscreen></iframe></p>',
       ].join( '\n' ));
	    return;
	  }
		Detector.addGetWebGLMessage();
		return;
	}

	gradientImage = document.createElement('img');
	gradientImage.onload = postStarGradientLoaded;
	gradientImage.src = 'images/star_color_modified.png';	
}

var postStarGradientLoaded = function(){
	gradientCanvas = document.createElement('canvas');
	gradientCanvas.width = gradientImage.width;
	gradientCanvas.height = gradientImage.height;
	gradientCanvas.getContext('2d').drawImage( gradientImage, 0, 0, gradientImage.width, gradientImage.height );
	gradientCanvas.getColor = function( percentage ){
		return this.getContext('2d').getImageData(0,percentage * gradientImage.height, 1, 1).data;
	}


	//	load all the shaders first before doing anything
	loadShaders( shaderList, function(e){
		//	we have the shaders loaded now...
		shaderList = e;
		 postShadersLoaded();
	});	
}

var postShadersLoaded = function(){
	if( enableDataStar ){
		loadStarData( "data/stars_all.json", function(loadedData){
			starData = loadedData.stars;
			initScene();
			animate();
		});
	}
	else{
		initScene();
		animate();
	}
};

// var controllers = {
// 	viewSize: 0.6,
// 	datastarSize: 1.0,
// 	sceneSize: 1000.0,
// 	sol: function(){ camera.position.z = 1.1; },
// 	solarsystem: function(){ camera.position.z = 18; },
// 	hipparcos: function(){ camera.position.z = 1840; },
// 	milkyway: function(){ camera.position.z = 40000; },
// };

var gui;

function buildGUI(){
	gui = new dat.GUI();
	gui.domElement.style.display = 'none';
	// gui.domElement.style.display = 'none';

	c = gui.add(controllers, 'viewSize', 0.01, 4.0 );
	c.onChange(function(v){
		camera.scale.z = v;
	});

	c = gui.add(controllers, 'datastarSize', 0.01, 10.0 );
	c = gui.add(controllers, 'sceneSize', 1, 50000);

	c = gui.add(controllers, 'sol' );
	c = gui.add(controllers, 'solarsystem' );
	c = gui.add(controllers, 'hipparcos' );
	c = gui.add(controllers, 'milkyway' );	

	// c = gui.add(camera, 'fov', 1.0, 200.0 );
	// initializeMinimap();

}


//	-----------------------------------------------------------------------------
//	All the initialization stuff for THREE
function initScene() {

	//	-----------------------------------------------------------------------------
	//	Let's make a scene
	scene = new THREE.Scene();

	scene.add( new THREE.AmbientLight( 0xffffff ) );

	rotating = new THREE.Object3D();

	galacticCentering = new THREE.Object3D();

	translating = new THREE.Object3D();

	galacticCentering.add( translating );
	rotating.add( galacticCentering );

	scene.add(rotating);

	projector = new THREE.Projector();
	raycaster = new THREE.Raycaster();
	raycaster.linePrecision = 30000000;
	raycaster.far = 100000;


	translating.targetPosition = new THREE.Vector3();
	translating.update = function(){
		if( this.easePanning )
			return;

		this.position.lerp( this.targetPosition, 0.1 );
		if( this.position.distanceTo( this.targetPosition) < 0.01 )
			this.position.copy( this.targetPosition );
	};

	//	-----------------------------------------------------------------------------
	//	Setup our renderer
	screenWidth = window.innerWidth;
	screenHeight = window.innerHeight
	screenWhalf = window.innerWidth / 2;
	screenHhalf = window.innerHeight / 2;

	renderer = new THREE.WebGLRenderer({antialias:antialias});

	// The devicePixelRatio caused odd alignment and behavior in retina displays
	// that were not "tablets", so I took it out.
	var devicePixelRatio = 1;//window.devicePixelRatio || 1;

	renderer.setSize( screenWidth * devicePixelRatio, screenHeight * devicePixelRatio );
	renderer.domElement.style.width = screenWidth + 'px';
	renderer.domElement.style.height = screenHeight + 'px';

	renderer.autoClear = false;
	renderer.sortObjects = false;
	renderer.generateMipmaps = false;



	maxAniso = renderer.getMaxAnisotropy();

	document.getElementById('glContainer').appendChild( renderer.domElement );

    //	-----------------------------------------------------------------------------
    //	Event listeners
	window.addEventListener( 'mousemove', onDocumentMouseMove, true );
	masterContainer.addEventListener( 'windowResize', onDocumentResize, true );
	masterContainer.addEventListener( 'mousedown', onDocumentMouseDown, true );
	window.addEventListener( 'mouseup', onDocumentMouseUp, false );
	masterContainer.addEventListener( 'click', onClick, true );
	masterContainer.addEventListener( 'mousewheel', onMouseWheel, false );
	masterContainer.addEventListener( 'keydown', onKeyDown, false);
	
	masterContainer.addEventListener( 'touchstart', touchStart, false );
	window.addEventListener( 'touchend', touchEnd, false );
	window.addEventListener( 'touchmove', touchMove, false );
	window.addEventListener( 'wheel', onMouseWheel, false);


	//	-----------------------------------------------------------------------------
	//	Setup our camera
	camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.5, 10000000 );
	camera.position.z = 1500; //changes
	camera.rotation.vx = 0;
	camera.rotation.vy = 0;
	camera.position.target = { x: 0, z: 1500, pz: 2000 };
	camera.isPerspectiveCamera = true;

	// if( enableSkybox ){
		setupSkyboxScene();
	// }

	camera.update = function(){

		if (this.__tour) {
			return;
		}

		if( this.easeZooming )
			return;

		//	cam shake
		//	except it's horrible when zoomed in
		//	let's not use it

		// camera.rotation.vx += (0 - camera.rotation.x) * 0.005 * camera.position.z / 100;
		// camera.rotation.vy += (0 - camera.rotation.y) * 0.005 * camera.position.z / 100;

		// camera.rotation.x += camera.rotation.vx;// + Math.cos( (Date.now() + Math.random()) * 0.004 ) * 0.000015 * camera.position.z / 1000000;
		// camera.rotation.y += camera.rotation.vy;// + Math.sin( (Date.now() + Math.random()) * 0.004 ) * 0.000015 * camera.position.z / 1000000;

		// camera.rotation.vx *= 0.98 * camera.position.z / 1000;
		// camera.rotation.vy *= 0.98 * camera.position.z / 1000;

		// camera.rotation.x *= constrain(camera.position.z / 100, 0, 1);		
		// camera.rotation.y *= constrain(camera.position.z / 100, 0, 1);		

		camera.position.z += (camera.position.target.z - camera.position.z) * 0.125;

	};

	camera.position.y = 0;
	camera.scale.z = 0.83;

	scene.add( camera );


	var windowResize = THREEx.WindowResize(renderer, camera);
	if( enableSkybox )
		windowResize = THREEx.WindowResize(renderer, cameraCube);

	//	turn it 90 deg
	rotateY = Math.PI/2;
	rotateX = Math.PI * 0.05;

	// buildGUI();

	sceneSetup();

	// initCSS3D();

	// Close Button

	// var $exout = $('#ex-out').click(function(e) {
	// 	e.preventDefault();
	// 	$detailContainer.fadeOut();
	// 	$('#css-container').css('display', 'block');
	// 	if ($detailContainer.hasClass('about')) {
	// 		$detailContainer.removeClass('about');
	// 	}
	// });

	// var $zoomback = $('#zoom-back').click(function(e) {
	// 	e.preventDefault();
	// 	$exout.click();
	// 	zoomOut(750);
	// });

	// $.get('./images/icons/zoom-out.svg', function(resp) {
	// 	$(resp).find('svg').addClass('icon').appendTo($zoomback);
	// });

	$('#loader')
			.fadeOut(0);

	// setTimeout(function() {

	// 	var s = 'scale(1.0)';

	// 	$('#layout').css({
	// 		webkitTransform: s,
	// 		mozTransform: s,
	// 		msTransform: s,
	// 		oTransform: s,
	// 		transform: s
	// 	});

		// $('#loader')
		// 	.fadeOut(250);

	// 	$iconNav.fadeIn();
	// 	$iconNav.isReady = true;

	// 	if ( firstTime ) {
	// 		displayIntroMessage();
	// 		if( localStorage )
	// 			localStorage.setItem('first', 0);
	// 	} else {
	// 		_.delay(function() {
	// 			$iconNav.find('#tour-button').trigger('mouseover');
	// 		}, 500);
	// 	}

	// 	// if( markers.length > 0 )
	// 	// 	markers[0].select();

	// }, 500);

	// document.getElementById('bgmusicA').addEventListener('ended', function(){
	// 	this.currentTime = 0;
	// 	this.pause();
	// 	var playB = function(){
	// 		document.getElementById('bgmusicB').play();
	// 	}
	// 	setTimeout( playB, 15000 );
	// }, false);
		
	// document.getElementById('bgmusicB').addEventListener('ended', function(){
	// 	this.currentTime = 0;
	// 	this.pause();	
	// 	var playA = function(){
	// 		document.getElementById('bgmusicA').play();
	// 	}
	// 	setTimeout( playA, 15000 );
	// }, false);

	// document.getElementById('bgmusicA').play();

	// if( localStorage && localStorage.getItem('sound') == 0 ){
	// 	// console.log('localstorage sound is off');
 //      	// $('#soundoff').show();
 //      	// $('#sound').hide();		
	// 	muteSound();
	// }

}

function sceneSetup(){
	var model = new Sun({
		radius: 1,
		spectral: 0.656,
		distance : 100,
		theta : 0,
		phi : 0,
		center : {X : 0, Y : 0, Z : -200},
		color : 0,
		rotationSpeed : {theta : 0.01, phi : 0}
	});

	var model2 = new Sun({
		radius: 1,
		spectral: 0.1,
		distance : 100,
		theta : Math.PI,
		phi : 0,
		color : 1,
		center : {X : 0, Y : 0, Z : -200},
		rotationSpeed : {theta : 0.01, phi : 0}
	});

	var model3 = new Sun({
		radius: 1.5,
		spectral: 0.3,
		distance : 0,
		theta : 0,
		phi : 0,
		color : 2,
		center : {X : 0, Y : 0, Z : 200},
		rotationSpeed : {theta : 0.01, phi : 0}
	});

	translating.add(model.sun);
	translating.add(model2.sun);
	translating.add(model3.sun);

	stars.push(model.sun);
	stars.push(model2.sun);
	stars.push(model3.sun);

	for(var i = 0; i<6; i++){
		planet = new Planet({
			distance : {X : 200, Y : 200, Z : 200},
			theta : i * 2 * Math.PI / 6,
			phi : 15,
			size : 10, 
			name : "SHREY", 
			owner : "SHREY", 
			image : "sun_surface.png", 
			index : i,
			rotationSpeed : {theta : 0.01, phi : 0},
			center : {X: 0, Y: 0, Z: -200}
		});
		translating.add(planet.sphere);
		translating.add(planet.displayPlanet);
		planets.push(planet.displayPlanet);
	}

	for(var i = 0; i<4; i++){
		planet = new Planet({
			distance : {X : 100, Y : 100, Z : 100},
			phi : 0,
			theta : i*2*Math.PI/4,
			size : 10, 
			name : "SHREY", 
			owner : "SHREY", 
			image : "000.jpg", 
			index : i+6,
			rotationSpeed : {theta : 0.01, phi : 0},
			center : {X: 0, Y: 0, Z: 200}
		});
		translating.add(planet.sphere);
		translating.add(planet.displayPlanet);
		planets.push(planet.displayPlanet);
	}

	for(var i = 0; i<2; i++){
		planet = new Planet({
			distance : {X : 0, Y : 250, Z : 500},
			theta : i*2*Math.PI/2,
			phi : 180,
			size : 10, 
			name : "SHREY", 
			owner : "SHREY", 
			image : "000.jpg", 
			index : i+10,
			rotationSpeed : {theta : 0.01, phi : 0},
			center : {X: 0, Y: 0, Z: 0}
		});
		translating.add(planet.sphere);
		translating.add(planet.displayPlanet);
		planets.push(planet.displayPlanet);
	}
		// console.timeEnd("make star models");
	// }
	

	// if( enableDataStar ){
	// 	pSystem = generateHipparcosStars();
	// 	translating.add( pSystem );
	// }

	// if( enableGalaxy ){
	// 	pGalacticSystem = generateGalaxy();
	// 	translating.add( pGalacticSystem );
	// 	if( enableDust ){
	// 		pDustSystem = generateDust();
	// 		pGalacticSystem.add( pDustSystem );
	// 	}		
	// }

	// if( enableSolarSystem ){
	// 	var solarSystem = makeSolarSystem();
	// 	translating.add(solarSystem);
	// }
	
	// if( enableSpacePlane ){
	// 	spacePlane = createSpacePlane();	
	// 	translating.add( spacePlane );		
	// }

	if( enableSkybox ){
		initSkybox(false);
	}	

}


function animate() {

	// Make sure the document doesn't scroll
	document.body.scrollTop = document.body.scrollLeft = 0;

	camera.update();
	// camera.markersVisible = camera.position.z < markerThreshold.max && camera.position.z > markerThreshold.min;

	lastRotateY = rotateY;

	// Tween the camera if we're not touring.
	if (!camera.__tour) {

		rotateX += rotateVX;
		rotateY += rotateVY;


		rotateVX *= 0.9;
		rotateVY *= 0.9;

		if (dragging ){
			rotateVX *= 0.6;
			rotateVY *= 0.6;
		}

		if( initialAutoRotate )
			rotateVY = 0.0015;

		//	treat the solar system a bit differently
		//	since we are at 0,0,0 floating point percision won't be as big of a problem
		var spinCutoff = 100;
		if( translating.position.length() < 0.0001 ){
			spinCutoff = 2;			
		}
		
		if( camera.position.z < spinCutoff ){	
			if( starModel ){
				starModel.rotation.x = rotateX;
				starModel.rotation.y = rotateY;	
			}					
			rotating.rotation.x = rotateX;
			rotating.rotation.y = rotateY;
		}
		else{
			rotating.rotation.x = rotateX;
			rotating.rotation.y = rotateY;
			if( starModel ){
				starModel.rotation.x = rotateX;
				starModel.rotation.y = rotateY;
			}
			
		}
		
		// var isZoomedIn = camera.position.target.z < markerThreshold.min;
		// var isZoomedToSolarSystem = camera.position.target.z > markerThreshold.min;

		// if (isZoomedIn && camera.position.z < markerThreshold.min && $detailContainer.css('display') == 'none' && $starName.css('display') == 'none') {
		// 	$starName.fadeIn();
		// } else if ((isZoomedToSolarSystem || $detailContainer.css('display') != 'none') && $starName.css('opacity') == 1.0) {
		// 	$starName.fadeOut();
		// }

		// if (isZoomedIn && $cssContainer.css('display') != 'none') {
		// 	$cssContainer.css({ display: 'none' });
		// } else if (!isZoomedIn && $cssContainer.css('display') == 'none') {
		// 	$cssContainer.css({ display: 'block' });
		// }

		// if (isZoomedToSolarSystem && $detailContainer.css('display') != 'none' && !$detailContainer.hasClass('about')) {
		// 	$detailContainer.fadeOut();
		// }

		// if( $detailContainer.css('display') == 'none'/* && starModel.scale.length() < 10 */){
		// 	camera.position.x *= 0.95;
		// }
		// else{
		// 	camera.position.x += (camera.position.target.x - camera.position.x) * 0.95;
		// }

	}

	var targetFov = constrain( Math.pow(camera.position.z,2) / 100000, 0.000001, 40 );
	camera.fov = targetFov;
	fovValue = 0.5 / Math.tan(camera.fov * Math.PI / 360) * screenHeight;
	camera.updateProjectionMatrix();

	shaderTiming = (Date.now() - startTime )/ 1000;
	
	rotateYAccumulate += Math.abs(rotateY-lastRotateY) * 5;

	rotating.traverse(function( mesh ){
		if( mesh.update !== undefined ) {
			mesh.update();
		}
	});

	if( enableSkybox ) {
		updateSkybox();
	}

	render();

	// setCSSWorld();
	// setCSSCamera(camera, fovValue);

  	// updateMarkers();
  	// updateLegacyMarkers();

  	requestAnimationFrame( animate );

	if ( camera.easeZooming || translating.easePanning ) {		

		// updateMinimap();

		TWEEN.update();
	}

}

function render() {
	renderer.clear();
	// if( enableSkybox )
		// renderSkybox();
	renderer.render( scene, camera );
}

function interact(){
	console.log("HERE");
	// var raycaster = new THREE.Raycaster();
	// raycaster.setFromCamera({x: mouseX, y: mouseY}, camera);
	// console.log(camera);
	var vector = new THREE.Vector3( ( mouseEvent.clientX / window.innerWidth ) * 2 - 1, - ( mouseEvent.clientY / window.innerHeight ) * 2 + 1, 0.5);
	// var vector = new THREE.Vector3(mouseX, mouseY, 1);
	// console.log(mouseX, mouseY);
	projector.unprojectVector(vector, camera);

	raycaster.set(camera.position, vector.sub(camera.position).normalize());
	
	// console.log(vector.sub(camera.position).normalize());

    var intersectPlanet = raycaster.intersectObjects(planets);
    // var intersectStar = raycaster.intersectObject(stars, true);
    // console.log(planets);
    console.log(intersectPlanet.length, "LENGTHS OF INTERSECTION");
}

// function muteSound(){
// 	document.getElementById('bgmusicA').volume = 0;
// 	document.getElementById('bgmusicB').volume = 0;
// 	if ( localStorage ) 
// 		localStorage.setItem('sound', 0);
// }

// function unmuteSound(){
// 	document.getElementById('bgmusicA').volume = 1;
// 	document.getElementById('bgmusicB').volume = 1;
// 	if ( localStorage ) 
// 		localStorage.setItem('sound', 1);		
// }

// function displayIntroMessage(){
// 	Tour.meta.fadeIn();
// 	tour.showMessage('Welcome to the stellar neighborhood.', 5000 )
// 	.showMessage('This is a visualization of over 100,000 nearby stars.', 5000 )
// 	.showMessage('Scroll and zoom to explore.', 4000, function(){
// 		firstTime = false;
// 		$(window).trigger('resize');
// 		$iconNav.find('#tour-button').trigger('mouseover');
// 	} )
// 	.endMessages();	
// }
