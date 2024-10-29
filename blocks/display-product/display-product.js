const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

console.log(urlParams.getAll('related-items'))



  fetch('https://main--cabotstain--deckreyes.aem.page/deck.json?sheet=products&related-items=L1&L2')
  .then(response => response.json())
  .then(response => {
    
    console.log(response);

    //const product_name = response.data[0].name;
    //const product_name = response.data.related-items[L1, L2];
   
    // Display title
    document.getElementById('result-here').textContent = 'Results' ;

    var slag = JSON.parse(response).filter(doc => doc.related-items === 'test');
    console.log(slag);



    //Display the last trade date
    //document.getElementById('product-name').textContent = product_name;

  })
  .catch(error => {
    console.log('Error fetching stock price:', error);
  });