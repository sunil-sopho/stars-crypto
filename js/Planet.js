var Planet = function(options){
	this.geometry = new THREE.SphereGeometry(options.size, 32, 32);

	var texture = THREE.ImageUtils.loadTexture( "images/"+options.image, undefined, setLoadMessage("Igniting solar plasma") );

	this.material = new THREE.MeshPhongMaterial({
		color: 0xF66120,
		// emissive : 0xF66120,
		shininess: 10,
		shading: THREE.DoubleSide,
		transparent: true,
		opacity: 0.9,
		map : texture
    });
	
	this.sphere = new THREE.Mesh(this.geometry, this.material);
	this.sphere.position.x = options.center.X + options.distance.X * Math.sin(options.theta) * Math.cos(options.phi); 
	this.sphere.position.y = options.center.Y + options.distance.Y * Math.sin(options.theta) * Math.sin(options.phi); 
	this.sphere.position.z = options.center.Z + options.distance.Z * Math.cos(options.theta); 

	this.sphere.center = {X:0, Y:0, Z:0};

	this.sphere.center.X = options.center.X;
	this.sphere.center.Y = options.center.Y;
	this.sphere.center.Z = options.center.Z;

	this.sphere.userData = {position : {x : this.sphere.position.x, y : this.sphere.position.y, z : this.sphere.position.z}, name : options.name, owner : options.owner, image : options.image, index : options.index};

	this.sphere.theta = options.theta;
	this.sphere.rotationSpeed = options.rotationSpeed;
	this.sphere.distance = options.distance;
	this.sphere.phi = options.phi;

	this.displayPlanet = new THREE.Mesh(new THREE.SphereGeometry(options.size*4, 32, 32), this.material);
	this.displayPlanet.visible = true;

	// this.sphere.add(this.displayPlanet);

	this.displayPlanet.position.x = options.center.X + options.distance.X * Math.sin(options.theta) * Math.cos(options.phi);
	this.displayPlanet.position.y = options.center.Y + options.distance.Y * Math.sin(options.theta) * Math.sin(options.phi); 
	this.displayPlanet.position.z = options.center.Z + options.distance.Z * Math.cos(options.theta);
	this.displayPlanet.center = options.center;

	this.displayPlanet.theta = options.theta;
	this.displayPlanet.rotationSpeed = options.rotationSpeed;
	this.displayPlanet.distance = options.distance;
	this.displayPlanet.phi = options.phi;

	this.displayPlanet.tick = 0;

	this.sphere.update = function(){
		this.rotation.z += 0.002;
		this.rotation.y += 0.002;
		this.rotation.x += 0.002;

		this.theta += this.rotationSpeed.theta/10;
		this.phi += this.rotationSpeed.phi;

		this.position.x = this.center.X + this.distance.X * Math.sin(this.theta) * Math.cos(this.phi); 
		this.position.y = this.center.Y + this.distance.Y * Math.sin(this.theta) * Math.sin(this.phi); 
		this.position.z = this.center.Z + this.distance.Z * Math.cos(this.theta);
	}

	this.displayPlanet.update = function(){
		this.rotation.z += 0.002;
		this.rotation.y += 0.002;
		this.rotation.x += 0.002;

		// this.tick++;
		// if((this.tick/100)%2 == 0){
		// 	this.visible = true;
		// }
		// else{
		// 	this.visible = false;
		// }

		this.theta += this.rotationSpeed.theta/10;
		this.phi += this.rotationSpeed.phi;

		this.position.x = this.center.X + this.distance.X * Math.sin(this.theta) * Math.cos(this.phi); 
		this.position.y = this.center.Y + this.distance.Y * Math.sin(this.theta) * Math.sin(this.phi); 
		this.position.z = this.center.Z + this.distance.Z * Math.cos(this.theta);
	}
}