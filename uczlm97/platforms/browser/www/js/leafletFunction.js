var client;
var earthquakes;
var earthquakelayer;
var busstoplayer;
var xhrFormData;

function addPointLinePoly()
{
	// add a point
	L.marker([51.5, -0.09]).addTo(mymap)
	.bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();
	// add a circle
	L.circle([51.508, -0.11], 500, {
		color: 'red',
		fillColor: '#f03',
		fillOpacity: 0.5
	}).addTo(mymap).bindPopup("I am a circle.");
	// add a polygon with 3 end points (i.e. a triangle)
	var myPolygon = L.polygon([
		[51.509, -0.08],
		[51.503, -0.06],
		[51.51, -0.047]
		],{
			color: 'red',
			fillColor: '#f03',
			fillOpacity: 0.5
		}).addTo(mymap).bindPopup("I am a polygon.");
}

	function loadEarthquakeData() 
	{
		// call the getEarthquakes code
		// keep the alert message so that we know something is happening
		alert("Loading Earthquakes");
		getData("earthquakes");
	}

	function removeEarthquakeData() 
	{
		alert("Earthquake data will be removed");
		mymap.removeLayer( earthquakelayer );
	}

	function loadBusstops() 
	{
		alert("Busstops data will be loaded");
		getData("busstops")
	}

	function removeBusstops() 
	{
		alert("Busstops data will be removed");
		mymap.removeLayer( busstoplayer );
	}	

	// create the code to get the data using an XMLHttpRequest
	function getData(layername) 
	{
		client = new XMLHttpRequest();
		// depending on the layername we get different URLs
		var url;
		if (layername =="earthquakes") 
		{
			url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
		}
		if (layername == "busstops") 
		{
			url = "https://developer.cege.ucl.ac.uk:31089/CEGE0043-materialdesignlite/uczlm97/www/busstops.geojson"
		}
		client.open('GET',url);
		client.onreadystatechange = dataResponse;
		client.send();
	}
	// create the code to wait for the response from the data server, and process the response once it is received
	function dataResponse() 
	{
		// this function listens out for the server to say that the data is ready - i.e. has state 4
		if (client.readyState == 4) 
		{
			// once the data is ready, process the data
			var geoJSONData = client.responseText;
			loadLayer(geoJSONData);
		}
	}
	// convert the received data - which is text - to JSON format and add it to the map
	function loadLayer(geoJSONData) 
	{
		// which layer did we actually load?
		if (geoJSONData.indexOf("earthquake") > 0) 
		{
			var loadingEarthquakes = true;
		}
		if (geoJSONData.indexOf("IIT_METHOD") > 0) 
		{
			var loadingBusstops = true;
		}
		// convert the text to JSON
		var json = JSON.parse(geoJSONData);
		// add the JSON layer onto the map - it will appear using the default icons
		if (loadingEarthquakes === true)
		{
			earthquakelayer = L.geoJson(json).addTo(mymap);
			mymap.fitBounds(earthquakelayer.getBounds());
		}
		if (loadingBusstops === true)
		{
			busstoplayer = L.geoJson(json).addTo(mymap);
			mymap.fitBounds(busstoplayer.getBounds());
		}
	}

/*var earthquakelayer;
// create the code to get the Earthquakes data using an XMLHttpRequest
function getEarthquakes() 
{
	client = new XMLHttpRequest();
	client.open('GET','https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson');
	client.onreadystatechange = earthquakeResponse; 
	client.send();
}
// create the code to wait for the response from the data server, and process the response once it is received
function earthquakeResponse() 
{
	// this function listens out for the server to say that the data is ready - i.e. has state 4
	if (client.readyState == 4) 
	{
		// once the data is ready, process the data
		var earthquakedata = client.responseText;
		loadEarthquakelayer(earthquakedata);
	}
}

// define a global variable to hold the layer so that we can use it later on
var earthquakelayer;
var testMarkerRed = L.AwesomeMarkers.icon({
	icon: 'play',
	markerColor: 'red'
});
var testMarkerPink = L.AwesomeMarkers.icon({
	icon: 'play',
	markerColor: 'pink'
});

// convert the received data - which is text - to JSON format and add it to the map
function loadEarthquakelayer(earthquakedata) 
{
	// convert the text received from the server to JSON
	var earthquakejson = JSON.parse(earthquakedata );
	// load the geoJSON layer
	earthquakelayer = L.geoJson(earthquakejson,{
		// use point to layer to create the points
		pointToLayer: function (feature, latlng){
			// look at the GeoJSON file - specifically at the properties - to see the earthquake magnitude and use a different marker depending on this value
			// also include a pop-up that shows the place value of the earthquakes
			if (feature.properties.mag > 1.75) {
				return L.marker(latlng, {icon:testMarkerRed}).bindPopup("<b>"+feature.properties.place
					+"</b>");
			}
			else {
					// magnitude is 1.75 or less
					return L.marker(latlng, {icon:testMarkerPink}).bindPopup("<b>"+feature.properties.place
						+"</b>");;
				}
			},
		}).addTo(mymap);
	mymap.fitBounds(earthquakelayer.getBounds());
}

function loadEarthquakelayer(earthquakedata) 
{
	// convert the text to JSON
	var earthquakejson = JSON.parse(earthquakedata);
	earthquakes=earthquakejson;
	// add the JSON layer onto the map - it will appear using the default icons
	earthquakelayer = L.geoJson(earthquakejson).addTo(mymap);
	// change the map zoom so that all the data is shown
	mymap.fitBounds(earthquakelayer.getBounds());
}*/

function popupClickLocation()
{
	// create a custom popup
	var popup = L.popup();
	// create an event detector to wait for the user's click event and then use the popup to show them where they clicked
	// note that you don't need to do any complicated maths to convert screen coordinates to real world coordiantes - the Leaflet API does this for you
	function onMapClick(e) {
		popup
		.setLatLng(e.latlng)
		.setContent("You clicked the map at " + e.latlng.toString())
		.openOn(mymap);
	}
	// now add the click event detector to the map
	mymap.on('click', onMapClick);
}

var poiLayer;
function startFormDataLoad() {
	//alert("loading...1");
	getPort();
	xhrFormData = new XMLHttpRequest();
	var url = "http://developer.cege.ucl.ac.uk:"+httpPortNumber;
	//url = url + "/getFormData/"+httpPortNumber;
	//url = url + "/getGeoJSON/formdata/geom/"+httpPortNumber;
	url = url + "/getGeoJSON/london_poi/geom";
	alert(url);
	xhrFormData.open("GET", url, true);
	xhrFormData.onreadystatechange = formDataResponse;
	xhrFormData.send();

}
function formDataResponse(){
	if (xhrFormData.readyState == 4) {
	// once the data is ready, process the data
		var formData = xhrFormData.responseText;
		loadForm(formData);
		//document.getElementById("divForm").innerHTML = formData;
	}
}

function loadForm(formData){
	//alert("formDataResponsed");
	var json = JSON.parse(formData);
	poiLayer = L.geoJson(json).addTo(mymap);
	mymap.fitBounds(poiLayer.getBounds());
}



/*
// keep the layer global so that we can automatically pop up a
// pop-up menu on a point if necessary
// we can also use this to determine distance for the proximity alert

var formLayer;
function loadFormData(formData) {
	// convert the text received from the server to JSON
	var formJSON = JSON.parse(formData);
	// load the geoJSON layer
	formLayer = L.geoJson(formJSON,
	{
		// use point to layer to create the points
		pointToLayer: function (feature, latlng)
			{
				// in this case, we build an HTML DIV string
				// using the values in the data
				var htmlString = "<DIV id='popup'"+ feature.properties.id + "><h2>" + feature.properties.name + "</h2><br>";
				htmlString = htmlString + "<h3>"+feature.properties.surname +"</h3><br>";
				htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_1'/>"+feature.properties.module+"<br>";
				htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_2'/>"+feature.properties.language+"<br>";
				htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_3'/>"+feature.properties.lecturetime+"<br>";
				htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_4'/>"+feature.properties.port_id+"<br>";
				htmlString = htmlString + "<button onclick='checkAnswer(" + feature.properties.id + ");return false;'>Submit Answer</button>";
				// now include a hidden element with the answer
				// in this case the answer is alwasy the first choice
				// for the assignment this will of course vary - you can use feature.properties.correct_answer
				htmlString = htmlString + "<div id=answer" + feature.properties.id + " hidden>1</div>";
				htmlString = htmlString + "</div>";
				return L.marker(latlng).bindPopup(htmlString);
			},
	}).addTo(mymap);
	mymap.fitBounds(formLayer.getBounds());
}

function checkAnswer(questionID) {
	// get the answer from the hidden div
	// NB - do this BEFORE you close the pop-up as when you close the pop-up the DIV is destroyed
	var answer = document.getElementById("answer"+questionID).innerHTML;
	// now check the question radio buttons
	var correctAnswer = false;
	var answerSelected = 0;
	for (var i=1; i < 5; i++) {
		if (document.getElementById(questionID+"_"+i).checked){
			answerSelected = i;
		}
		if ((document.getElementById(questionID+"_"+i).checked) && (i ==answer)) {
			alert ("Well done");
			correctAnswer = true;
		}
	}
	if (correctAnswer === false) {
		// they didn't get it right
		alert("Better luck next time");
	}
	// now close the popup
	mymap.closePopup();
	// the code to upload the answer to the server would go here
    // call an AJAX routine using the data
	// the answerSelected variable holds the number of the answer
	//that the user picked
}
*/



















