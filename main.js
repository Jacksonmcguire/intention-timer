var iconDeactivated = document.querySelectorAll(".deactivated");
var iconActivated = document.querySelectorAll(".activated");
var categoryInputs = document.querySelectorAll(".category-input");
var categoryButtons = document.querySelectorAll(".category-label");
var categoryContainer = document.querySelector(".category-container");
var inputActivity = document.getElementById('activity');
var inputMinutes = document.getElementById("minutes");
var inputSeconds = document.getElementById("seconds");
var buttonStartActivity = document.querySelector(".activity-button");
var buttonTitles = document.querySelector('.button-title');
var buttonLogActivity = document.querySelector(".log-activity");
var errorMessages = document.querySelectorAll('.error-message');
var warningIcons = document.querySelectorAll('.warning-icon');
var form = document.querySelector("form");
var containerTimer = document.querySelector(".timer-container");
var timer = document.querySelector(".timer");
var timerText = document.querySelector(".timer-activity-text");
var timerButton = document.querySelector(".timer-button");
var logActivityButton = document.querySelector('.log-activity');
var mainTitle = document.querySelector(".main-title")
var pastActivityList = document.querySelector(".past-activity-list");
var currentIcon;
var pastActivities = [];
var currentActivity;
var inputs = [currentIcon, inputActivity, inputMinutes, inputSeconds];


window.addEventListener('load', showPastActivityCards);
categoryContainer.addEventListener("click", displayActivatedIcon);
buttonStartActivity.addEventListener('click', validateForm);
buttonLogActivity.addEventListener('click', logActivity)
timerButton.addEventListener('click', startCountdown);
inputMinutes.addEventListener("keyup", validateNumberMinutes);
inputSeconds.addEventListener("keyup", validateNumberSeconds);
form.addEventListener("submit", function() {
  event.preventDefault();
});

function display(feature) {
  feature.classList.remove("hidden");
}

function hide(feature) {
  feature.classList.add("hidden");
}

function changeTitle() {
  mainTitle.innerText = "Current Activity"
  timerText.innerText = `${inputActivity.value}`
}

function displayTime() {
  var time = Number(inputMinutes.value * 60) + Number(inputSeconds.value)
  var minutes = String(Math.trunc(time / 60)).padStart(2, 0);
  var seconds = String(Math.trunc(time % 60)).padStart(2, 0);
  timer.textContent = `${minutes}:${seconds}`
}

//will need to change inputMinutes to createdActivity (obj instance) exstenion
function displayTimer() {
  hide(form);
  display(containerTimer);
  changeTitle();
  displayTime();
  var category;
  for (var i = 0; i < categoryInputs.length; i++){
    if(categoryInputs[i].checked) {
      category = categoryInputs[i].classList;
    }
  }
  if(category.contains("study-box")) {
    timerButton.classList.add("study-color");
  }
  else if(category.contains("meditate-box")) {
    timerButton.classList.add("meditate-color");
  }
  else {
    timerButton.classList.add("exercise-color");
 }
}

// Should we combine these functions with a class??
function validateNumberMinutes(){
  if (!(event.keyCode >= 48 && event.keyCode <= 57) && !(event.keyCode >= 96 && event.keyCode <= 105) && !(event.keyCode == 8)){
    event.target.value = event.target.value.substring(0, event.target.value.length - 1);
  };
};

function validateNumberSeconds(){
  if (!(event.keyCode >= 48 && event.keyCode <= 57) && !(event.keyCode >= 96 && event.keyCode <= 105) && !(event.keyCode == 8)){
    event.target.value = event.target.value.substring(0, event.target.value.length - 1);
  };
};

function displayActivatedIcon() {
  for(var i = 0; i < categoryInputs.length; i++) {
    if(categoryInputs[i].checked) {
      iconActivated[i].classList.toggle('hidden');
      iconDeactivated[i].classList.toggle('hidden');
      currentIcon = categoryInputs[i];
    };
  };
};

//refactor this to take out class list add
function validateForm() {
  if(currentIcon === undefined) {
    showErrorMessage(0);
    errorMessages[0].classList.add('margin-0');
  }
  else if (!checkInputs()) {
    checkInputs();
  }
  else {
    currentActivity = new Activity(currentIcon.id, inputActivity.value, inputMinutes.value, inputSeconds.value);
    // var createdActivity = new Activity(currentIcon.id, inputActivity.value, inputMinutes.value, inputSeconds.value);
    //we will need to call this method on the start button listener instead
    //need to take displaly funcitonality and move it
    displayTimer();
  }
}

function checkInputs() {
  for(var i = 1; i < inputs.length; i++) {
    if(!inputs[i].value) {
      showErrorMessage(i);
      return false
    }
  }
  return true;
}

function showErrorMessage(index) {
  checkErrorMessages();
  errorMessages[index].classList.remove('visibility-hidden');
  warningIcons[index].classList.remove('visibility-hidden');
  if(index > 0) {
    console.log(inputs[index])
    inputs[index].classList.toggle('error-message-color');
  }
}

function startCountdown() {
  currentActivity.countdown();
  // createdActivities[0].countdown();
}

function checkErrorMessages() {
  for(var i = 0; i < errorMessages.length; i++) {
    if(!errorMessages[i].classList.contains('visibility-hidden')) {
      errorMessages[i].classList.toggle('visibility-hidden');
      inputs[i].classList.toggle('error-message-color');
    }
  }
}

function logActivity() {
  currentActivity.saveToStorage();
  currentActivity.markComplete();
  listPastCards(); 
  showCardMarkerColor();
  }

function showCardMarkerColor() {
  var pastActivityCardColor = document.querySelectorAll(".past-activity");
    for(i = 0; i < pastActivities.length; i++){
    if(pastActivities[i].category === "meditate") {
      pastActivityCardColor[i].classList.add("meditate-color");
    } else if(pastActivities[i].category === "study") {
      pastActivityCardColor[i].classList.add("study-color");
    } else {
      pastActivityCardColor[i].classList.add("exercise-color");      }
   }
  }

function displayMessage() {
timer.textContent = `YOU DID IT! CONGRATULATIONS ON FINISHING YOUR ${currentActivity.category.toUpperCase()} SESSION!`;
timer.classList.add('timer-removed');
display(logActivityButton);
}

function listPastCards() {
  for(var i = 0; i < localStorage.length; i++) {
    var saved = localStorage.getItem("storage " + i);
    saved = JSON.parse(saved);
    pastActivities.push(saved);
  }
}

function showPastActivityCards() {
  listPastCards();
  for(var i = 0; i < localStorage.length; i++) {
    var card = document.createElement("li");
    pastActivityList.appendChild(card);
    card.classList.add("past-activity-card");
    card.innerHTML =
    `<article class="card">
         <li class="past-activity">
           <p class="past-activity-category">${pastActivities[i].category.charAt(0).toUpperCase() + pastActivities[i].category.slice(1)}</p>
           <time class="past-activity-time">${pastActivities[i].minutes} MIN ${pastActivities[i].seconds} SECONDS</time>
        </li>
        <li class="past-activity-description">
          <p>${pastActivities[i].description}</p>
        </li>
     </article>`
  }
  showCardMarkerColor();
 }
