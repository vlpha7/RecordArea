function Region()
{
    var regionsName;
    var cornerLocation = [];
    var time;
    var area;
    var perimeter;
    var fence = [];
    
    this.getCorner = function()
    {
        return cornerLocation;
    }
    this.getSpecificCorner = function(cornerNumber)
    {
        return new google.maps.LatLng(cornerLocation[cornerNumber].lat,cornerLocation[cornerNumber].lng);
    }
    this.getTime = function()
    {
        return time;
    }  
    this.getName = function()
    {
        return regionsName;
    }
    this.getArea = function()
    {
        return area;
    }  
    this.getPerimeter = function()
    {
        return perimeter;
    }
    this.getFence = function(p)
    {
        return fence;
    }
    this.addArea = function(Polygon)
    {
        area = google.maps.geometry.spherical.computeArea(Polygon.getPath()); // calculate the Area from the Polygon
    }
    this.addPerimeter = function(Polygon) 
    {
        perimeter = google.maps.geometry.spherical.computeLength(Polygon.getPath()); // calculate the Area from the Polygon
    }
    this.addFence = function(f)
    {
        fence = f;
    }
    this.addCornerLocation = function(location)
    {
        cornerLocation.push(location);
        displayMessage('You add new corner. The number of corner: ' + cornerLocation.length ,1000);
        if(cornerLocation.length > 0) // should we go > 2
        {
            polygon(); // this should be polygon() just change name
        }
    }
    this.addtime = function()
    {
            var currentdate = new Date();
            time = "Region saved: " + currentdate.getDate() + "/" + (currentdate.getMonth()+1) + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    }
    
    this.reset = function()
    {
        displayMessage("Yes have reseted the Region!!!");
        cornerLocation = [];
        Polygon.setMap(null); //life time of variable (global variable)
        Polygon = null; // disscus about this this is a error
    }
    this.toJSON = function() 
    {
        var RegionPDO = {
        regionsName: regionsName,
        cornerLocation: cornerLocation,
        time: time,
        area: area,
        perimeter: perimeter,
        fence: fence
		};
        return RegionPDO;    
	} 
    this.initialiseFromPDO = function(RegionPDO)
    {
        regionsName = RegionPDO.regionsName,
        cornerLocation = RegionPDO.cornerLocation,
        time = RegionPDO.time,
        area = RegionPDO.area,
        perimeter = RegionPDO.perimeter,
        fence = RegionPDO.fence
    }
    this.addName = function(name)
    {
        regionsName = name;
    }
}
// Shared code needed by the code of all three pages.

// Prefix to use for Local Storage.  You may change this.
var APP_PREFIX = "monash.eng1003.fencingApp-Group81";

// Array of saved Region objects.
var savedRegions = [];

var variable;

//localStorage.setItem(APP_PREFIX, JSON.stringify(savedRegions))

// This function displays the given message String as a "toast" message at
// the bottom of the screen.  It will be displayed for 2 second, or if the
// number of milliseconds given by the timeout argument if specified.
function displayMessage(message, timeout)
{
    if (timeout === undefined)
    {
        // Timeout argument not specifed, use default.
        timeout = 2000;
    } 

    if (typeof(message) == 'number')
    {
        // If argument is a number, convert to a string.
        message = message.toString();
    }

    if (typeof(message) != 'string')
    {
        console.log("displayMessage: Argument is not a string.");
        return;
    }

    if (message.length == 0)
    {
        console.log("displayMessage: Given an empty string.");
        return;
    }

    var snackbarContainer = document.getElementById('toast');
    var data = {
        message: message,
        timeout: timeout
    };
    if (snackbarContainer && snackbarContainer.hasOwnProperty("MaterialSnackbar"))
    {
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    }
}

