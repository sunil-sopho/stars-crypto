var skybox;
var skyboxUniforms;

var cameraCube, sceneCube;

function setupSkyboxScene(){
	cameraCube = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000000 );
	sceneCube = new THREE.Scene();	
}

function initSkybox( highres ){
	setLoadMessage("Loading internal stars")
	var r = "images/ss_skyb/";

	if( highres == false )
		r += "s_";

	var urls = [ r + "px.png", r + "nx.png",
				 r + "py.png", r + "ny.png",
				 r + "pz.png", r + "nz.png" ];

	var textureCube = THREE.ImageUtils.loadTextureCube( urls, undefined, setLoadMessage("Loading interstellar bodies") );
	textureCube.anisotropy = maxAniso;
	var shader = THREE.ShaderLib[ "cube" ];
	shader.uniforms[ "tCube" ].value = textureCube;
	shader.uniforms[ "opacity" ] = { value: 1.0, type: "f" };
	skyboxUniforms = shader.uniforms;
	var skyboxMat = new THREE.ShaderMaterial( {
		fragmentShader: shaderList.cubemapcustom.fragment,
		vertexShader: shaderList.cubemapcustom.vertex,
		uniforms: shader.uniforms,
		side: THREE.BackSide,
		depthWrite: false,
		depthTest: false,
	} );

	skybox = new THREE.Mesh( new THREE.CubeGeometry( 1000000, 1000000, 1000000 ), skyboxMat );
	sceneCube.add( skybox );
}

function updateSkybox(override){
	cameraCube.rotation.order = 'YXZ';
	
	//	approximates the visible angle of the galaxy to match when zoomed in
	if( starModel ){
		//	negate no longer exist since rotation is no longer a vector
		var rot = starModel.rotation.clone();		
		rot.x -= Math.PI/4;
		rot.y += Math.PI/4
		// rot.x *= -1;
		// rot.y *= -1;
		// rot.z *= -1;
		cameraCube.rotation.copy( rot );
	}
	else{
		//	negate no longer exist since rotation is no longer a vector
		var rot = rotating.rotation.clone();			
		rot.x -= Math.PI/4;
		rot.y += Math.PI/4
		// rot.x *= -1;
		// rot.y *= -1;
		// rot.z *= -1;
		cameraCube.rotation.copy( rot );
	}
	//console.log(camera.position.z);
	cameraCube.fov = constrain( camera.position.z * 20.0, 70, 70);
	cameraCube.updateProjectionMatrix();

	var skyboxBrightness = constrain(250 / camera.position.z, 0.0, 1.0);
	if(camera.position.z > 750)
	skyboxUniforms["opacity"].value = skyboxBrightness;
	else
	skyboxUniforms["opacity"].value = .30;
}

function renderSkybox(){
	// if( skyboxUniforms["opacity"].value > 0.001 )
	renderer.render( sceneCube, cameraCube );
}
