const errorMsg = document.querySelector(".error-wrapper span");
const checkBtns = document.querySelectorAll(".goal-card input[type='radio']");
const allGoalCards = document.querySelectorAll(".goal-card");
const bar = document.querySelector(".bar");
const goalEntryFields = document.querySelectorAll("#goal-entryField");
const goalDone = document.querySelector("#done");
const quote = document.getElementById("quote");
let barWidth = 0;
let goalCompleted = 0;
let motivationalQuotes = [
  "“Move one step ahead, today!”",
  "“Be the change you want to see in the world!”",
  "“The only thing we have to fear is fear itself”",
];

// mark the date when all the goals are completed
// Clear the localstorage whenever the nexday arrives
const newDate =
  new Date().getDate() +
  "/" +
  (new Date().getMonth() + 1) +
  "/" +
  new Date().getFullYear();

console.log(newDate);
if (localStorage.getItem("date") != newDate) {
  localStorage.clear();
  document.querySelector(".success-msg")?.remove();
}

// changing quotes according to the number of completed goals
function generateMotivationalQuotes() {
  if (goalCompleted == 0) {
    quote.innerText = motivationalQuotes[0];
  } else if (goalCompleted == 1) {
    quote.innerText = motivationalQuotes[1];
  } else if (goalCompleted == 2) {
    quote.innerText = motivationalQuotes[2];
  }
}

//automatically rendering values if there is any value set in the localstorage
goalEntryFields.forEach((goalEntryField, index) => {
  if (localStorage.getItem(`goal${index}`)) {
    goalEntryField.innerText = localStorage
      .getItem(`goal${index}`)
      .split(",")[0];
  } else {
    return;
  }
});
generateMotivationalQuotes(); // for generating quote on reload

// function that handles the tick behaviour
function radioTicked(index) {
  barWidth = barWidth + 33.33;
  bar.style.width = `${barWidth}%`;
  goalCompleted++;
  goalDone.innerText = goalCompleted;
  generateMotivationalQuotes();
  let newLocalstorageGoalValue =
    localStorage.getItem(`goal${index}`) &&
    localStorage.getItem(`goal${index}`).includes(",unchecked")
      ? localStorage.getItem(`goal${index}`).replace(",unchecked", ",checked")
      : localStorage.getItem(`goal${index}`).includes(",checked")
      ? localStorage.getItem(`goal${index}`)
      : localStorage.getItem(`goal${index}`) + ",checked";
  localStorage.setItem(`goal${index}`, newLocalstorageGoalValue);
}

// check if all the goals are done and then show a success message

const showSuccessMsg = () => {
  if (
    localStorage.getItem("goal0") &&
    localStorage.getItem("goal0").includes(",checked") &&
    localStorage.getItem("goal1") &&
    localStorage.getItem("goal1").includes(",checked") &&
    localStorage.getItem("goal2") &&
    localStorage.getItem("goal2").includes(",checked")
  ) {
    // set the date
    // show success message
    const successMsg = document.createElement("dialog");
    successMsg.classList.add("success-msg");
    successMsg.innerHTML = `<span>Success! You have completed all your goals!</span>`;
    successMsg.innerHTML += `<span>Get Ready For Another Day</span>`;
    const img = document.createElement("img");
    img.src = "/assests/Success.png";
    successMsg.insertAdjacentElement("afterbegin", img);

    document.body.appendChild(successMsg);

    successMsg.showModal();
    document.body.style.pointerEvents = "none";
  }
};

showSuccessMsg(); // this is a initial call so that after also the reload the success msg is shown

// This function is used to create a btn to uncheck the radio btn and also it does all the uncheck behaviour
function radioUnTick(checkBtn, index) {
  const uncheckBtn = document.createElement("button");
  uncheckBtn.classList.add("uncheck-btn");
  checkBtn.parentElement.appendChild(uncheckBtn);
  uncheckBtn.addEventListener("click", () => {
    checkBtn.checked = false;
    uncheckBtn.parentElement.removeChild(uncheckBtn);
    barWidth = barWidth - 33.33;
    bar.style.width = `${barWidth}%`;
    goalCompleted--;
    goalDone.innerText = goalCompleted;
    let newLocalstorageGoalValue = localStorage
      .getItem(`goal${index}`)
      .replace(",checked", ",unchecked");
    localStorage.setItem(`goal${index}`, newLocalstorageGoalValue);
  });
}

// add event listeners for each btn so that they can be only clickable when all 3 goals are set and also defining when to show the error msg
let isErrorMsg = false;
function checkIfAllGoalsAreSet() {
  let goalCardSpans = [];
  allGoalCards.forEach((goalCard) => {
    goalCardSpans.push(goalCard.querySelector("span").innerText);
  });

  if (goalCardSpans.includes("Add new goal...")) {
    errorMsg.style.display = "block";
    isErrorMsg = true;
  } else {
    errorMsg.style.display = "none";
    isErrorMsg = false;
  }

  if (isErrorMsg) {
    checkBtns.forEach((checkBtn) => {
      checkBtn.disabled = true;
    });
  } else {
    checkBtns.forEach((checkBtn) => {
      checkBtn.disabled = false;
      return true;
    });
  }
}

checkIfAllGoalsAreSet();
// setting progress bar width to be incremented by 33.33% each time a checkBtn is clicked
checkBtns.forEach((checkBtn, index) => {
  // checking if the radio btn is checked or not based on the localstorage
  if (
    localStorage.getItem(`goal${index}`) &&
    localStorage.getItem(`goal${index}`).includes(",checked")
  ) {
    checkBtn.checked = true;
    radioTicked(index);
    radioUnTick(checkBtn, index); // just after the tick , i am creating a btn on top of it so that the fetch data can be changed by the user on click
  }
  // adding event listener to each checkBtn so that onClick we can increment the progress bar
  checkBtn.addEventListener("click", () => {
    if (barWidth >= 99.99) {
      barWidth = 100;
      bar.style.width = `${barWidth}%`;
      goalCompleted = 3;
      goalDone.innerText = goalCompleted;
      return;
    } else if (checkBtn.checked == true) {
      radioTicked(index);
    }
    if (checkBtn.checked) {
      radioUnTick(checkBtn, index); // if the radiobtn is checked then a btn is created on top of it so that the user can uncheck it.
    }
  });
});

// adding event listener to each span in the goalcard so that onClick we can add a new goal
goalEntryFields.forEach((goalEntryField, index) => {
  goalEntryField.addEventListener("click", () => {
    // Check if an input already exists
    if (!goalEntryField.querySelector("input")) {
      const previousValue = goalEntryField.innerText;
      const input = document.createElement("input");
      input.placeholder = "Enter your goal...";
      input.type = "text";
      input.value = previousValue;
      input.minLength = 5;
      input.maxLength = 50;
      goalEntryField.innerHTML = "";
      goalEntryField.appendChild(input);
      input.focus();
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          let goal = input.value;
          localStorage.setItem(`goal${index}`, goal);
          goalEntryField.removeChild(input);
          goalEntryField.innerText = goal;
          checkIfAllGoalsAreSet();
        }
      });
    }
  });
});

// if the last btn is clicked as the finishing btn then it will show the success message and also set the date in the local storage
checkBtns.forEach((checkBtn) => {
  checkBtn.addEventListener("click", () => {
    if (
      localStorage.getItem("goal0") &&
      localStorage.getItem("goal0").includes(",checked") &&
      localStorage.getItem("goal1") &&
      localStorage.getItem("goal1").includes(",checked") &&
      localStorage.getItem("goal2") &&
      localStorage.getItem("goal2").includes(",checked")
    ) {
      const date =
        new Date().getDate() +
        "/" +
        (new Date().getMonth() + 1) +
        "/" +
        new Date().getFullYear();
      localStorage.setItem("date", date);
      showSuccessMsg();

      // confetti effect code

      const jsConfetti = new JSConfetti();
      const intervalId = setInterval(() => {
        jsConfetti.addConfetti();
      }, 1000);

      setTimeout(() => {
        clearInterval(intervalId);
        jsConfetti.clearCanvas();
      }, 5000);
    }
  });
});
