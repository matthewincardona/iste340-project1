let selectContainer = document.getElementById("selectContainer");
let result = document.getElementById("result");

let resultText = document.createTextNode("");
result.appendChild(resultText);

// Create the initial select menu when the page loads
let initialOptions; // Declare initialOptions outside of the fetch function
let options;

fetch('data.json')
    .then(response => response.json())
    .then(data => {
        initialOptions = Object.keys(data); // Assign the value inside the fetch callback
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
    select.addEventListener("change", updateForm);
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
                // If it's the last select element, create a new one
                let select = createSelect(Object.keys(currentOptions));
                selectContainer.appendChild(select);
            }
        } else {
            // If there are no child options, stop and print the result
            printResult(selectedOptions);
        }
    });
}



function printResult(selectedOptions) {
    resultText.textContent = selectedOptions;
}