const BASE_URL = "http://localhost:5000/auth";

function registerUser(){
    const name = document.getElementById("name") ? document.getElementById("name").value : '';
    const email = document.getElementById("email") ? document.getElementById("email").value : '';
    const password = document.getElementById("password") ? document.getElementById("password").value : '';

    if(!name || !email || !password) {
        alert("Please fill all fields");
        return;
    }

    const user = { name, email, password };

    fetch(BASE_URL + "/register",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify(user)
    })
    .then(async response => {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Registration Failed");
        }
        return data;
    })
    .then(data=>{
        alert("Registration Successful");
        window.location.href="login.html";
    })
    .catch(error=>{
        console.error(error);
        alert(error.message);
    });
}

function loginUser(){
    const email = document.getElementById("loginEmail") ? document.getElementById("loginEmail").value : '';
    const password = document.getElementById("loginPassword") ? document.getElementById("loginPassword").value : '';

    if(!email || !password) {
        alert("Please enter email and password");
        return;
    }

    const loginData = { email, password };

    fetch(BASE_URL + "/login",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify(loginData)
    })
    .then(async response => {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Login Failed");
        }
        return data;
    })
    .then(data=>{
        if(data.token){
            localStorage.setItem("token", data.token);
            alert("Login Successful");
            window.location.href="home.html"; // Redirect to Main System Dashboard
        }
    })
    .catch(error=>{
        console.error(error);
        alert(error.message);
    });
}

function loadProfile(){
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    fetch(BASE_URL + "/profile", {
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    .then(async response => {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to load profile");
        }
        return data;
    })
    .then(data=>{
        if(document.getElementById("userId")) document.getElementById("userId").innerText=data.userId;
        if(document.getElementById("name")) document.getElementById("name").innerText=data.name;
        if(document.getElementById("email")) document.getElementById("email").innerText=data.email;
        if(document.getElementById("role")) document.getElementById("role").innerText=data.role;
    })
    .catch(error => {
        console.error(error);
        alert("Session expired. Please login again.");
        logout();
    });
}

function updateProfile(){
    // The prompt only required /profile GET endpoint. 
    // Leaving this here with a basic warning or unimplemented state
    alert("Update profile API is not implemented yet.");
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}