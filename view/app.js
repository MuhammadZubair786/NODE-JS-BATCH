
let email = document.getElementById("email")
let password = document.getElementById("password")

function Send(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    
    var raw = JSON.stringify({
      "email": email.value,
      "password": password.value
    });
    
    var requestOptions = {

      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch("http://localhost:5000/user/login", requestOptions)
      .then(response => console.log(response))
     
      .catch(error => console.log('error', error));
}

