const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const look = urlParams.get('brand');
const condition = urlParams.get('surface');

fetch('https://main--cabotstain--deckreyes.aem.page/deck.json?sheet=master')
  .then(response => response.json())
  .then(response => {
    
    console.log(response);

    //const product_name = response.data[0].name;   
    // Display title
    document.getElementById('header-here').textContent = '1. What exterior wood surface are you staining?' ;

    //Display the last trade date
    //document.getElementById('product-name').textContent = product_name;

    for (var i=0; i < response.total; i++){
      if (response.data[i].brand === cabot && response.data[i].type === surface){          
          document.getElementById('surface-type-here').innerHTML += "<br />"
          document.getElementById('surface-type-here').innerHTML += "<img loading=\"eager\"  src=\"" + response.data[i].image + "?width=200&amp;format=jpg&amp;optimize=medium\" width=\"200\" height=\"200\">"
          document.getElementById('surface-type-here').innerHTML += response.data[i].name
          document.getElementById('surface-type-here').innerHTML += "<br />"
      } 
     }  

  })
  .catch(error => {
    console.log('Error fetching products', error);
  });