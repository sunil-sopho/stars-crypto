var System = function(options){
	this.sys= new THREE.Object3D();
	var a = options.x;
	var b = options.y;
	var c = options.z;
	var d = options.scale;
	if(options.number === 1){
		var model = new Sun({
			radius: 1*d,
			spectral: 0.1,
			distance : 0,
			theta : 0,
			phi : 0,
			center : {X : 0+a, Y : 0+b, Z : -1*115.473*d+c},
			color : 0,
			rotationSpeed : {theta : 0.01, phi : 0}
		});

		var model2 = new Sun({
			radius: 1*d,
			spectral: 0.1,
			distance : 0,
			theta : 0,
			phi : 0,
			color : 0,
			center : {X : 0+a, Y : -100*d+b, Z : c+d*115.473/2},
			rotationSpeed : {theta : 0.01, phi : 0}
		});

		var model3 = new Sun({
			radius: 1*d,
			spectral: 0.1,
			distance : 0,
			theta : 0,
			phi : 0,
			color : 0,
			center : {X : a+0, Y : b+d*100, Z : c+d*115.473/2},
			rotationSpeed : {theta : 0.01, phi : 0}
		});

		var model4 = new Sun({
			radius: 1*d,
			spectral: 0.1,
			distance : 0,
			theta : 0,
			phi : 0,
			color : 0,
			center : {X : a+0, Y : b+0, Z : c+0},
			rotationSpeed : {theta : 0.01, phi : 0}
		});

		this.sys.add(model.sun);
		this.sys.add(model2.sun);
		this.sys.add(model3.sun);
		this.sys.add(model4.sun);
		// stars.push(model.sun);
		// stars.push(model2.sun);
		// stars.push(model3.sun);
		// stars.push(model4.sun);

		for(var i = 0; i<4; i++){
			planet = new Planet({
				distance : {X : 100*d, Y : 100*d, Z : 100*d},
				theta : i * 2 * Math.PI / 6 + Math.PI,
				phi : 0,
				syst: options.number,
				size : 10*d, 
				name : "SHREY", 
				owner : "SHREY", 
				image : "shindey.png", 
				index : 1,
				rotationSpeed : {theta : 0.01, phi : 0},
				center : {X: a+0, Y: b+0, Z: (-115.473*d) +c}
			});
			this.sys.add(planet.sphere);
			// planets.push(planet.displayPlanet);
		}
		for(var i = 0; i<4; i++){
			planet = new Planet({
				distance : {X : 100*d, Y : 100*d, Z : 100*d},
				theta : i * 2 * Math.PI / 6 + Math.PI/3,
				phi : 0,
				syst: options.number,
				size : 10*d, 
				name : "SHREY", 
				owner : "SHREY", 
				image : "shindey2.png", 
				index : 3,
				rotationSpeed : {theta : 0.01, phi : 0},
				center : {X: a+0, Y: -100*d+b, Z: c+d*115.473/2}
			});
			this.sys.add(planet.sphere);
			// planets.push(planet.displayPlanet);
		}
			for(var i = 0; i<4; i++){
			planet = new Planet({
				distance : {X : 100*d, Y : 100*d, Z : 100*d},
				theta : i * 2 * Math.PI /6 + 5*Math.PI/3,
				phi : 0,
				syst: options.number,
				size : 10*d, 
				name : "SHREY", 
				owner : "SHREY", 
				image : "sun_surface.png", 
				index : 2,
				rotationSpeed : {theta : 0.01, phi : 0},
				center : {X: a+0, Y: b+100*d, Z: c+d*115.473/2}
			});
			this.sys.add(planet.sphere);
			// planets.push(planet.displayPlanet);
		}
	}
	else if(options.number === 2){
		var model = new Sun({
			radius: 1*d,
			spectral: 0.1,
			distance : 0,
			theta : 0,
			phi : 0,
			center : {X : a+0, Y : b+0, Z : -1*115.473*d+c},
			color : 0,
			rotationSpeed : {theta : 0.01, phi : 0}
		});

		var model2 = new Sun({
			radius: 1*d,
			spectral: 0.1,
			distance : 0,
			theta : 0,
			phi : 0,
			color : 0,
			center : {X : a+0, Y : -100*d+b, Z : c+d*115.473/2},
			rotationSpeed : {theta : 0.01, phi : 0}
		});

		var model3 = new Sun({
			radius: 1*d,
			spectral: 0.1,
			distance : 0,
			theta : 0,
			phi : 0,
			color : 0,
			center : {X : a+0, Y : b+d*100, Z : c+d*115.473/2},
			rotationSpeed : {theta : 0.01, phi : 0}
		});

		var model4 = new Sun({
			radius: 1*d,
			spectral: 0.1,
			distance : 0,
			theta : 0,
			phi : 0,
			color : 0,
			center : {X : a+0, Y : b+0, Z : c+0},
			rotationSpeed : {theta : 0.01, phi : 0}
		});

		this.sys.add(model.sun);
		this.sys.add(model2.sun);
		this.sys.add(model3.sun);
		this.sys.add(model4.sun);
		// stars.push(model.sun);
		// stars.push(model2.sun);
		// stars.push(model3.sun);
		// stars.push(model4.sun);

		for(var i = 0; i<3; i++){
			planet = new Planet({
				distance : {X : d*100, Y : d*100, Z : d*100},
				theta : i * 4 * Math.PI / 3 + Math.PI,
				phi : Math.PI/2,
				size : 10*d, 
				syst: options.number,
				name : "SHREY", 
				owner : "SHREY", 
				image : "shindey.png", 
				index : 1,
				rotationSpeed : {theta : 0.01, phi : 0},
				center : {X: a+0, Y: b+0, Z: -115.473*d+c}
			});
			this.sys.add(planet.sphere);
			// planets.push(planet.displayPlanet);
		}
		for(var i = 0; i<3; i++){
			planet = new Planet({
				distance : {X : 100*d, Y : 100*d, Z : 100*d},
				theta : i * 4 * Math.PI / 3 + Math.PI,
				phi : Math.PI/2,
				size : 10*d, 
				syst: options.number,
				name : "SHREY", 
				owner : "SHREY", 
				image : "shindey2.png", 
				index : 3,
				rotationSpeed : {theta : 0.01, phi : 0},
				center : {X: a+0, Y: -100*d+b, Z: c+d*115.473/2}
			});
			this.sys.add(planet.sphere);
			// planets.push(planet.displayPlanet);
		}
		for(var i = 0; i<3; i++){
			planet = new Planet({
				distance : {X : 100*d, Y : 100*d, Z : 100*d},
				theta : i * 4 * Math.PI / 3 + Math.PI,
				phi : Math.PI/2,
				size : 10*d, 
				name : "SHREY", 
				syst: options.number,
				owner : "SHREY", 
				image : "sun_surface.png", 
				index : 2,
				rotationSpeed : {theta : 0.01, phi : 0},
				center : {X: a+0, Y: b+d*100, Z: c+d*115.473/2}
			});
			this.sys.add(planet.sphere);
			// planets.push(planet.displayPlanet);
		}

		for(var i = 0; i<3; i++){
			planet = new Planet({
				distance : {X : d*250, Y : d*250, Z : d*250},
				theta : i * 4 * Math.PI / 3 + Math.PI,
				phi : 0 ,
				size : 10*d, 
				name : "SHREY", 
				owner : "SHREY", 
				syst: options.number,
				image : "sun_surface.png", 
				index : 2,
				rotationSpeed : {theta : 0.01, phi : 0.00},
				center : {X: a+0, Y: b+0, Z: c+0}
			});
			this.sys.add(planet.sphere);
			// planets.push(planet.displayPlanet);
		}
	}
	else if(options.number ===3){
		var model = new Sun({
			radius: 1*d,
			spectral: 0.1,
			distance : 0,
			theta : 0,
			phi : 0,
			center : {X : a+0, Y : b+d*100, Z : c+d*100},
			color : 0,
			rotationSpeed : {theta : 0.01, phi : 0}
		});

		var model2 = new Sun({
			radius: 1*d,
			spectral: 0.1,
			distance : 0,
			theta : 0,
			phi : 0,
			color : 0,
			center : {X : a+0, Y : b+d*100, Z : -100*d+c},
			rotationSpeed : {theta : 0.01, phi : 0}
		});

		var model3 = new Sun({
			radius: 1*d,
			spectral: 0.1,
			distance : 0,
			theta : 0,
			phi : 0,
			color : 0,
			center : {X : a+0, Y : -100*d+b, Z : 100*d+c},
			rotationSpeed : {theta : 0.01, phi : 0}
		});

		var model4 = new Sun({
			radius: 1*d,
			spectral: 0.1,
			distance : 0,
			theta : 0,
			phi : 0,
			color : 0,
			center : {X : a+0, Y : -100*d+b, Z : -100*d+c},
			rotationSpeed : {theta : 0.01, phi : 0}
		});
		this.sys.add(model.sun);
		this.sys.add(model2.sun);
		this.sys.add(model3.sun);
		this.sys.add(model4.sun);
		//translating.add(model2.sun);
		//translating.add(model3.sun);
		//translating.add(model4.sun);
		// stars.push(model.sun);
		// stars.push(model2.sun);
		// stars.push(model3.sun);
		// stars.push(model4.sun);

		for(var i = 0; i<2; i++){
			planet = new Planet({
				distance : {X : 100*d, Y : 100*d, Z : 100*d},
				theta : i  * Math.PI ,
				phi : Math.PI/2,
				size : 10*d, 
				name : "SHREY", 
				syst: options.number,
				owner : "SHREY", 
				image : "shindey.png", 
				index : 3,
				rotationSpeed : {theta : 0.01, phi : 0},
				center : {X: a+0, Y: b+d*100, Z: c+d*100}
			});
			this.sys.add(planet.sphere);
			//translating.add(planet.sphere);
			// planets.push(planet.displayPlanet);
		}
		for(var i = 0; i<2; i++){
			planet = new Planet({
				distance : {X : 100*d, Y : 100*d, Z : 100*d},
				theta : i  * Math.PI  + Math.PI,
				phi : Math.PI/2,
				size : 10*d, 
				name : "SHREY", 
				syst: options.number,
				owner : "SHREY", 
				image : "sun_surface.png", 
				index : 3,
				rotationSpeed : {theta : 0.01, phi : 0},
				center : {X: a+0, Y: -100*d+b, Z: -100*d+c}
			});
			this.sys.add(planet.sphere);
			//translating.add(planet.sphere);
			// planets.push(planet.displayPlanet);
		}
		for(var i = 0; i<2; i++){
			planet = new Planet({
				distance : {X : 100*d, Y : 100*d, Z : 100*d},
				theta : i  * Math.PI + Math.PI/2 ,
				phi : Math.PI/2,
				size : 10*d, 
				name : "SHREY", 
				syst: options.number,
				owner : "SHREY", 
				image : "shindey2.png", 
				index : 2,
				rotationSpeed : {theta : 0.01, phi : 0},
				center : {X: a+0, Y: 100*d+b, Z: -100*d+c}
			});
			this.sys.add(planet.sphere);
			//translating.add(planet.sphere);
			// planets.push(planet.displayPlanet);
		}
		for(var i = 0; i<2; i++){
			planet = new Planet({
				distance : {X : 100*d, Y : 100*d, Z : 100*d},
				theta : i  * Math.PI + 3*Math.PI/2 ,
				phi : Math.PI/2,
				size : 10*d, 
				syst: options.number,
				name : "SHREY", 
				owner : "SHREY", 
				image : "shindey.png", 
				index : 2,
				rotationSpeed : {theta : 0.01, phi : 0},
				center : {X: a+0, Y: -100*d+b, Z: 100*d+c}
			});
			this.sys.add(planet.sphere);
			//translating.add(planet.sphere);
			// planets.push(planet.displayPlanet);
		}

			for(var i = 0; i<4; i++){
			planet = new Planet({
				distance : {X : 300*d, Y : 300*d, Z : 300*d},
				theta : i * 2 * Math.PI / 4 ,
				phi : 0,
				size : 10*d, 
				syst: options.number,
				name : "SHREY", 
				owner : "SHREY", 
				image : "sun_surface.png", 
				index : 1,
				rotationSpeed : {theta : 0.01, phi : 0},
				center : {X: a+0, Y: b+0, Z: c+0}
			});
			this.sys.add(planet.sphere);
			//translating.add(planet.sphere);
			// planets.push(planet.displayPlanet);
		}
	}
	else if(options.number == 4){
		var model = new Sun({
			radius: 1*d,
			spectral: 0.1,
			distance : 0,
			theta : 0,
			phi : 0,
			center : {X : a+0, Y : b+0, Z : -100*d+c},
			color : 0,
			rotationSpeed : {theta : 0.01, phi : 0}
		});

		var model2 = new Sun({
			radius: 1*d,
			spectral: 0.1,
			distance : 0,
			theta : 0,
			phi : 0,
			color : 0,
			center : {X : a+0, Y : b+0, Z : -200*d+c},
			rotationSpeed : {theta : 0.01, phi : 0}
		});

		var model3 = new Sun({
			radius: 1*d,
			spectral: 0.1,
			distance : 0,
			theta : 0,
			phi : 0,
			color : 0,
			center : {X : a+0, Y : b+0, Z : c+0},
			rotationSpeed : {theta : 0.01, phi : 0}
		});

		var model4 = new Sun({
			radius: 1*d,
			spectral: 0.1,
			distance : 0,
			theta : 0,
			phi : 0,
			color : 0,
			center : {X : a+0, Y : b+0, Z : c+d*100},
			rotationSpeed : {theta : 0.01, phi : 0}
		});

		this.sys.add(model.sun);
		this.sys.add(model2.sun);
		this.sys.add(model3.sun);
		this.sys.add(model4.sun);
		// stars.push(model.sun);
		// stars.push(model2.sun);
		// stars.push(model3.sun);
		// stars.push(model4.sun);

		for(var i = 0; i<2; i++){
			planet = new Planet({
				distance : {X : 100*d, Y : 100*d, Z : d*100},
				theta : i  * Math.PI  + Math.PI/2,
				phi : Math.PI/2,
				size : 10*d, 
				syst: options.number,
				name : "SHREY", 
				owner : "SHREY", 
				image : "shindey.png", 
				index : 1,
				rotationSpeed : {theta : 0.01, phi : 0},
				center : {X: a+0, Y: b+0, Z: -200*d+c}
			});
			this.sys.add(planet.sphere);
			// planets.push(planet.displayPlanet);
		}
		for(var i = 0; i<2; i++){
			planet = new Planet({
				distance : {X : d*100, Y : d*100, Z : d*100},
				theta : i  * Math.PI  + Math.PI,
				phi : Math.PI/2,
				size : 10*d, 
				syst: options.number,
				name : "SHREY", 
				owner : "SHREY", 
				image : "sun_surface.png", 
				index : 3,
				rotationSpeed : {theta : 0.01, phi : 0},
				center : {X: a+0, Y: b+0, Z: -100*d+c}
			});
			this.sys.add(planet.sphere);
			// planets.push(planet.displayPlanet);
		}
		for(var i = 0; i<2; i++){
			planet = new Planet({
				distance : {X : 100*d, Y : 100*d, Z : d*100},
				theta : i  * Math.PI + Math.PI/2 ,
				phi : Math.PI/2,
				syst: options.number,
				size : 10*d, 
				name : "SHREY", 
				owner : "SHREY", 
				image : "shindey2.png", 
				index : 2,
				rotationSpeed : {theta : 0.01, phi : 0},
				center : {X: a+0, Y: b+0, Z: c+0}
			});
			this.sys.add(planet.sphere);
			// planets.push(planet.displayPlanet);
		}
		for(var i = 0; i<2; i++){
			planet = new Planet({
				distance : {X : 100*d, Y : 100*d, Z : 100*d},
				theta : i  * Math.PI + Math.PI ,
				phi : Math.PI/2,
				syst: options.number,
				size : 10*d, 
				name : "SHREY", 
				owner : "SHREY", 
				image : "shindey.png", 
				index : 1,
				rotationSpeed : {theta : 0.01, phi : 0},
				center : {X: a+0, Y: b+0, Z: 100*d+c}
			});
			this.sys.add(planet.sphere);
			// planets.push(planet.displayPlanet);
		}

		for(var i = 0; i<4; i++){
			planet = new Planet({
				distance : {X : 0, Y : 200*d, Z : 350*d},
				theta : i * 2 * Math.PI / 4 ,
				phi : 0,
				syst: options.number,
				size : 10*d, 
				name : "SHREY", 
				owner : "SHREY", 
				image : "sun_surface.png", 
				index : 1,
				rotationSpeed : {theta : 0.01, phi : 0},
				center : {X: a+0, Y: b+0, Z: -50*d+c}
			});
			this.sys.add(planet.sphere);
			// planets.push(planet.displayPlanet);
		}
	}
	else if(options.number==5){
		var model = new Sun({
			radius: 1*d,
			spectral: 0.1,
			distance : 0,
			theta : 0,
			phi : 0,
			center : {X : a+0, Y : b+0, Z : -1*115.473*d+c},
			color : 0,
			rotationSpeed : {theta : 0.01, phi : 0}
		});

		var model2 = new Sun({
			radius: 1*d,
			spectral: 0.1,
			distance : 0,
			theta : 0,
			phi : 0,
			color : 0,
			center : {X : a+0, Y : -100*d+b, Z : c+d*115.473/2},
			rotationSpeed : {theta : 0.01, phi : 0}
		});

		var model3 = new Sun({
			radius: 1*d,
			spectral: 0.1,
			distance : 0,
			theta : 0,
			phi : 0,
			color : 0,
			center : {X : a, Y : b+d*100, Z : c+d*115.473/2},
			rotationSpeed : {theta : 0.01, phi : 0}
		});

		var model4 = new Sun({
			radius: 1*d,
			spectral: 0.1,
			distance : 0,
			theta : 0,
			phi : 0,
			color : 0,
			center : {X : a+d*163.280, Y : b+0, Z : c+0},
			rotationSpeed : {theta : 0.01, phi : 0}
		});

		this.sys.add(model.sun);
		this.sys.add(model2.sun);
		this.sys.add(model3.sun);
		this.sys.add(model4.sun);
		// stars.push(model.sun);
		// stars.push(model2.sun);
		// stars.push(model3.sun);
		// stars.push(model4.sun);

		for(var i = 0; i<2; i++){
			planet = new Planet({
				distance : {X : 100*d, Y : 100*d, Z : 100*d},
				theta : i  * Math.PI,
				phi : Math.PI/2,
				size : 10*d, 
				syst: options.number,
				name : "SHREY", 
				owner : "SHREY", 
				image : "shindey.png", 
				index : 1,
				rotationSpeed : {theta : 0.01, phi : 0},
				center : {X: a+0, Y: b+0, Z: -115.473*d+c}
			});
			this.sys.add(planet.sphere);
			// planets.push(planet.displayPlanet);
		}
			for(var i = 0; i<2; i++){
			planet = new Planet({
				distance : {X : 100*d, Y : 100*d, Z : 100*d},
				theta : i * Math.PI  + Math.PI,
				phi : Math.PI/2,
				syst: options.number,
				size : 10*d, 
				name : "SHREY", 
				owner : "SHREY", 
				image : "shindey2.png", 
				index : 3,
				rotationSpeed : {theta : 0.01, phi : 0},
				center : {X: a+0, Y: -100*d+b, Z: c+d*115.473/2}
			});
			this.sys.add(planet.sphere);
			// planets.push(planet.displayPlanet);
		}
			for(var i = 0; i<2; i++){
			planet = new Planet({
				distance : {X : d*100, Y : d*100, Z : d*100},
				theta : i * Math.PI  + Math.PI/2,
				phi : Math.PI/2,
				size : 10*d, 
				name : "SHREY", 
				syst: options.number,
				owner : "SHREY", 
				image : "sun_surface.png", 
				index : 2,
				rotationSpeed : {theta : 0.01, phi : 0},
				center : {X: a+0, Y: 100*d+b, Z: c+d*115.473/2}
			});
			this.sys.add(planet.sphere);
			// planets.push(planet.displayPlanet);
		}

		for(var i = 0; i<2; i++){
			planet = new Planet({
				distance : {X : 100*d, Y : 100*d, Z : d*100},
				theta : i * Math.PI + Math.PI,
				phi : 0 ,
				size : 10*d, 
				syst: options.number,
				name : "SHREY", 
				owner : "SHREY", 
				image : "sun_surface.png", 
				index : 1,
				rotationSpeed : {theta : 0.01, phi : 0.00},
				center : {X: 163.280*d+a, Y: b+0, Z: c+0}
			});
			this.sys.add(planet.sphere);
			// planets.push(planet.displayPlanet);
		}

		for(var i = 0; i<4; i++){
			planet = new Planet({
				distance : {X : 300*d, Y : 300*d, Z : 300*d},
				theta : i * Math.PI/2 + Math.PI,
				phi : 0 ,
				size : 10*d,
				syst: options.number, 
				name : "SHREY", 
				owner : "SHREY", 
				image : "sun_surface.png", 
				index : 1,
				rotationSpeed : {theta : 0.01, phi : 0.00},
				center : {X: a+d*163.280/4, Y: b+0, Z: c+0}
			});
			this.sys.add(planet.sphere);
			// planets.push(planet.displayPlanet);
		}
	}
}