var currentPosition;
var newRegion = new Region();
var map;
var marker;
var poly;
var accuracy;
var path = [];
var Polygon = null;



function initMap()
{    
    //getLocation();
    map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -37.9131547, lng: 145.1335457 }, // this is for sure there is no mistakes
      zoom: 20
    });
    marker = new google.maps.Marker({
        map: map
    });
}
window.addEventListener('load', initMap); // add this one to load the initMap each time users load browser
function getLocation()
{
    // Check for geolocation support
    if (navigator.geolocation) 
    {
        // Get current location and transfer it to anonymous function
        navigator.geolocation.getCurrentPosition(function(position) {
            currentPosition = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            accuracy =  position.coords.accuracy
            document.getElementById('accuracy').innerHTML = "Accuracy is " + accuracy.toFixed(2) + "m";
            map.setCenter(currentPosition);
            marker.setPosition(currentPosition);
            marker.setMap(map);
        });
        
    }
    else
    {
        displayMessage('Error: Your browser doesn\'t support geolocation.', 1000); // check this one
    }
}
window.addEventListener('deviceorientation', getLocation);

function addCorner()
{  
    if (accuracy <= 10)
    {
     newRegion.addCornerLocation(currentPosition);
    }
     else
    {
      displayMessage("not accurate enough to add corner!")       
    }
}

function reset()
{
  newRegion.reset();  
}

function saveRegion()
{  
    if(newRegion.getCorner().length>2)
    {
        newRegion.addtime();
        var storedName = prompt("What is your regions name?");
        if(storedName === "") // validation if user enter nothing
            {
                storedName = "NoName";
            }
        else if (storedName === null)
            {
                displayMessage("You have cancelled Save Region. Adding more Corners!!! "); // when users cancel the prompt
                return;
            }
        
        newRegion.addName(storedName);
    }
    else
    {
        displayMessage("Not enough corners");
        return;
    } 
    areaPerimeter(); // this function to calculate the Area and Perimeter
    savedRegions = JSON.parse(localStorage.getItem(APP_PREFIX)); // get savedRegions from Local Storage
    //console.log(savedRegions) 
    if(savedRegions === "" || savedRegions === null)
        {
            savedRegions = [newRegion];
        }
    else
        {
            savedRegions.push(newRegion); 
            //console.log("that")
        }
    
    localStorage.setItem(APP_PREFIX, JSON.stringify(savedRegions));  // set APP_PREFIX Local Storage
    //displayMessage("distance: " + fecing.length);
     window.location.href = "index.html"; 
}

function polygon()
{
    
    if(Polygon !== null)    
    {
        Polygon.setMap(null);
        Polygon = null;
    }
    Polygon = new google.maps.Polygon({ // create the Polygon
          path: newRegion.getCorner(),
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
    });  
    Polygon.setMap(map);
};

function areaPerimeter()
{
    newRegion.addArea(Polygon); 
    newRegion.addPerimeter(Polygon);   
}