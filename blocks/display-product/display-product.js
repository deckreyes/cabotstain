const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

console.log(urlParams.getAll('related-items'))



  fetch('https://main--cabotstain--deckreyes.aem.page/deck.json?sheet=products&related-items=L1&L2')
  .then(response => response.json())
  .then(data => {
    
    //const tradeDate = data['Global Quote']['07. latest trading day'];
   
    // Display title
    document.getElementById('result-here').textContent = 'Stock Price Information (dynamically generated): ' ;

   
    // Display the last trade date
    //document.getElementById('trade-date').textContent = 'Trade Date: ' + tradeDate;

  })
  .catch(error => {
    console.log('Error fetching stock price:', error);
  });