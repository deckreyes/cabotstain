const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const related_item = urlParams.get('l2');
let x = related_item;
console.log(x)


fetch('https://main--cabotstain--deckreyes.aem.page/deck.json?sheet=products-matrix')
  .then(response => response.json())
  .then(response => {
    
    console.log(response);

    //const product_name = response.data[0].name;   
    // Display title
    document.getElementById('result-here').textContent = 'Results' ;

    //Display the last trade date
    //document.getElementById('product-name').textContent = product_name;

   
    

  })
  .catch(error => {
    console.log('Error fetching products', error);
  });