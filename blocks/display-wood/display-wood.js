
fetch('https://main--cabotstain--deckreyes.aem.page/deck.json?sheet=wood')
  .then(response => response.json())
  .then(response => {
    
    console.log(response);

    //const product_name = response.data[0].name;
   
   
    // Display title
    document.getElementById('result-here').textContent = 'Results' ;

    for (var i=0; i < response.total; i++){
              
           document.getElementById('woodimage'+i).innerHTML = "<img loading=\"eager\"  src=\"" + response.data[i].image + "?width=200&amp;format=jpg&amp;optimize=medium\" width=\"200\" height=\"200\">"
           document.getElementById('woodtext2'+i).innerHTML = response.data[i].name
          
        }
    }
  )
  .catch(error => {
    console.log('Error fetching products', error);
  });