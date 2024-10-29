const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

console.log(urlParams.getAll('related-items'))



  fetch('https://main--cabotstain--deckreyes.aem.page/deck.json?sheet=products&related-items=L1&L2')
  .then(response => response.json())
  .then(response => {
    
    console.log(response);

    //const product_name = response.data[0].name;
   
   
    // Display title
    document.getElementById('result-here').textContent = 'Results' ;

    //Display the last trade date
    //document.getElementById('product-name').textContent = product_name;

    for (var i=0; i < response.total; i++){

        //console.log(response.data[i].name)
        document.write(response.data[i].name + "<br /><br />")
    }
    

  })
  .catch(error => {
    console.log('Error fetching stock price:', error);
  });