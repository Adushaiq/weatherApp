const container = document.querySelector('.container'),
inputSection = container.querySelector('.inputSection'),
infoTxt = inputSection.querySelector('.infoTxt'),
inputField = inputSection.querySelector('input');
locationBtn = inputSection.querySelector('button');
wIcon = document.querySelector(".weatherSection img");
backArrow = container.querySelector("header i");
let api;

inputField.addEventListener('keyup', e => {
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }    
    else {
        alert("Your browser does not support geolocation api.");
    }
});

function onSuccess(position){
    const {latitude, longitude} = position.coords;
    api =  `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=3dc0673411d7f56e9091e338b1ee3ae3`;
    fetchData();
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}


function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=3dc0673411d7f56e9091e338b1ee3ae3`;
    fetchData();
}

function fetchData() {
    infoTxt.innerText = "Getting Weather details...";
    infoTxt.classList.add("pending");
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info) {

    infoTxt.classList.replace("pending", "error");
    if(info.cod == "404"){
        infoTxt.innerText = `${inputField.value} is not a valid City Name`; 
    }
    else {
        // Storing weather details
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        // Passing Weather Details to Html Elements

        container.querySelector(".temp .numb").innerText = Math.floor(temp);
        container.querySelector(".weather").innerText = description;
        container.querySelector(".location span").innerText = `${city},${country}`;
        container.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        container.querySelector(".humidity span").innerText = `${humidity}%`;

        // updating the weather icon

        if (id == 800){
            wIcon.src = "images/clear.svg";
        }
        else if (id >=200 && id <= 232){
            wIcon.src = "images/storm.svg";
        }
        else if (id >=600 && id <= 622){
            wIcon.src = "images/snow.svg";
        }
        else if (id >=701 && id <= 781){
            wIcon.src = "images/haze.svg";
        }
        else if (id >=801 && id <= 804){
            wIcon.src = "images/cloud.svg";
        }
        else if ((id >=300 && id <= 321) || (id >=500 && id <=531)){
            wIcon.src = "images/rain.svg";
        }

        infoTxt.classList.remove("pending", "error");
        container.classList.add("active");

    }
}

backArrow.addEventListener("click", () => {
    container.classList.remove("active");
});