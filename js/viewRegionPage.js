savedRegions=JSON.parse(localStorage.getItem(APP_PREFIX))
variable=JSON.parse(localStorage.getItem(APP_PREFIX + "test"))
var regionPDO = savedRegions[variable]
var viewingRegion = new Region()
viewingRegion.initialiseFromPDO(regionPDO)

document.getElementById("headerBarTitle").textContent = "" + viewingRegion.getName(); // what is it?

document.getElementById('Area & Perimeter').innerHTML = "Area: " + viewingRegion.getArea().toFixed(2) + "m2" + "&nbsp; Perimeter:" + viewingRegion.getPerimeter().toFixed(2) + "m";

var Polygon;
var fencePostsON = 0;
var posts = [null];

function initMap() 
{
    map = new google.maps.Map(document.getElementById('map'), {
      center: viewingRegion.getSpecificCorner(0),
      zoom: 20
    });
    Polygon = new google.maps.Polygon({
          path: viewingRegion.getCorner(),
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
    }); 
    Polygon.setMap(map);
}
window.addEventListener('load', initMap); // add this one to load the initMap each time users load browser
function deleteRegion()
{
    if (confirm("Are you sure you want to delete " + viewingRegion.getName() + "?"))
    {
        savedRegions.splice(variable,1)
        localStorage.setItem(APP_PREFIX, JSON.stringify(savedRegions));
        displayMessage("Area Deleted!!")
        window.location.href = "index.html";
    }
}

function fencePosts()
{
    if (posts[0] === null)
        {
            posts=[]    
            var isValid = 0;
            while(isValid === 0)
            {
                var distanceApart = prompt("What is the maximum meters apart each fence post can be?"); // check it for sure
                if(isNaN(distanceApart) === false & distanceApart > 0 & distanceApart !== "")
                    {
                        isValid = 1;
                    }
            }
            document.getElementById('Max Distance').innerHTML = " &nbsp; Posts max " + distanceApart + "m apart" 
            var corners = viewingRegion.getCorner();
            var numCorners = corners.length;
            var fencing = [];
    
            for(var i = 0; i < numCorners; i++)
            { 
                if( i === (numCorners - 1))
                {
                    var distance = google.maps.geometry.spherical.computeDistanceBetween(viewingRegion.getSpecificCorner(i),viewingRegion.getSpecificCorner(0));                   
                    if(distance > distanceApart)
                        {
                            var step = Math.floor(distance/distanceApart);
                            var ratio = 1/(step + 1);
                            for(var j = 1; j <= step; j++)
                                {
                                    var interpolated = google.maps.geometry.spherical.interpolate(viewingRegion.getSpecificCorner(i),viewingRegion.getSpecificCorner(0), ratio * j) ; // disscus about this
                                    fencing.push(interpolated);
                                }
                        }
                    
                }
            else 
                {
                    //console.log(viewingRegion.getSpecificCorner(i))
                    var distance = google.maps.geometry.spherical.computeDistanceBetween(viewingRegion.getSpecificCorner(i),viewingRegion.getSpecificCorner(i+1));
                    
                    if(distance > distanceApart)
                        {
                            var step = Math.floor(distance/distanceApart);
                            var ratio = 1/(step + 1)
                            for(var j = 1; j <= step; j++)
                                {
                                    var interpolated = google.maps.geometry.spherical.interpolate(viewingRegion.getSpecificCorner(i),viewingRegion.getSpecificCorner(i+1), ratio * j) ;
                                    fencing.push(interpolated);
                                }
                        }
                }
                //displayMessage("distance: " + distance);
                fencing.push(viewingRegion.getSpecificCorner(i));
                   //displayMessage("distance: " + distance);
                    //fencing.push(corners.getAt(numCorners-1));       
               }
        viewingRegion.addFence(fencing);
            
        var fenceArray = viewingRegion.getFence();
            
        for(var i = 0; i < fenceArray.length; i++)
        {
            posts[i] = new google.maps.Circle({
                strokeColor: '#000000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#000000',
                fillOpacity: 1,
                map: map,
                center: fenceArray[i],
                radius: 0.5
            });    
        } 
    //posts.setMap(map)
        displayMessage("You turn on the fence");
        }
    else
        {
            var fenceArray = viewingRegion.getFence();
            for(var i = 0; i < fenceArray.length; i++){
            posts[i].setMap(null)
            }
            posts = [null]
            document.getElementById('Max Distance').innerHTML = ""
            displayMessage("You turn off the fence"); 
        }
}