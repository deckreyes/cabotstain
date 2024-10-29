const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

console.log(urlParams.getAll('related-items'))

const related_items = urlParams.getAll('related-items');
let [x, y] = related_items;
console.log(x)


fetch('https://main--cabotstain--deckreyes.aem.page/deck.json?sheet=products')
  .then(response => response.json())
  .then(response => {
    
    console.log(response);

    //const product_name = response.data[0].name;
   
   
    // Display title
    document.getElementById('result-here').textContent = 'Results' ;

    //Display the last trade date
    //document.getElementById('product-name').textContent = product_name;

    for (var i=0; i < response.total; i++){
        if (response.data[i].related === related_items){
            document.write(response.data[i].name + " - " + response.data[i].related + "<br /><br />")
        }
    }
    

  })
  .catch(error => {
    console.log('Error fetching stock price:', error);
  });