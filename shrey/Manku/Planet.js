function distance(x,y,z,x1,y1,z1){
	return Math.sqrt(Math.pow((x-x1),2) + Math.pow((y-y1),2) + Math.pow((z-z1),2));
}

var Planet = function(options){
	this.geometry = new THREE.SphereGeometry(options.size, 32, 32);

	this.planet = new THREE.Object3D();

	var texture = THREE.ImageUtils.loadTexture( "images/"+options.image, undefined, setLoadMessage("Igniting solar plasma") );

	this.material = new THREE.MeshPhongMaterial({
		color: 0xF66120,
		emissive : 0xF66120,
		shininess: 10,
		shading: THREE.DoubleSide,
		transparent: true,
		opacity: 1,
		map : texture
    });
	
	var ringGeometry = new THREE.RingGeometry( options.size * 1.4, options.size * 1.43, 64);
	var ringMaterial = new THREE.MeshBasicMaterial( { color: 0x98fb98, side: THREE.DoubleSide } );
	this.ring = new THREE.Mesh(ringGeometry, ringMaterial);


	var ring2Geometry = new THREE.RingGeometry( options.size * 1.4, options.size * 1.43, 64);
	var ring2Material = new THREE.MeshBasicMaterial( { color: 0x98fb98, side: THREE.DoubleSide } );
	this.ring2 = new THREE.Mesh(ring2Geometry, ring2Material);

	this.ring2.rotation.x = Math.PI/2.5;

	var orbitGeometry = new THREE.RingGeometry(options.size * 2.5, options.size * 2.54, 64);
	var orbitMaterial = new THREE.MeshBasicMaterial( { color: 0x5b965b, side: THREE.DoubleSide } );

	this.orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
	this.orbit.rotation.x = Math.PI/2;

	var radius = options.size * 1.2;
	var segments = 50;
	var rings = 60;

	var geometry = new THREE.SphereGeometry(radius, segments, rings);
	var material = new THREE.MeshBasicMaterial({
	  color: 0xF3A2B0,
	  wireframe: true
	});

	var wireframe = new THREE.Mesh(geometry, material);

	this.internalGlow = new THREE.PointLight(0xffffff, 1, 0);
	this.internalGlow.position.set(options.size, options.size, options.size);
	
	this.sphere = new THREE.Mesh(this.geometry, this.material);
	this.planet.position.x = options.center.X + options.distance.X * Math.sin(options.theta) * Math.cos(options.phi); 
	this.planet.position.y = options.center.Y + options.distance.Y * Math.sin(options.theta) * Math.sin(options.phi); 
	this.planet.position.z = options.center.Z + options.distance.Z * Math.cos(options.theta); 

	this.planet.index = options.index;

	this.planet.center = {X:0, Y:0, Z:0};

	this.planet.center.X = options.center.X;
	this.planet.center.Y = options.center.Y;
	this.planet.center.Z = options.center.Z;

	this.sphere.userData = {position : {x : this.sphere.position.x, y : this.sphere.position.y, z : this.sphere.position.z}, name : options.name, owner : options.owner, image : options.image, index : options.index};

	this.planet.theta = options.theta;
	this.planet.rotationSpeed = options.rotationSpeed;
	this.planet.distance = options.distance;
	this.planet.phi = options.phi;

	this.planet.sphere = this.sphere;
	this.planet.ring = this.ring;
	this.planet.ring2 = this.ring2;
	this.planet.orbit = this.orbit;
	var haloGeo = new THREE.PlaneGeometry(320, 320);
	var sunHaloTexture = THREE.ImageUtils.loadTexture( "images/sun_halo.png", undefined, setLoadMessage("Calculating coronal mass") );
	var starColorGraph = THREE.ImageUtils.loadTexture( 'images/star_color_modified.png' );
	var sunHaloColorTexture = THREE.ImageUtils.loadTexture( "images/halo_colorshift.png" );


	var gyro = new THREE.Gyroscope();

	var haloUniforms = {
		texturePrimary:   	{ type: "t", value: sunHaloTexture },
		textureColor:   	{ type: "t", value: sunHaloColorTexture },
		time: 				{ type: "f", value: 0 },
		textureSpectral: 	{ type: "t", value: starColorGraph },
		spectralLookup: 	{ type: "f", value: 0 },			
	};

	var halo = makeStarHalo(haloUniforms);

	gyro.add(halo);

	// this.planet.add(gyro);
	this.planet.add(this.ring);
	this.planet.add(this.ring2);
	this.planet.add(this.orbit);
	this.planet.add(this.sphere);
	this.planet.add(wireframe);
	var t = options.syst;
	// this.sphere.add(this.displayPlanet);

	this.planet.update = function(){

		this.sphere.rotation.z += 0.002;
		this.sphere.rotation.y += 0.002;
		this.sphere.rotation.x += 0.002;

		this.ring.rotation.x -= 0.002;
		this.ring.rotation.y -= 0.002;
		this.ring.rotation.z -= 0.002;

		this.ring2.rotation.x += 0.002;
		this.ring2.rotation.y -= 0.002;
		this.ring2.rotation.z += 0.002;

		//console.log(distance(this.position.x,this.position.y,this.position.z,this.position.x,-50,-28.868));
		this.theta += this.rotationSpeed.theta/2;
		this.phi += this.rotationSpeed.phi/2;
		//console.log(distance(this.position.x,this.position.y,this.position.z,this.position.x,50,-28.868));
		// this.position.x = this.center.X + this.distance.X * Math.cos(this.theta) ; 
		// this.position.y = this.center.Y + this.distance.Y * Math.sin(this.theta)* Math.sin(this.phi); 
		// this.position.z = this.center.Z + this.distance.Z * Math.sin(this.theta)* Math.cos(this.phi);
		var a = this.distance.X * Math.sin(this.theta)* Math.sin(this.phi);
		var b = this.distance.Y * Math.cos(this.theta); 
		var c = this.distance.Z * Math.sin(this.theta)* Math.cos(this.phi);
		var d;
		var e;
		if(t!=1){
			if(this.index == 1 ){
				this.position.x = this.center.X + a ;
				this.position.y = this.center.Y + b ;
				this.position.z = this.center.Z + c ;	
			}
			else if(this.index == 3){
				if(t==2 || t==5){ 
					d = Math.cos(-Math.PI/3);
					e = Math.sin(-Math.PI/3);
				}
				else if(t==3 || t==9 || t==10){
					d = Math.cos(3*Math.PI/4);
					e = Math.sin(3*Math.PI/4);
				}
				else if(t==4 || t==8){
					d = Math.cos(-Math.PI/6);
					e = Math.sin(-Math.PI/6);
				}
				else{
					d =0;
					e =0;
				}
				this.position.x = this.center.X + a ;
				this.position.y = this.center.Y + b*d + c*e ;
				this.position.z = this.center.Z + -b*e + c*d ;
			}
			else if(this.index == 2){
				if(t==2 || t==5 ){ 
					d = Math.cos(Math.PI/3);
					e = Math.sin(Math.PI/3);
				}
				else if(t==3 || t==9 || t==10){
					d = Math.cos(Math.PI/4);
					e = Math.sin(Math.PI/4);
				}
				else if(t==4 || t==8){
					d = Math.cos(Math.PI/6);
					e = Math.sin(Math.PI/6);
				}
				else{
					d =0;
					e =0;
				}
				this.position.x = this.center.X + a ;
				this.position.y = this.center.Y + b*d + c*e ;
				this.position.z = this.center.Z + -b*e + c*d ;	
			}
			else if(this.index == 4){
				this.position.x = this.center.X + a ;
				this.position.y = this.center.Y + c ;
				this.position.z = this.center.Z - b ;	
			}
			else{
				this.position.x = this.center.X + a ;
				this.position.y = this.center.Y + b ;
				this.position.z = this.center.Z + c ;	
			}
		}
		else{
			if(distance(this.position.x,this.position.y,this.position.z,this.position.x,50,-28.868) < 1 && this.index == 1){
				this.index = 2;
				this.theta =  this.theta - Math.PI;
				this.center.X = 0;
				this.center.Y = 100;
				this.center.Z = 115.473/2;
				//this.rotationSpeed.theta *= -1;	
			}
			else if(distance(this.position.x,this.position.y,this.position.z,this.position.x,0,28.868*2) < 1 && this.index == 2){
				this.index = 3;
				this.theta =  this.theta - Math.PI;
				this.center.X = 0;
				this.center.Y = -100;
				this.center.Z = 115.473/2;
				//this.rotationSpeed.theta *= -1;	
			}
			else if(distance(this.position.x,this.position.y,this.position.z,this.position.x,-50,-28.868) < 1 && this.index == 3){
				this.index = 1;
				this.theta =  this.theta - Math.PI;
				this.center.X = 0;
				this.center.Y = 0;
				this.center.Z = -115.473;
				//this.rotationSpeed.theta *= -1;	
			}
			else{
				this.position.x = this.center.X + this.distance.X * Math.sin(this.theta)* Math.sin(this.phi) ; 
				this.position.y = this.center.Y + this.distance.Y * Math.cos(this.theta); 
				this.position.z = this.center.Z + this.distance.Z * Math.sin(this.theta)* Math.cos(this.phi);
				// console.log(this.phi);
			}
		}
	}

	function makeStarHalo(uniforms){
		var sunHaloMaterial = new THREE.ShaderMaterial(
			{
				uniforms: 		uniforms,
				vertexShader:   shaderList.starhalo.vertex,
				fragmentShader: shaderList.starhalo.fragment,
				blending: 		THREE.AdditiveBlending,
				depthTest: 		true,
				depthWrite: 	true,
				color: 			0xffffff,
				transparent: 	true,
				opacity: 		0.2
				//	settings that prevent z fighting
				// polygonOffset: 			true,
				// polygonOffsetFactor: 	1,
				// polygonOffsetUnits: 	100
			}
		);

		var sunHalo = new THREE.Mesh( haloGeo, sunHaloMaterial );
		sunHalo.position.set( 0, 0, 0 );
		return sunHalo;
	}
}