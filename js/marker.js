var markers = [];
var markerThreshold = {
	min: 400,
	max: 1500
};

//	called by animate per frame
function updateMarkers(){
	for( var i in markers ){
		var marker = markers[i];
		marker.update();
	}
}

function attachMarker( obj, size ){
	var padding = 3;
	var line_height = 20;
	var title, extraData;
	var container = document.getElementById('css-camera');
	var template = document.getElementById( 'marker_template' );
	var marker = template.cloneNode(true);
	marker.$ = $(marker);	// jQuery reference


	//	strip out the apostrophe in names first before looking them up
	//	the same is done in the details data file already, as well as the star system lookup
	obj.name = obj.name.replace("'","");

	marker.obj = obj;
	marker.absPosition = obj.position;
	marker.size = size !== undefined ? size : 1.0;
	marker.id = obj.name;
	// marker.style.fontSize = 24 + 'px';	


	marker.spectralIndex = obj.spectralIndex;

	setDivPosition( marker, obj ,2000);

	var nameLayer = marker;

	//	get the formal name of the star	
	var system = starSystems[obj.name];

	if( system !== undefined ){
		var intoHTML = `
		<div class="name">`+system.name+`</div>
		<div class="c100 p0">
		  <div class="slice">		
			<div class="bar"></div>		
			<div class="fill"></div>		
		  </div>		
		</div>`
		nameLayer.innerHTML = intoHTML;
	}
	else{
		var intoHTML = `<div class="c100 p0">
		  <div class="slice">		
			<div class="bar"></div>		
			<div class="fill"></div>		
		  </div>		
		</div>`
		nameLayer.innerHTML = intoHTML;
	}

	//	because these stars appear in the db as named stars and they are so closely packed together
	//	we need to force them to be smaller font
	//	totally sucks :|
	//if( obj.name === "Proxima Centauri" || obj.name === "Rigel Kentaurus A" || obj.name === "Rigel Kentaurus B" )
	//	marker.style.fontSize = 10 + 'px';	

	//	let's not even do Alpha Centauri B here because it just leads to the same description
	//if( obj.name === "Rigel Kentaurus B" )
	//	return;

	if( obj.name === "Rigel Kentaurus A" )
		nameLayer.innerHTML = "Alpha Centauri";

	marker.defaultSize = marker.style.fontSize;

	var name = marker.id.toLowerCase();
	title = nameLayer.innerHTML;
	

  // console.log(name);
	var fileName = name.replace(/ /g,"_");
	// fileName = fileName.replace(/\'/g, "%27");
	var pathToDetail = encodeURI('detail/' + fileName + '.html');
	
  // console.log(pathToDetail);

	var obj_name = obj.name.match('°');

	if (obj_name && obj_name[0] == '°') {

		marker.$.addClass('label');

	} else {

		var extraData = function() {
			$.get(pathToDetail, function(data){

				var $body = $('#detailBody').html( data );

				$body.find('a').each(function(){
					var $this = $(this);
					ahref = $this.attr('href');
					var finalLink = 'http://en.wikipedia.org' + ahref;
					$this.attr( 'href', finalLink );
					$this.attr( 'target', 'blank' );
				});

				var $title = $('#detailTitle');
				$title.find('span').html( title );
				var $foot = $('#detailFooter');

				$('#detailContainer').fadeIn();
				$('#css-container').css('display', 'none');
				setTimeout(function() {
					var offset = $title.outerHeight() + $body.outerHeight() + $foot.outerHeight();
					$('#detailContainer').css({
						paddingTop: Math.max(($(window).height() - offset) / 2, line_height * 3) + 'px'
					});
				}, 0);

			});

		};


		var markerClick = function(e){

			// $iconNav.css({
			// 	display: 'none'
			// });

			var vec = marker.absPosition.clone();

			if (vec.length() !== 0 ) {
				window.showSunButton();
			} else {
				window.hideSunButton();
			}

			window.setMinimap(true);

			$starName.find('span').html(title);
			$starName[0].onclick = extraData;

			extraData();

			var isStarSystem = (system !== undefined);

			if( isStarSystem ){
				//	this also sets the scale, and thus the star radius
				// Call shrey System Api here with position
					var System1 = new System({
						number: 2,
						x: vec.x,
						y: vec.y,
						z: vec.z,
						scale: 0.00000001
					});
				rotating.add(System1.sys);
				// setStarModel( vec, marker.id );
				var modelScale = starModel.scale.length();

				// we use the radius to determine how much we're going to zoom and offset
				var zoomByStarRadius = getZoomByStarRadius( modelScale );
				zoomIn( zoomByStarRadius );

				var offset = getOffsetByStarRadius( modelScale );
				vec.add( offset );
			}

			//	set the star		
			centerOn( vec );

		};

		var markerTouch = function( e ){
			if( e.originalEvent.touches.length > 1 )
				return;
			markerClick( e );
		}

		marker.$.bind('click', markerClick );
		var intvl;
		marker.$.hover(function () {
			var timer = 0;
			var z = camera.position.z;
			console.log(z);
			$(this).find(".name").css("font-size",(z*z/10000) + 'px');
			if(z < 900) {
				$(this).find(".c100").css("font-size", (40 + 30*(z-380)/400)+'px');
			}
			intvl = setInterval(() => {
				if(timer < 100) {
					for(i=0 ; i<10; i++) {
					$(this).find(".c100").removeClass("p"+timer);
					timer = timer + 1;
					$(this).find(".c100").addClass("p"+timer);
				}
			}
		}, 1);

		},
		function () {
			var timer = 100;	
			clearInterval(intvl);		
			$(this).find(".c100").attr("class","c100 p100");			
			var intvl2 = setInterval(() => {
				if(timer > 0) {
					for(i=0 ; i<10; i++) {
						$(this).find(".c100").removeClass("p"+timer);
						timer = timer - 1;
						$(this).find(".c100").addClass("p"+timer);
					}
				}
				else {
					clearInterval(intvl2);
				}
			}, 1);
		});
		marker.$.bind('touchstart', markerTouch );

	}

	container.appendChild( marker );

	marker.setVisible = function ( vis ){
		if (vis) {
			this.style.opacity = 1.0;
		} else {
			this.style.opacity = 1.0;
		}
		// var isVisible = this.$.css('display') == 'none';
		// if ( !vis && isVisible ){
		// 	this.$.fadeOut();
		// } else if ( vis && !isVisible ) {
		// 	this.$.fadeIn();
		// }
		return this;
	};

	marker.select = function() {

		var vec = marker.absPosition.clone();

		if( enableStarModel == false )
			return;
		
		setStarModel( vec, marker.id );
		var modelScale = starModel.scale.length();

		// we use the radius to determine how much we're going to zoom and offset
		var zoomByStarRadius = getZoomByStarRadius(modelScale);
		// zoomIn( zoomByStarRadius );

		var title = nameLayer.innerHTML;
		var offset = getOffsetByStarRadius( modelScale );

		$starName.find('span').html(title);

		$starName[0].onclick = extraData;

		vec.add( offset );
		snapTo( vec );

	};

	marker.setSize = function( s ) {
		this.style.fontSize = s + 'px';
		this.style.lineHeight = s + 'px';
		this.style.marginTop = - (s + padding) / 2 + 'px';
	};

  var countryLayer = marker.querySelector( '#startText');
  marker.countryLayer = countryLayer;

	marker.update = function() {

		var s = (0.05 + camera.position.z / 2000) * this.size;
		s = constrain( s, 0, 1 );

		setDivPosition( this, this.obj, s ,camera.position.z);
		this.setVisible( camera.markersVisible );

	};
	
	// nameLayer.innerHTML = "TESTING TESTING TESTING";

	markers.push( marker );

}
