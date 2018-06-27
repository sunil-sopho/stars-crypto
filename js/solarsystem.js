function makeOortCloud(){
	//	distance to oort cloud
	//		about 50,000 AU
	//	1 Astronomical Unit = 1.58128588 × 10^-5 light years
	//		50,0000 AU ~= 0.790642941 LY

	/*
	var dist = 0.790642941;
	var distrib = 0.1;
	var particlesGeo = new THREE.Geometry();
	for( var i=0; i<10000; i++ ){
		var x = random(-1,1);
		var y = random(-1,1);
		var z = random(-1,1);
		var vec = new THREE.Vector3(x,y,z);
		vec.setLength( dist );

		var multDistr = distrib;
		if( Math.random() > 0.98 )
			multDistr = Math.pow( multDistr, 1 + Math.random() * 6)

		vec.x += random(-multDistr,multDistr);
		vec.y += random(-multDistr,multDistr);
		vec.z += random(-multDistr,multDistr);
		particlesGeo.vertices.push( vec );
	}

	var material = new THREE.ParticleBasicMaterial({color:0x333333, size: 0.1});
	var particles = new THREE.ParticleSystem( particlesGeo, material );
	*/

	var count = 10000;
	var dist = 0.790642941;
	var distrib = 0.1;

	var particlesGeo = new THREE.BufferGeometry();
	particlesGeo.attributes = {
		position: {
			itemSize: 3,
			array: new Float32Array( count * 3 ),
			numItems: count * 3
		}
	};

	var vector = new THREE.Vector3();
	var positions = particlesGeo.attributes.position.array;

	for( var i=0; i<positions.length; i+=3 ){
		vector.x = random(-1,1);
		vector.y = random(-1,1);
		vector.z = random(-1,1);
		vector.setLength( dist );

		var multDistr = distrib;
		if( Math.random() > 0.98 )
			multDistr = Math.pow( multDistr, 1 + Math.random() * 6)

		vector.x += random(-multDistr,multDistr);
		vector.y += random(-multDistr,multDistr);
		vector.z += random(-multDistr,multDistr);
		positions[i] = vector.x;
		positions[i+1] = vector.y;
		positions[i+2] = vector.z;
	}

	particlesGeo.computeBoundingSphere();

	var material = new THREE.ParticleBasicMaterial({color:0x333333, size: 0.1});
	var particles = new THREE.ParticleSystem( particlesGeo, material );

	var oortInfo = new THREE.Gyroscope();
	oortInfo.name = "";
	oortInfo.position.set( dist, -dist , 0 );
	oortInfo.scale.setLength( 0.1 );
	attachLegacyMarker( "", oortInfo, 1.0, {min:40.0, max: 500.0}  );

	particles.add( oortInfo );

	return particles;
}

function makeKuiperBelt(){
	//	distance to kuiper belt
	//		about 30-50 AU, we'll say it's about 40
	//	1 Astronomical Unit = 1.58128588 × 10^-5 light years
	//		40 AU ~= 0.000632514353 LY

	var dist = 0.000632514353;
	// var 
}

function makeSolarSystem(){
	var solarSystem = new THREE.Object3D();
	// makeSys1(solarSystem)
	// makeSys2(solarSystem)
	makeSys3(solarSystem)

	// var oortCloud = makeOortCloud();
	// solarSystem.add( oortCloud );

	// var kuiperBelt = makeKuiperBelt();
	// solarSystem.add( kuiperBelt );

	

	// var solarSystemSphere = new THREE.Mesh( new THREE.SphereGeometry(0.790642941) );
	// solarSystem.add( solarSystemSphere );		

	// sun = makeSun(
	// 	{
	// 		radius: 7.35144e-8
	// 	}
	// );

	// sun.configure(
	// {
		
	// });

	// solarSystem.add( sun );

	// represent the orbit path of planetry bodies in the solar system
	//	use kilometers and convert to light years
	//	mercury
	

	// // attachLegacyMarker( "", mercury, 1.0, {min:3.4, max: 8.0} );	

	// //	jupiter
	// solarSystem.add( createSpaceRadius( KMToLY(778000000), /*0xCE6747*/ 0xffffff ) );
	// var jupiter = createPlanet( 778000000, 71492.2 );
	// solarSystem.add( jupiter );
	// attachLegacyMarker( "", jupiter, 1.0, {min:8.0, max: 17.2} );

	// //	saturn
	// solarSystem.add( createSpaceRadius( KMToLY(1400000000), /*0xCE6747*/ 0xffffff ) );
	// var saturn = createPlanet( 1400000000, 60268 );
	// solarSystem.add( saturn );
	// attachLegacyMarker( "", saturn, 1.0, {min:8.0, max: 17.6} );

	// //	uranus
	// solarSystem.add( createSpaceRadius( KMToLY(3000000000), /*0xCE6747*/ 0xffffff ) );
	// var uranus = createPlanet( 3000000000, 25559 );
	// solarSystem.add( uranus );
	// attachLegacyMarker( "", uranus, 1.0, {min:8.0, max: 18.0} );

	// //	neptune
	// solarSystem.add( createSpaceRadius( KMToLY(4500000000), /*0xCE6747*/ 0xffffff ) );
	// var neptune = createPlanet( 4500000000, 24764  );
	// solarSystem.add( neptune );
	// attachLegacyMarker( "", neptune, 1.0, {min:8.0, max: 20.0} );

	solarSystem.dynamic = true;

	var measurement = createDistanceMeasurement( new THREE.Vector3( 0,0,0 ), new THREE.Vector3( 1,0,0 ) );
	measurement.position.y = 0.08;
	measurement.update = function(){
		if( camera.position.z > 120 && camera.position.z < 400 ){
			this.visible = true;
		}
		else{
			this.visible = false;
		}
	}
	// measurement.visible = true;
	var sub = new THREE.Object3D();
	sub.position.x = 0.5;
	sub.position.y = 0.08;
	measurement.add( sub );
	// solarSystem.update = function(){
	// 	if( camera.position.z > 120 && camera.position.z < 200 ){
	// 		this.visible = false;
	// 	}
	// 	else{
	// 		this.visible = false;
	// 	}
	// }
	// solarSystem.visible=false;
	// for( var i in solarSystem.children){
	// 	solarSystem.children[i].visible = false;
	// 	console.log(solarSystem[i])
	// }
	// console.log(solarSystem)
	// attachLegacyMarker( "One light year.", sub, 1.0, {min:120, max: 400} );
	// solarSystem.add( measurement );	

	//	pioneer
	//	18220700000 KM out

	// oortCloud.update = function(){
	// 	if( camera.position.z > 40 && camera.position.z < 600 )
	// 		this.visible = true;
	// 	else
	// 		this.visible = false;
	// }

	//makeSunEarthDiagram();

	//	pluto?
	//	still not a planet	
	return solarSystem;
}

function createPlanet( distanceToSunKM, radiusKM ){
	var planetGeo = new THREE.SphereGeometry( 1000*KMToLY( radiusKM ), 12, 8 );
	var planet = new THREE.Mesh( planetGeo );
	planet.position.x = KMToLY(distanceToSunKM);
	return planet;	
}


function makeSys1(solarSystem){
	var scale = 1e-5;
	var val = 1e-5;


	var model = new Sun({
		radius: 1*scale,
		spectral: 0.656,
		distance : 100*scale,
		theta : 0,
		phi : 0,
		center : {X : 0, Y : 0, Z : -200*scale},
		color : 0,
		rotationSpeed : {theta : 0.01, phi : 0}
	});

	var model2 = new Sun({
		radius: 1*scale,
		spectral: 0.1,
		distance : 100*scale,
		theta : Math.PI,
		phi : 0,
		color : 1,
		center : {X : 0, Y : 0, Z : -200*scale},
		rotationSpeed : {theta : 0.01, phi : 0}
	});

	var model3 = new Sun({
		radius: 1.5*scale,
		spectral: 0.3,
		distance : 0,
		theta : 0,
		phi : 0,
		color : 2,
		center : {X : 0, Y : 0, Z : 200*scale},
		rotationSpeed : {theta : 0.01, phi : 0}
	});

	solarSystem.add(model.sun);
	solarSystem.add(model2.sun);
	solarSystem.add(model3.sun);

	// stars.push(model.sun);
	// stars.push(model2.sun);
	// stars.push(model3.sun);

}

function makeSys2(solarSystem){
	var scale = 1e-5;
	var val = 1e-5;
	for(var i = 0; i<6; i++){
		planet = new Planet({
			distance : {X : 200*val, Y : 200*val, Z : 200*val},
			theta : i * 2 * Math.PI / 6,
			phi : 15,
			size : 10*val, 
			name : "SHREY", 
			owner : "SHREY", 
			image : "sun_surface.png", 
			index : i,
			rotationSpeed : {theta : 0.01, phi : 0},
			center : {X: 0, Y: 0, Z: -200*val}
		});
		solarSystem.add(planet.sphere);
		solarSystem.add(planet.displayPlanet);
		// planets.push(planet.displayPlanet);
	}

	for(var i = 0; i<4; i++){
		planet = new Planet({
			distance : {X : 100*val, Y : 100*val, Z : 100*val},
			phi : 0,
			theta : i*2*Math.PI/4,
			size : 10*val, 
			name : "SHREY", 
			owner : "SHREY", 
			image : "000.jpg", 
			index : i+6,
			rotationSpeed : {theta : 0.01, phi : 0},
			center : {X: 0, Y: 0, Z: 200*val}
		});
		solarSystem.add(planet.sphere);
		solarSystem.add(planet.displayPlanet);
		// planets.push(planet.displayPlanet);
	}

	for(var i = 0; i<2; i++){
		planet = new Planet({
			distance : {X : 0*val, Y : 250*val, Z : 500*val},
			theta : i*2*Math.PI/2,
			phi : 180,
			size : 10*val, 
			name : "SHREY", 
			owner : "SHREY", 
			image : "000.jpg", 
			index : i+10,
			rotationSpeed : {theta : 0.01, phi : 0},
			center : {X: 0*val, Y: 0*val, Z: 0*val}
		});
		solarSystem.add(planet.sphere);
		solarSystem.add(planet.displayPlanet);
		// planets.push(planet.displayPlanet);
	}
}

function makeSys3(solarSystem){

	// first orbit for planets 5
	var mercuryOrbit = createSpaceRadius( 3*KMToLY(55000000), /*0x90745D*/ 0xffffff );
	solarSystem.add( mercuryOrbit );
	//	second orbit 3 stars
	var venusOrbit = createSpaceRadius( 3*KMToLY(108000000), /*0x9E4738*/ 0xffffff );
	venusOrbit.name="venus";
	solarSystem.add( venusOrbit );
	//don't need this right now	
	// var earthOrbit = createSpaceRadius( KMToLY(150000000), 0x887F98 0xffffff );
	// solarSystem.add( earthOrbit );
	//	Third Radius for 7 planets
	solarSystem.add( createSpaceRadius( 3*KMToLY(230000000), /*0xCE6747*/ 0xffffff ) );	

	var thetaa = 0
	// two different parameterto be passed to function for make planet and make sun
	var obj = {
			radius: 7.35144e-7,
			spectral: 0.656,
			color:{
				r: 1.7,
				g: 69,
				b: 45,
				p : -0.09,
				d : 35
			}
		};
	var obj2 = {
		radius: 7.35144e-7*2,
		spectral: 100.656,
		color:{
			r: 100.7,
			g: 100,
			b: 1.5,
			p : 0,
			d : 1
		}
	};
	// 5 Planets
	var plane = []
	// mercury.position.x = 3*KMToLY(55000000);
	for( var i =0;i<5;i++){
		plane[i] = makePlanet(obj)
		thetaa += 1/5;
		plane[i].position.z = Math.sin(Math.PI * 2 *thetaa)*3*KMToLY(55000000);
		plane[i].position.x = Math.cos(Math.PI * 2 *thetaa)*3*KMToLY(55000000);
		solarSystem.add( plane[i]);
	}

	// 3 Stars
	// var venus = createPlanet( 108000000, 6051.8 );
	var plane2 = []
	// mercury.position.x = 3*KMToLY(55000000);
	for( var i =0;i<3;i++){
		plane2[i] = makeSun(obj2)
		thetaa += 1/3;
		plane2[i].position.z = Math.sin(Math.PI * 2 *thetaa)*3*KMToLY(108000000);
		plane2[i].position.x = Math.cos(Math.PI * 2 *thetaa)*3*KMToLY(108000000);
		solarSystem.add( plane2[i]);
	}
	// attachLegacyMarker( "", venus, 1.0, {min:3.6, max: 8.2} );	
	var plane3=[]
	thetaa = 0
	for( var i =0;i<7;i++){
		plane3[i] = makePlanet(obj)
		thetaa += 1/7;
		plane3[i].position.z = Math.sin(Math.PI * 2 *thetaa)*3*KMToLY(230000000);
		plane3[i].position.x = Math.cos(Math.PI * 2 *thetaa)*3*KMToLY(230000000);
		solarSystem.add( plane3[i]);
	}

	// greeen disk
	var color = new THREE.Color( 0xff0000 );
	var fog1 = new THREE.Fog(color,0.1,10000)
	solarSystem.add(fog1)
	var diskGeometry1 = [];
	var diskMaterial1 = [];
	var disk1 = [];
	var disks = []
	for(var hj = 0 ;hj<1000;hj++){
		diskGeometry1.push(new THREE.RingGeometry( 3*KMToLY(100000000 + 30*hj*10000), 3*KMToLY(108000000 +30*(hj+1)*10000), 32 ));
		if(hj < 500){
			if(hj%2)
			diskMaterial1.push(new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.DoubleSide,transparent:true,opacity: Math.min((hj*hj)/(10000*(1000-hj)),0.0025) } ));
			else
			diskMaterial1.push(new THREE.MeshBasicMaterial( { color: 0x0000ff, side: THREE.DoubleSide,transparent:true,opacity: Math.min((hj*hj)/(10000*(1000-hj)),0.0025) } ));

		}
		else{
			if(hj%2)
			diskMaterial1.push(new THREE.MeshBasicMaterial( { color: 0x0000ff, side: THREE.DoubleSide,transparent:true,opacity: Math.min((1000-hj)*(1000-hj)/(10000*hj),0.0025) } ));
			else
			diskMaterial1.push(new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.DoubleSide,transparent:true,opacity: Math.min((1000-hj)*(1000-hj)/(10000*hj),0.0025) } ));

		}
		disk1.push(new THREE.Mesh( diskGeometry1[hj], diskMaterial1[hj] ));
		disk1[hj].rotation.x = Math.PI/2;
		// disks.push(disk1)
		solarSystem.add(disk1[hj])
	}

	// var diskGeometry2 = new THREE.RingGeometry( 3*KMToLY(108000000), 3*KMToLY(230000000), 32 );
	// var diskMaterial2 = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.DoubleSide,transparent:true,opacity: 0.1 } );
	// diskMaterial2.fog = true
	// var disk2 = new THREE.Mesh( diskGeometry2, diskMaterial2 );
	// disk2.rotation.x = Math.PI/2;
	// solarSystem.add(disk2)


	// var diskGeometry3 = new THREE.RingGeometry( 3*KMToLY(230000000), 3*KMToLY(260000000), 32 );
	// var diskMaterial3 = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.DoubleSide,transparent:true,opacity: 0.06 } );
	// var disk3 = new THREE.Mesh( diskGeometry3, diskMaterial3 );
	// disk3.rotation.x = Math.PI/2;
	// solarSystem.add(disk3)

}