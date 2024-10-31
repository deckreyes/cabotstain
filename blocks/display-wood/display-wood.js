
fetch('https://main--cabotstain--deckreyes.aem.page/deck.json?sheet=wood')
  .then(response => response.json())
  .then(response => {
    
    console.log(response);

    document.getElementById('wood1').innerHTML  = response.data[0].name
    document.getElementById('wood1').innerHTML += "<img loading=\"eager\"  src=\"" + response.data[0].image + "?width=200&amp;format=jpg&amp;optimize=medium\" width=\"200\" height=\"200\">"
    document.getElementById('wood2').innerHTML  = response.data[1].name
    document.getElementById('wood3').innerHTML += "<img loading=\"eager\"  src=\"" + response.data[1].image + "?width=200&amp;format=jpg&amp;optimize=medium\" width=\"200\" height=\"200\">"
       
    
          
  }
  )
  .catch(error => {
    console.log('Error fetching products', error);
  });
