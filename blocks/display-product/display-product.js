const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const related_item = urlParams.get('l2');
let x = related_item;
console.log(x)


fetch('https://main--cabotstain--deckreyes.aem.page/deck.json?sheet=products-new')
  .then(response => response.json())
  .then(response => {
    
    console.log(response);

    //const product_name = response.data[0].name;
   
   
    // Display title
    document.getElementById('result-here').textContent = 'Results' ;

    //Display the last trade date
    //document.getElementById('product-name').textContent = product_name;

    for (var i=0; i < response.total; i++){
        if (response.data[i].l2 === x){
            //document.write(response.data[i].name + "<br /><br />")
            document.getElementById('product-name').innerHTML += "<br />"
            document.getElementById('product-name').innerHTML += "<img loading=\"eager\"  src=\"/images/cabot-solid-color-acrylic-stain-sealer.jpg?width=200&amp;format=jpg&amp;optimize=medium\" width=\"200\" height=\"200\">"
            document.getElementById('product-name').innerHTML += response.data[i].name
            document.getElementById('product-name').innerHTML += "<br />"
        }
    }
    

  })
  .catch(error => {
    console.log('Error fetching stock price:', error);
  });