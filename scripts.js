let selectContainer = document.getElementById("selectContainer");
let result = document.getElementById("result");

let resultText = document.createTextNode("");
result.appendChild(resultText);

// Create the initial select menu when the page loads
let initialOptions;
let options;


/* DO BROWSER DETECTION */
if (!document.getElementById) {
    // really old browser ;(
    window.location = "legacy.html"; // Page telling them that their browser is garbage and suggesting a new one
}

fetch('data.json')
    .then(response => response.json())
    .then(data => {
        initialOptions = Object.keys(data); // Assign the value inside the fetch callback *magic*
        options = data;
        let select = createSelect(initialOptions);
        selectContainer.appendChild(select);
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });


// Function to create and populate select menus
function createSelect(optionsList) {
    let select = document.createElement("select");

    // Add a blank option as the initial option
    let blankOption = document.createElement("option");
    blankOption.value = "";
    blankOption.textContent = "Select an option";
    select.appendChild(blankOption); // Ad a blank option to each select menu

    optionsList.forEach((option) => {
        let optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.textContent = option;
        select.appendChild(optionElement);
    });
    select.setAttribute('onchange', 'updateForm()');
    // select.addEventListener("change", updateForm);
    return select;
}

function updateForm() {
    let selects = selectContainer.querySelectorAll("select");
    let selectedOptions = Array.from(selects)
        .map((s) => s.value)
        .filter(Boolean);
    let currentOptions = options;

    // Find the index of the select that triggered the change event
    let selectedIndex = Array.from(selects).indexOf(event.target);

    // Remove all menus after the current one
    for (let i = selects.length - 1; i > selectedIndex; i--) {
        selectContainer.removeChild(selects[i]);
    }

    selectedOptions.forEach((option, index) => {
        currentOptions = currentOptions[option];
        if (currentOptions && Object.keys(currentOptions).length > 0) {
            // Check if there are child options
            if (index < selects.length - 1) {
                // If it's not the last select element, update its options
                selects[index + 1].innerHTML = "";
                let newOptions = Object.keys(currentOptions);
                newOptions.forEach((newOption) => {
                    let optionElement = document.createElement("option");
                    optionElement.value = newOption;
                    optionElement.textContent = newOption;
                    selects[index + 1].appendChild(optionElement);
                });
            } else {
                saveToLocalStorage(selectedOptions);
                // If it's the last select element, create a new one
                let select = createSelect(Object.keys(currentOptions));
                selectContainer.appendChild(select);
            }
        } else {
            // If there are no child options, stop and print the result
            let replacedSelectionOptions = selectedOptions.toString().replace(/,/g, ' ');
            printResult(replacedSelectionOptions);
        }
    });
}

function populateFromLocalStorage() {

}

function saveToLocalStorage(sessionOptions) {
    console.log(sessionOptions);
    // Store the json in localStorage as a string
    var jsonString = JSON.stringify(sessionOptions);
    localStorage.setItem("diveOptions", jsonString);
}

function printResult(selectedOptions) {
    resultText.textContent = "You chose: " + selectedOptions;
}

// Animating the falling divers. Probably not very performant :)
// I tried to add a check for when the user is off the page, using this, but it didn't work out:
// https://stackoverflow.com/questions/68427135/can-i-use-javascript-do-detect-whether-a-user-is-on-another-open-tab-rather-tha
const boxes = [];

function createBox() {
    const box = document.createElement('img');
    box.src = "./diver.png";
    box.style.width = '80px';
    box.style.height = '80px';
    box.style.position = 'absolute';
    box.style.zIndex = -1;
    document.body.appendChild(box);

    const startPositionX = Math.random() * window.innerWidth;
    const startPositionY = 0;
    let positionY = startPositionY;

    box.style.left = startPositionX + 'px';

    function animate() {
        positionY += 2; // Adjust the speed of falling here
        box.style.top = positionY + 'px';

        // Add rotation animation
        box.style.transform = `rotate(${positionY}deg)`;

        if (positionY < window.innerHeight) {
            requestAnimationFrame(animate);
        } else {
            document.body.removeChild(box);
            const index = boxes.indexOf(box);
            boxes.splice(index, 1);
        }
    }

    boxes.push(box);
    animate();
}


function createRandomBox() {
    createBox();
    const nextCreationTime = Math.random() * 1400 + 800; // Random interval between 0.5s and 1.5s
    setTimeout(createRandomBox, nextCreationTime);
}

createRandomBox(); // Start creating boxes

function animateBoxes() {
    for (const box of boxes) {
        box.style.left = (parseFloat(box.style.left) + Math.random() - 0.5) + 'px';
    }

    requestAnimationFrame(animateBoxes);
}

animateBoxes();