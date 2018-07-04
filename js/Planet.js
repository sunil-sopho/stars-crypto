function distance(x,y,z,x1,y1,z1){
	return Math.sqrt(Math.pow((x-x1),2) + Math.pow((y-y1),2) + Math.pow((z-z1),2));
}

var Planet = function(options){
	this.geometry = new THREE.SphereGeometry(options.size, 32, 32);

	var texture = THREE.ImageUtils.loadTexture( "images/"+options.image, undefined, setLoadMessage("Igniting solar plasma") );

	this.material = new THREE.MeshPhongMaterial({
		color: 0xF66120,
		// emissive : 0xF66120,
		shininess: 10,
		shading: THREE.DoubleSide,
		transparent: true,
		opacity: 1,
		map : texture
    });
	
	this.sphere = new THREE.Mesh(this.geometry, this.material);
	this.sphere.position.x = options.center.X + options.distance.X * Math.sin(options.theta) * Math.cos(options.phi); 
	this.sphere.position.y = options.center.Y + options.distance.Y * Math.sin(options.theta) * Math.sin(options.phi); 
	this.sphere.position.z = options.center.Z + options.distance.Z * Math.cos(options.theta); 

	this.sphere.index = options.index;

	this.sphere.center = {X:0, Y:0, Z:0};

	this.sphere.center.X = options.center.X;
	this.sphere.center.Y = options.center.Y;
	this.sphere.center.Z = options.center.Z;

	this.sphere.userData = {position : {x : this.sphere.position.x, y : this.sphere.position.y, z : this.sphere.position.z}, name : options.name, owner : options.owner, image : options.image, index : options.index};

	this.sphere.theta = options.theta;
	this.sphere.rotationSpeed = options.rotationSpeed;
	this.sphere.distance = options.distance;
	this.sphere.phi = options.phi;

	this.displayPlanet = new THREE.Mesh(new THREE.SphereGeometry(options.size*6, 32, 32), this.material);
	this.displayPlanet.visible = false;
	this.displayPlanet.userData = this.sphere.userData;

	this.sphere.displayPlanet = this.displayPlanet;
	var t = options.syst;
	// this.sphere.add(this.displayPlanet);

	this.sphere.update = function(){

		this.rotation.z += 0.002;
		this.rotation.y += 0.002;
		this.rotation.x += 0.002;
		//console.log(distance(this.position.x,this.position.y,this.position.z,this.position.x,-50,-28.868));
		this.theta += this.rotationSpeed.theta/1;
		this.phi += this.rotationSpeed.phi/1;
		//console.log(distance(this.position.x,this.position.y,this.position.z,this.position.x,50,-28.868));
		// this.position.x = this.center.X + this.distance.X * Math.cos(this.theta) ; 
		// this.position.y = this.center.Y + this.distance.Y * Math.sin(this.theta)* Math.sin(this.phi); 
		// this.position.z = this.center.Z + this.distance.Z * Math.sin(this.theta)* Math.cos(this.phi);
		var a = this.distance.X * Math.sin(this.theta)* Math.sin(this.phi);
		var b = this.distance.Y * Math.cos(this.theta); 
		var c = this.distance.Z * Math.sin(this.theta)* Math.cos(this.phi);
		var d;
		var e;
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
			else if(t==3){
				d = Math.cos(3*Math.PI/4);
				e = Math.cos(3*Math.PI/4);
			}
			else if(t==4){
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
			if(t==2 || t==5){ 
				d = Math.cos(Math.PI/3);
				e = Math.sin(Math.PI/3);
			}
			else if(t==3){
				d = Math.cos(Math.PI/4);
				e = Math.cos(Math.PI/4);
			}
			else if(t==4){
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
		else{
			this.position.x = this.center.X + a ;
			this.position.y = this.center.Y + b ;
			this.position.z = this.center.Z + c ;	
		}
		/*if(distance(this.position.x,this.position.y,this.position.z,this.position.x,50,-28.868) < 1 && this.index == 1){
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
		}*/
	}

	this.displayPlanet.update = function(){

	}
}