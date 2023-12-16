var name1 = document.getElementById("name")
var email = document.getElementById("email")
var password = document.getElementById("password")
var userType = document.getElementById("usertype")
var otpverify = document.getElementById("otp")
var image = document.getElementById("image")
var fileimage;

function submit() {
    console.log(name1.value)
    console.log(email.value)
    console.log(password.value)
    console.log(userType.value)

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "email": "newp@yopmail.com",
        "password": "12312312",
        "name": "test12345",
        "userType": userType.value
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://localhost:5000/user/signup", requestOptions)
        .then(response => response.text())
        .then(result => {
            let res = JSON.parse(result)
            console.log(res.data)
            // console.log(res.message)
            // console.log(res.token)
            localStorage.setItem("token", res.token)
            alert(res.message)
            if (res.message == "User Created") {
                window.location = "otp_verify.html"
            }
        })
        .catch(error => console.log('error', error));

}


function otpVerifyFun() {
    var token = localStorage.getItem("token")
    var myHeaders = new Headers();
    console.log(token)

    myHeaders.append("authorization", token.toString());
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "otp": otpverify.value,
        "otp_type": "verify_Account"
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://localhost:5000/user/verify-otp", requestOptions)
        .then(response => response.text())
        .then(result => {
            let res = JSON.parse(result)
            localStorage.setItem("token", res.token)
            if (res.message == "verify otp") {


            }
        })
        .catch(error => console.log('error', error));

}

function createProfile(e) {
    var token = localStorage.getItem("token")
    var myHeaders = new Headers();
    myHeaders.append("Authorization", token);

    var formdata = new FormData();
    formdata.append("Image", fileimage);
    formdata.append("gender", "male");
    formdata.append("contactNo", "76217367263");
    formdata.append("address", "wgghwdfh");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

    fetch("http://localhost:5000/user/complete-profile", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

}

image.addEventListener("change", (e) => {
    files = e.target.files;
    console.log(files[0])
    fileimage = files[0]
})


