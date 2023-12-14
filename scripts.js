let selectContainer = document.getElementById("selectContainer");
let result = document.getElementById("result");

let resultText = document.createTextNode("");
result.appendChild(resultText);

// Create the initial select menu when the page loads
let options;

/* DO BROWSER DETECTION */
if (!document.getElementById) {
  // really old browser ;(
  window.location = "legacy.html"; // Page telling them that their browser is garbage and suggesting a new one
}

fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    options = data;
    let select = new SelectCreator(options);
    selectContainer.appendChild(select.render());
    console.log(data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

// Create and fill select menus
function SelectCreator(data) {
  this.data = data;
  this.selectedIndex = 0;
  this.selectedOptions = [];

  this.render = function () {
    let select = document.createElement("select");

    // Add a blank option as the initial option
    let blankOption = document.createElement("option");
    blankOption.value = "";
    blankOption.textContent = "Select an option";
    select.appendChild(blankOption);

    let optionsList = Object.keys(this.data);
    optionsList.forEach((option) => {
      let optionElement = document.createElement("option");
      optionElement.value = option;
      optionElement.textContent = option;
      select.appendChild(optionElement);
    });

    select.addEventListener("change", () => this.updateForm(select));
    return select;
  };

  this.updateForm = function (select) {
    this.selectedIndex = this.selectedOptions.length;
    this.selectedOptions.push(select.value);
    let currentOptions = this.data;

    // Remove all menus after the current one
    while (selectContainer.lastChild && selectContainer.lastChild !== select) {
      selectContainer.removeChild(selectContainer.lastChild);
    }

    currentOptions = currentOptions[select.value];

    if (currentOptions && Object.keys(currentOptions).length > 0) {
      // Check if there are child options
      let newOptions = Object.keys(currentOptions);
      let newSelect = new SelectCreator(currentOptions);

      // If it's not the last select element, update its options
      selectContainer.appendChild(newSelect.render());
    } else {
      this.saveToLocalStorage();
      // If it's the last select element, print the result
      let replacedSelectionOptions = this.selectedOptions.join(" ");
      this.printResult(replacedSelectionOptions);
    }
  };

  this.saveToLocalStorage = function () {
    console.log(this.selectedOptions);
    // Store the json in localStorage as a string
    var jsonString = JSON.stringify(this.selectedOptions);
    localStorage.setItem("diveOptions", jsonString);
  };

  this.printResult = function (selectedOptions) {
    resultText.textContent = "You chose: " + selectedOptions;
  };
}

// Animating the falling divers. Probably not very performant :)
// I tried to add a check for when the user is off the page, using this, but couldn't figure it out:
// https://stackoverflow.com/questions/68427135/can-i-use-javascript-do-detect-whether-a-user-is-on-another-open-tab-rather-tha
const divers = [];

function createDiver() {
  const diver = document.createElement("img");
  diver.src = "./diver.png";
  diver.style.width = "80px";
  diver.style.height = "80px";
  diver.style.position = "absolute";
  diver.style.zIndex = -1;
  document.body.appendChild(diver);

  const startPositionX = Math.random() * window.innerWidth;
  const startPositionY = 0;
  let positionY = startPositionY;

  diver.style.left = startPositionX + "px";

  function animate() {
    positionY += 2; // Adjust the speed of falling here
    diver.style.top = positionY + "px";

    // Add rotation animation
    diver.style.transform = `rotate(${positionY}deg)`;

    if (positionY < window.innerHeight) {
      requestAnimationFrame(animate);
    } else {
      document.body.removeChild(diver);
      const index = divers.indexOf(diver);
      divers.splice(index, 1);
    }
  }

  divers.push(diver);
  animate();
}

function createRandomDiver() {
  createDiver();
  const nextCreationTime = Math.random() * 1400 + 800; // Random interval between 0.5s and 1.5s
  setTimeout(createRandomDiver, nextCreationTime);
}

createRandomDiver(); // Start creating divers
