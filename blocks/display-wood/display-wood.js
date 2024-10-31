
fetch('https://main--cabotstain--deckreyes.aem.page/deck.json?sheet=wood')
  .then(response => response.json())
  .then(response => {
    
    console.log(response);

    document.getElementById('woodtext1').innerHTML  = response.data[0].name
    document.getElementById('woodtext1').innerHTML += "<img loading=\"eager\"  src=\"" + response.data[0].image + "?width=200&amp;format=jpg&amp;optimize=medium\" width=\"200\" height=\"200\">"
       
    
          
  }
  )
  .catch(error => {
    console.log('Error fetching products', error);
  });
