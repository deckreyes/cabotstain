
fetch('https://main--cabotstain--deckreyes.aem.page/deck.json?sheet=wood')
  .then(response => response.json())
  .then(response => {
    
    console.log(response);

 
           document.getElementById('woodimage1').textContent += "<img loading=\"eager\"  src=\"" + response.data[0].image + "?width=200&amp;format=jpg&amp;optimize=medium\" width=\"200\" height=\"200\">"
           document.getElementById('woodtext1').textContent  = response.data[0].name
        
           document.getElementById('woodimage3').textContent += "<img loading=\"eager\"  src=\"" + response.data[1].image + "?width=200&amp;format=jpg&amp;optimize=medium\" width=\"200\" height=\"200\">"
           document.getElementById('woodtext3').textContent  = response.data[1].name

           document.getElementById('woodimage4').textContent += "<img loading=\"eager\"  src=\"" + response.data[2].image + "?width=200&amp;format=jpg&amp;optimize=medium\" width=\"200\" height=\"200\">"
           document.getElementById('woodtext4').textContent  = response.data[2].name

           document.getElementById('woodimage4').textContent += "<img loading=\"eager\"  src=\"" + response.data[3].image + "?width=200&amp;format=jpg&amp;optimize=medium\" width=\"200\" height=\"200\">"
           document.getElementById('woodtext4').textContent  = response.data[3].name

           document.getElementById('woodimage5').textContent += "<img loading=\"eager\"  src=\"" + response.data[4].image + "?width=200&amp;format=jpg&amp;optimize=medium\" width=\"200\" height=\"200\">"
           document.getElementById('woodtext5').textContent  = response.data[4].name

           document.getElementById('woodimage6').textContent += "<img loading=\"eager\"  src=\"" + response.data[5].image + "?width=200&amp;format=jpg&amp;optimize=medium\" width=\"200\" height=\"200\">"
           document.getElementById('woodtext6').textContent  = response.data[5].name  
    
          
  }
  )
  .catch(error => {
    console.log('Error fetching products', error);
  });
