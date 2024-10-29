const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

console.log(urlParams.getAll('related-items'))



  fetch('https://main--cabotstain--deckreyes.aem.page/deck.json?sheet=products&related-items=L1&L2')
  .then(response => response.json())
  .then(data => {
    
    console.log(data);

    const name = data[0][name];
   
    // Display title
    document.getElementById('result-here').textContent = 'Results' ;



    //Display the last trade date
    document.getElementById('product-name').textContent = name;

  })
  .catch(error => {
    console.log('Error fetching stock price:', error);
  });