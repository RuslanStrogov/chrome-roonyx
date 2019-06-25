function hello() {
    console.log(localStorage.getItem('trello_token')); 
  }
  
  document.getElementById('clickme').addEventListener('click', hello);