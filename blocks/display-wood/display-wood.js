
fetch('https://main--cabotstain--deckreyes.aem.page/deck.json?sheet=wood')
  .then(response => response.json())
  .then(response => {
    
    console.log(response);

    //const product_name = response.data[0].name;
  

           document.getElementById(woodtext1).textContent  = response.data[0].name

    console.log('hello world first')

          
  }
  )
  .catch(error => {
    console.log('Error fetching products', error);
  });


  console.log('hello world second')