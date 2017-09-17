// Code for the main app page (Regions List).

// The following is sample code to demonstrate navigation.
// You need not use it for final app.







var regionListElement = document.getElementById('region-list');
var listHTML = "";


savedRegions=JSON.parse(localStorage.getItem(APP_PREFIX))
for(var i = (savedRegions.length)-1; i>-1; i--)
{
    
var regionPDO = savedRegions[i]
var viewingRegion = new Region()
viewingRegion.initialiseFromPDO(regionPDO)
    
                listHTML += "<tr> <td onmousedown=\"viewRegion(" + i + ")\" class=\"full-width mdl-data-table__cell--non-numeric\">" + viewingRegion.getName()
                listHTML += "<div class=\"subtitle\">" + viewingRegion.getTime()
}
         
            regionListElement.innerHTML = listHTML;

function viewRegion(test)
{ 
    localStorage.setItem(APP_PREFIX + "test",JSON.stringify(test));
    location.href = 'viewRegion.html';
}