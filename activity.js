class Activity {
  constructor(category, description, minutes, seconds, completed, id) {
    this.category = category;
    this.description = description;
    this.minutes = minutes;
    this.seconds = seconds;
    this.completed = completed;
    this.id = id;
  };
  countdown(){
    var time = Number(this.minutes * 60) + Number(this.seconds)
    var decreaseTime = setInterval(function() {
      var minutes = String(Math.trunc(time / 60)).padStart(2, 0)
      var seconds = String(Math.trunc(time % 60)).padStart(2, 0)
      timer.textContent = `${minutes}:${seconds}`;
      time--;
      if(time === -1) {
        clearInterval(decreaseTime);
        timerButton.innerText = 'COMPLETE!';
        displayMessage();
      }
    }, 1000);
  };
  markComplete(){
    console.log();
  };
  saveToStorage(){
    var savedActivity = JSON.stringify(this);
        if(localStorage.length === 0) {
          var key = "storage " + 0
          localStorage.setItem(key, savedActivity);
        } else {
          var key = "storage " + localStorage.length;
          localStorage.setItem(key, savedActivity);
        }
      };
  };
