var form = document.querySelector("form");
var mainTitle = document.querySelector(".main-title")
var iconDeactivated = document.querySelectorAll(".deactivated");
var iconActivated = document.querySelectorAll(".activated");
var categoryInputs = document.querySelectorAll(".category-input");
var categoryButtons = document.querySelectorAll(".category-label");
var categoryContainer = document.querySelector(".category-container");
var inputActivity = document.getElementById('activity');
var inputMinutes = document.getElementById("minutes");
var inputSeconds = document.getElementById("seconds");
var buttonStartActivity = document.querySelector(".activity-button");
var buttonLogActivity = document.querySelector('.log-activity-button');
var buttonTitles = document.querySelector('.button-title');
var buttonTimer = document.querySelector(".timer-button");
var buttonCreateNewActivity = document.querySelector('.create-new-activity');
var errorMessages = document.querySelectorAll('.error-message');
var warningIcons = document.querySelectorAll('.warning-icon');
var containerTimer = document.querySelector(".timer-container");
var timer = document.querySelector(".timer");
var timerText = document.querySelector(".timer-activity-text");
var defaultText = document.querySelector(".default-text-wrapper");
var pastActivityList = document.querySelector(".past-activity-list");

var currentIcon;
var pastActivities = [];
var currentActivity;
var inputs = [currentIcon, inputActivity, inputMinutes, inputSeconds];

window.addEventListener('load', showPastActivityCards);
categoryContainer.addEventListener("click", displayActivatedIcon);
buttonStartActivity.addEventListener('click', validateForm);
buttonLogActivity.addEventListener('click', logActivity)
buttonTimer.addEventListener('click', startCountdown);
buttonCreateNewActivity.addEventListener('click', goHome);
inputMinutes.addEventListener("keyup", validateNumberMinutes);
inputSeconds.addEventListener("keyup", validateNumberSeconds);
form.addEventListener("submit", function() {
event.preventDefault();
});

function display(feature) {
  feature.classList.remove("hidden");
};

function hide(feature) {
  feature.classList.add("hidden");
};

function changeTitle() {
  changeInnerText(mainTitle, "Current Activity");
  changeInnerText(timerText, inputActivity.value);
  changeInnerText(buttonTimer, "START");
};

function changeInnerText(element, text) {
  element.innerText = text;
};

function displayActivatedIcon() {
  checkIcons();
  for(var i = 0; i < categoryInputs.length; i++) {
    if(categoryInputs[i].checked) {
      iconActivated[i].classList.toggle('hidden');
      iconDeactivated[i].classList.toggle('hidden');
      currentIcon = categoryInputs[i];
    };
  };
};

function checkIcons() {
  for (var i = 0; i < iconDeactivated.length; i++) {
    if(!iconDeactivated[i].classList.contains('hidden')) {
      hide(iconDeactivated[i]);
      display(iconActivated[i]);
    };
  };
};

function checkErrorMessages() {
  for(var i = 0; i < errorMessages.length; i++) {
    if(!errorMessages[i].classList.contains('visibility-hidden') && i === 0) {
      errorMessages[i].classList.add('visibility-hidden');
    } else if(!errorMessages[i].classList.contains('visibility-hidden')) {
      errorMessages[i].classList.add('visibility-hidden');
      inputs[i].classList.toggle('error-message-color');
    }
  }
}


function showErrorMessage(index) {
  checkErrorMessages();
  errorMessages[index].classList.remove('visibility-hidden');
  warningIcons[index].classList.remove('visibility-hidden');
  if(index > 0) {
    inputs[index].classList.toggle('error-message-color');
  }
};

function loopCategoryInputs() {
  for(var i = 0; i < categoryInputs.length; i++) {
    if(categoryInputs[i].checked) {
      return true;
    }
  };
  return false;
};

function checkInputs() {
  for(var i = 1; i < inputs.length; i++) {
    if(!inputs[i].value) {
      showErrorMessage(i);
      return false;
    };
  };
  return true;
};

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

function validateForm() {
  if(!loopCategoryInputs()) {
    showErrorMessage(0);
  }
  else if (!checkInputs()) {
    checkInputs();
  }
  else {
    currentActivity = new Activity(currentIcon.id, inputActivity.value, inputMinutes.value, inputSeconds.value);
    displayTimer();
  };
};

function displayTime() {
  var time = Number(inputMinutes.value * 60) + Number(inputSeconds.value)
  var minutes = String(Math.trunc(time / 60)).padStart(2, 0);
  var seconds = String(Math.trunc(time % 60)).padStart(2, 0);
  timer.textContent = `${minutes}:${seconds}`;
};

function displayTimer() {
  hide(form);
  display(containerTimer);
  changeTitle();
  displayTime();
  timer.classList.remove('congratulatory-message');
  var category;
  for (var i = 0; i < categoryInputs.length; i++){
    if(categoryInputs[i].checked) {
      category = categoryInputs[i].classList;
    }
  };
  if(category.contains("study-box")) {
    buttonTimer.classList.add("timer-study-color");
  }
  else if(category.contains("meditate-box")) {
    buttonTimer.classList.add("timer-meditate-color");
  return true;
}   else {
    buttonTimer.classList.add("timer-exercise-color");
 }
};

function startCountdown() {
  currentActivity.countdown();
};

function changeTimerContent(minutes, seconds) {
  timer.textContent = `${minutes}:${seconds}`;
};

function logActivity() {
  hide(defaultText);
  currentActivity.markComplete();
  currentActivity.saveToStorage();
  showNewCard();
  clearTimerSection();
  hide(buttonLogActivity);
};

function clearTimerSection() {
  hide(containerTimer);
  display(buttonCreateNewActivity);
  changeInnerText(mainTitle, "Completed Activity");
};

function showNewCard() {
var card = document.createElement("li");
pastActivityList.appendChild(card);
card.classList.add("past-activity-card");
card.innerHTML =
`<article class="card">
    <li class="past-activity">
     <p class="past-activity-category">${currentActivity.category.charAt(0).toUpperCase() + currentActivity.category.slice(1)}</p>
     <div class="color-icon"></div>
    </li>
    <time class="past-activity-time">${currentActivity.minutes} MIN ${currentActivity.seconds} SECONDS</time>
    <li class="past-activity-description">
      <p>${currentActivity.description}</p>
    </li>
 </article>`;
 pastActivities.push(currentActivity);
 showCardMarkerColor();
};

function showCardMarkerColor() {
  var pastActivityCardColor = document.querySelectorAll(".color-icon");
    for(i = 0; i < pastActivities.length; i++){
      if(pastActivities[i].category === "meditate") {
        pastActivityCardColor[i].classList.add("card-meditate-color");
      } else if(pastActivities[i].category === "study") {
        pastActivityCardColor[i].classList.add("card-study-color");
      } else {
        pastActivityCardColor[i].classList.add("card-exercise-color");
      }
    };
  };

function displayMessage() {
  timer.textContent = `YOU DID IT! CONGRATULATIONS ON FINISHING YOUR ${currentActivity.category.toUpperCase()} SESSION!`;
  timer.classList.add('congratulatory-message');
  display(buttonLogActivity);
};

function goHome() {
  hide(buttonCreateNewActivity);
  hide(containerTimer);
  display(form);
  checkErrorMessages();
  changeInnerText(mainTitle, "Start Activity");
  for(var i = 0; i < inputs.length; i++) {
    if(i > 0) {
      clearInputs();
    } else {
      clearCategory();
    }
  };
};

function clearCategory() {
  for(var i = 0; i < categoryInputs.length; i++) {
    if(categoryInputs[i].checked) {
      categoryInputs[i].checked = false;
      checkIcons();
    }
  };
};

function clearInputs() {
  for(var i = 0; i < 3; i++) {
    inputs[i + 1].value = "";
  };
};

function listPastCards() {
  var storagePrefix = "storage ";
  for(var i = 0; i < localStorage.length; i++) {
    var saved = localStorage.getItem(`${storagePrefix}${i}`);
    saved = JSON.parse(saved);
    pastActivities.push(saved);
  };
};

function showPastActivityCards() {
  listPastCards();
  if(localStorage.length > 0){
  hide(defaultText);
  }
  for(var i = 0; i < localStorage.length; i++) {
    var card = document.createElement("li");
    pastActivityList.appendChild(card);
    card.classList.add("past-activity-card");
    card.innerHTML =
    `<article class="card">
         <li class="past-activity">
           <p class="past-activity-category">${pastActivities[i].category.charAt(0).toUpperCase() + pastActivities[i].category.slice(1)}</p>
           <div class="color-icon"></div>
        </li>
        <time class="past-activity-time">${pastActivities[i].minutes} MIN ${pastActivities[i].seconds} SECONDS</time>
        <li class="past-activity-description">
          <p>${pastActivities[i].description}</p>
        </li>
     </article>`
  };
  showCardMarkerColor();
};
