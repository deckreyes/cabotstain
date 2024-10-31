
fetch('https://main--cabotstain--deckreyes.aem.page/deck.json?sheet=wood')
  .then(response => response.json())
  .then(response => {
    
    console.log(response);

 
           document.getElementById('woodimage1').textContent += "<img loading=\"eager\"  src=\"" + response.data[0].image + "?width=200&amp;format=jpg&amp;optimize=medium\" width=\"200\" height=\"200\">"
           document.getElementById('woodtext1').textContent  = response.data[0].name
           document.getElementById('woodimage2').textContent += "<img loading=\"eager\"  src=\"" + response.data[1].image + "?width=200&amp;format=jpg&amp;optimize=medium\" width=\"200\" height=\"200\">"
           document.getElementById('woodtext2').textContent  = response.data[1].name
   
    
          
  }
  )
  .catch(error => {
    console.log('Error fetching products', error);
  });
