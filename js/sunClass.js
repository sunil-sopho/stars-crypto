var Sun = function(options){
	var radius = options.radius;
	var spectral = options.spectral;
	var distance = options.distance;
	var rotationSpeed = options.rotationSpeed;
	var theta = options.theta;
	var center = options.center;
	var phi = options.phi;

	var colorID = options.color;

	var scale = 16/7.35144e-8 * radius;

	var sunTexture;
	var sunColorLookupTexture;
	var solarflareTexture;
	var sunHaloTexture;
	var sunHaloColorTexture;
	var sunCoronaTexture;

	var glowSpanTexture = THREE.ImageUtils.loadTexture('images/glowspan.png');
	var starColorGraph = THREE.ImageUtils.loadTexture( 'images/star_color_modified.png' );

  // console.time("load sun textures"); 
	loadStarSurfaceTextures();

	function loadStarSurfaceTextures(){
		if( sunTexture === undefined ){
			sunTexture = THREE.ImageUtils.loadTexture( "images/sun_surface.png", undefined, setLoadMessage("Igniting solar plasma") );
			sunTexture.anisotropy = maxAniso;
			sunTexture.wrapS = sunTexture.wrapT = THREE.RepeatWrapping;
		}

		if( sunColorLookupTexture === undefined ){
			sunColorLookupTexture = THREE.ImageUtils.loadTexture( "images/star_colorshift.png" );
		}

		if( solarflareTexture === undefined ){
			solarflareTexture = THREE.ImageUtils.loadTexture( "images/solarflare.png", undefined, setLoadMessage("Distributing solar flares")	 );
		}

		if( sunHaloTexture === undefined ){
			sunHaloTexture = THREE.ImageUtils.loadTexture( "images/sun_halo.png", undefined, setLoadMessage("Calculating coronal mass") );
		}

		if( sunHaloColorTexture === undefined ){
			sunHaloColorTexture = THREE.ImageUtils.loadTexture( "images/halo_colorshift.png" );
		}

		if( sunCoronaTexture === undefined ){
			sunCoronaTexture = THREE.ImageUtils.loadTexture( "images/corona01.png", undefined, setLoadMessage("Projecting coronal ejecta") );
		}
	}
  // console.timeEnd("load sun textures");

	var sunUniforms = {
		texturePrimary:   	{ type: "t", value: sunTexture },
		textureColor:   	{ type: "t", value: sunColorLookupTexture },
		textureSpectral: 	{ type: "t", value: starColorGraph },
		time: 				{ type: "f", value: 0 },
		spectralLookup: 	{ type: "f", value: 0 },		
	};

	var solarflareUniforms = {
		texturePrimary:   	{ type: "t", value: solarflareTexture },
		time: 				{ type: "f", value: 0 },
		textureSpectral: 	{ type: "t", value: starColorGraph },
		spectralLookup: 	{ type: "f", value: 0 },	
	};

	var haloUniforms = {
		texturePrimary:   	{ type: "t", value: sunHaloTexture },
		textureColor:   	{ type: "t", value: sunHaloColorTexture },
		time: 				{ type: "f", value: 0 },
		textureSpectral: 	{ type: "t", value: starColorGraph },
		spectralLookup: 	{ type: "f", value: 0 },			
	};

	var coronaUniforms = {
		texturePrimary:   	{ type: "t", value: sunCoronaTexture },
		textureSpectral: 	{ type: "t", value: starColorGraph },
		spectralLookup: 	{ type: "f", value: 0 },			
	};

	var surfaceGeo = new THREE.SphereGeometry( 7.35144e-8 * scale, 60, 30);
	function makeStarSurface( radius, uniforms ){
		var sunShaderMaterial = new THREE.ShaderMaterial( {
			uniforms: 		uniforms,
			vertexShader:   shaderList.starsurface.vertex,
			fragmentShader: shaderList.starsurface.fragment,
		});

		var sunSphere = new THREE.Mesh( surfaceGeo, sunShaderMaterial);
		return sunSphere;
	}

	var haloGeo = new THREE.PlaneGeometry( .00000022 * scale, .00000022*scale );
	function makeStarHalo(uniforms){
		var sunHaloMaterial = new THREE.ShaderMaterial(
			{
				uniforms: 		uniforms,
				vertexShader:   shaderList.starhalo.vertex,
				fragmentShader: shaderList.starhalo.fragment,
				blending: 		THREE.AdditiveBlending,
				depthTest: 		false,
				depthWrite: 	false,
				color: 			0xffffff,
				transparent: 	true,
				//	settings that prevent z fighting
				polygonOffset: 			true,
				polygonOffsetFactor: 	1,
				polygonOffsetUnits: 	100
			}
		);

		var sunHalo = new THREE.Mesh( haloGeo, sunHaloMaterial );
		sunHalo.position.set( 0, 0, 0 );
		return sunHalo;
	}

	var glowGeo = new THREE.PlaneGeometry( .0000003 * scale, .0000003*scale );
	function makeStarGlow(uniforms){
		//	the bright glow surrounding everything
		var sunGlowMaterial = new THREE.ShaderMaterial(
			{
				//map: sunCoronaTexture,
				uniforms: 		uniforms,
				blending: 		THREE.AdditiveBlending,
				fragmentShader: shaderList.corona.fragment,
				vertexShader:   shaderList.corona.vertex,
				color: 			0xffffff,
				transparent: 	true,
				depthTest: 		true,
				depthWrite: 	true,
				//	settings that prevent z fighting
				polygonOffset: 			true,
				polygonOffsetFactor: 	-1,
				polygonOffsetUnits: 	100
				// depthFunc : THREE.AlwaysDepth
				// lights : true
			}
		);

		var sunGlow = new THREE.Mesh( glowGeo, sunGlowMaterial );
		sunGlow.position.set( 0, 0, 0 );
		return sunGlow;
	}

	function makeStarLensflare(size, zextra, hueShift){
		var sunLensFlare = addStarLensFlare( 0,0,zextra, size, undefined, hueShift);
		sunLensFlare.customUpdateCallback = function(object){
			if( object.visible == false )
				return;
		    var f, fl = this.lensFlares.length;
		    var flare;
		    var vecX = -this.positionScreen.x * 2;
		    var vecY = -this.positionScreen.y * 2;
		    var size = object.size ? object.size : 16000;

		    var camDistance = camera.position.length();

		    for( f = 0; f < fl; f ++ ) {

		        flare = this.lensFlares[ f ];

		        flare.x = this.positionScreen.x + vecX * flare.distance;
		        flare.y = this.positionScreen.y + vecY * flare.distance;

				flare.scale = size / Math.pow(camDistance,2.0) * 2.0;

		        if( camDistance < 10.0 ){
		        	flare.opacity = Math.pow(camDistance * 2.0,2.0);
		        }
		        else{
		        	flare.opacity = 1.0;
		        }

		        flare.rotation = 0;


				//flare.rotation = this.positionScreen.x * 0.5;
		        //flare.rotation = 0;
		    }

		    for( f=2; f<fl; f++ ){
		    	flare = this.lensFlares[ f ];
		    	var dist = Math.sqrt( Math.pow(flare.x,2) + Math.pow(flare.y,2) );
		    	flare.opacity = constrain( dist, 0.0, 1.0 );
		    	flare.wantedRotation = flare.x * Math.PI * 0.25;
	        	flare.rotation += ( flare.wantedRotation - flare.rotation ) * 0.25;
		    }
		    
		    // console.log(camDistance);
		};
		return sunLensFlare;
	}

	var solarflareGeometry = new THREE.TorusGeometry( 0.00000003 * scale, (0.000000001 + 0.000000002)*scale, 60, 90, 0.15 + Math.PI  );
	function makeSolarflare( uniforms ){
		var solarflareMaterial = new THREE.ShaderMaterial(
			{
				uniforms: 				uniforms,
				vertexShader:   		shaderList.starflare.vertex,
				fragmentShader: 		shaderList.starflare.fragment,
				blending: 				THREE.AdditiveBlending,
				color: 					0xffffff,
				transparent: 			true,
				depthTest: 				true,
				depthWrite: 			false,
				polygonOffset: 			true,
				polygonOffsetFactor: 	-100,
				polygonOffsetUnits: 	1000,
			}
		);

		var solarflareMesh = new THREE.Object3D();

		for( var i=0; i< 6; i++ ){
			var solarflare = new THREE.Mesh(solarflareGeometry, solarflareMaterial );
			solarflare.rotation.y = Math.PI/2;
			solarflare.speed = Math.random() * 0.01 + 0.005;
			solarflare.rotation.z = Math.PI * Math.random() * 2;
			solarflare.rotation.x = -Math.PI + Math.PI * 2;
			solarflare.update = function(){
				this.rotation.z += this.speed;
			}
			var solarflareContainer = new THREE.Object3D();
			solarflareContainer.position.x = -1 + Math.random() * 2;
			solarflareContainer.position.y = -1 + Math.random() * 2;
			solarflareContainer.position.z = -1 + Math.random() * 2;
			solarflareContainer.position.multiplyScalar( 7.35144e-8 * 0.8 * scale );
			solarflareContainer.lookAt( new THREE.Vector3(0,0,0) );
			solarflareContainer.add( solarflare );

			solarflareMesh.add( solarflareContainer );
		}

		return solarflareMesh;
	}

	this.sun = new THREE.Object3D();

	//	the actual glowy ball of fire
  // console.time("make sun surface");
	var starSurface = makeStarSurface( radius, sunUniforms );
	this.sun.starSurface = starSurface;
	this.sun.add( starSurface );
  // console.timeEnd("make sun surface");

  // console.time("make sun solarflare");
	var solarflare = makeSolarflare( solarflareUniforms );
	// sun.solarflare = solarflare;
	// sun.add( solarflare );	
  // console.timeEnd("make sun solarflare");

	//	2D overlay elements	
	var gyro = new THREE.Gyroscope();
	this.sun.add( gyro );	
	this.sun.gyro = gyro;

    // console.time("make sun lensflare");
	var starLensflare = makeStarLensflare(1.5, 0.0001, spectral);
	this.sun.lensflare = starLensflare;
	this.sun.lensflare.name == 'lensflare';
	gyro.add( starLensflare );
	// starLensflare.add(gyro);
    // console.timeEnd("make sun lensflare");

		//	the corona that lines the edge of the sun sphere
    // console.time("make sun halo");
	var starHalo = makeStarHalo( haloUniforms );
	this.sun.starHalo = starHalo;
	gyro.add( starHalo );
	// starHalo.add(gyro);
    // console.timeEnd("make sun halo");
	
    // console.time("make sun glow");
	var starGlow = makeStarGlow( coronaUniforms );
	this.sun.starGlow = starGlow;
	gyro.add( starGlow );
	// starGlow.add(gyro);
    // console.timeEnd("make sun glow");


	var latticeMaterial = new THREE.MeshBasicMaterial({
		map: glowSpanTexture,
		blending: THREE.AdditiveBlending,
		transparent: true,
		depthTest: true,
		depthWrite: true,		
		wireframe: true,
		opacity: 0.8,
	});

	var lattice = new THREE.Mesh( new THREE.IcosahedronGeometry( radius * 1.25, 2), latticeMaterial );
	lattice.update = function(){
		this.rotation.y += 0.001;
		this.rotation.z -= 0.0009;
		this.rotation.x -= 0.0004;
	}
	lattice.material.map.wrapS = THREE.RepeatWrapping;
	lattice.material.map.wrapT = THREE.RepeatWrapping;
	lattice.material.map.needsUpdate = true;
	lattice.material.map.onUpdate = function(){
		this.offset.y -= 0.01;
		this.needsUpdate = true;
	}

	this.sun.add(lattice);

	this.sun.sunUniforms = sunUniforms;
	this.sun.solarflareUniforms = solarflareUniforms;
	this.sun.haloUniforms = haloUniforms;
	this.sun.coronaUniforms = coronaUniforms;

	this.sun.setSpectralIndex = function( index ){
		var starColor = map(index, -0.3, 1.52, 0, 1);	
		starColor = constrain( starColor, 0.0, 1.0 );
		this.starColor = starColor;

		this.sunUniforms.spectralLookup.value = starColor;
		this.solarflareUniforms.spectralLookup.value = starColor;
		this.haloUniforms.spectralLookup.value = starColor;		
		this.coronaUniforms.spectralLookup.value = starColor;	
	}

	this.sun.setScale = function( index ){
		this.scale.setLength( index );
		
		//	remove old lensflare
		this.gyro.remove( this.lensflare );

		var lensflareSize = 4.0 + index * 0.5 + 0.1 * Math.pow(index,2);
		if( lensflareSize < 1.5 )
			lensflareSize = 1.5;
		this.lensflare = makeStarLensflare( lensflareSize * scale, 0.0002 * index, this.starColor );		
		this.lensflare.name = 'lensflare';
		this.gyro.add( this.lensflare );	
	}

	this.sun.randomizeSolarFlare = function(){
		this.solarflare.rotation.x = Math.random() * Math.PI * 2;
		this.solarflare.rotation.y = Math.random() * Math.PI * 2;
	}

	this.sun.setSpectralIndex(spectral);

	this.sun.theta = theta;
	this.sun.phi = phi;
	this.sun.distance = distance;
	this.sun.rotationSpeed = rotationSpeed;
	this.sun.center = center;

	this.sun.update = function(){
		this.sunUniforms.time.value = shaderTiming;
		this.haloUniforms.time.value = shaderTiming + rotateYAccumulate;
		this.solarflareUniforms.time.value = shaderTiming;

		this.theta += this.rotationSpeed.theta;
		this.phi += this.rotationSpeed.phi;

		
		this.position.x = this.center.X + this.distance * Math.sin(this.theta) * Math.sin(this.phi);
		this.position.y = this.center.Y + this.distance * Math.cos(this.theta);
		this.position.z = this.center.Z + this.distance * Math.sin(this.theta) * Math.cos(this.phi);

		// this.position.x = this.center.X + this.distance * Math.sin(this.theta)* Math.sin(this.phi) ; 
		// this.position.y = this.center.Y + this.distance * Math.cos(this.theta); 
		// this.position.z = this.center.Z + this.distance * Math.sin(this.theta)* Math.cos(this.phi);

		// console.log(this.position.x, this.position.y, this.position.z);

		this.rotation.x += 0.003;
		this.rotation.y += 0.003;
		this.rotation.z += 0.003;

		// this.rotation.x = 
		
		//	ugly.. terrible hack
		//	no matter what I do I can't remove the lensflare visibility at a distance
		//	which was causing jittering on pixels when the lensflare was too small to be visible
		//	is this the only way?
		
		if( camera.position.z > 400 ){
			var lensflareChild = this.gyro.getObjectByName('lensflare');
			if( lensflareChild !== undefined )
				this.gyro.remove(  lensflareChild );
		}
		else{
			if( this.gyro.getObjectByName('lensflare') === undefined ){
				this.gyro.add( this.lensflare );			
			}
			
		}
	}
}