/* Some constant strings that can be easily modified */
const API = "https://api.genderize.io/?name=";
const PREDICTION_DEFAULT = "Submit to see the result"
const PROBABILITY_DEFAULT = "Submit to see the probability"
const SAVED_DATA_DEFAULT = "There is no saved answer yet."


/* It will be executed if submit button gets clicked */
function submitAction() {
    // Hide error container first. It will be displayed if needed.
    hideErrorContainer();

    // Get the value from the "name" input
    const nameInput = document.getElementById("name").value;

    // Validate the name input for invalid characters
    if (!isValidName(nameInput)) {
        displayErrorMessage("Invalid characters.");
        return; // Stop further execution if validation fails
    }

    // Make an API request to API with the name as a query parameter
    fetch(`${API}${encodeURIComponent(nameInput)}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            const gender = data.gender
            const probability = data.probability
            if (gender != null) {
                document.getElementById("prediction").textContent = gender;
                document.getElementById("probability").textContent = probability;
            } else {
                document.getElementById("prediction").textContent = PREDICTION_DEFAULT;
                document.getElementById("probability").textContent = PROBABILITY_DEFAULT;
                displayErrorMessage("An error occurred :(");
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });

    // Update the dashed box
    updateSavedDataDisplay()
}

/* It will be executed if save button gets clicked */
function saveData() {
    // Hide error container first. It will be displayed if needed.
    hideErrorContainer();

    // Get the value from the "name" input
    const nameInput = document.getElementById("name").value;

    // Validate the name input for invalid characters
    if (!isValidName(nameInput)) {
        displayErrorMessage("Invalid characters.");
        return; // Stop further execution if validation fails
    }

    // Get the selected radio button value
    const genderValue = document.querySelector('input[name="gender"]:checked');

    // Check if a radio button is selected
    if (!genderValue) {
        displayErrorMessage("Please choose a gender.");
        return; // Stop further execution if no radio button is selected
    }

    const savedData = {
        key: nameInput,
        value: genderValue.value
    };

    // Save to localStorage
    saveToLocalStorage(savedData);

    // Update the dashed box
    updateSavedDataDisplay()

    console.log("Saved Data:", savedData);
}

/* It gets a strings and checks if it is valid (It has only English letters with spaces) or not */
function isValidName(name) {
    // Use a regular expression to check
    return /^[A-Za-z\s]+$/.test(name);
}

/* It gets a string and make the error box visible while containing an error message equals to the string */
function displayErrorMessage(message) {
    const errorContainer = document.getElementById("error-container");

    errorContainer.textContent = message;
    errorContainer.style.visibility = "visible";
}

/* It makes the error box hidden (for cases that we don't have any error) */
function hideErrorContainer() {
    const errorContainer = document.getElementById("error-container");
    errorContainer.style.visibility = "hidden";
}

/* It saves a pair to local storage */
function saveToLocalStorage(data) {
    // Check if localStorage is supported
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem(data.key, data.value);
    } else {
        // Handle the case where localStorage is not supported
        console.error("localStorage is not supported in this browser.");
    }
}

/* It updates the dashed rectangle message due to the saved data in local storage */
function updateSavedDataDisplay() {
    // Get the value from the "name" input
    const nameInput = document.getElementById("name").value;

    // Check if there is a saved value in localStorage for the input name
    const savedValue = localStorage.getItem(nameInput);

    // Get the appropriate paragraph element
    const savedDataDisplay = document.getElementById("saved-data");

    // Update the paragraph text based on the localStorage value or use the default value
    savedDataDisplay.textContent = savedValue || SAVED_DATA_DEFAULT;
}

/* It will be executed if clear button gets clicked */
function clearLocalStorage() {
    // Get the value from the "name" input
    const nameInput = document.getElementById("name").value;

    // Check if there is a saved value in localStorage for the input name
    const savedValue = localStorage.getItem(nameInput);

    // If there is a saved value, remove the key-value pair from localStorage
    if (savedValue !== null) {
        localStorage.removeItem(nameInput);
        console.log(`Removed key "${nameInput}" from localStorage.`);
    } else {
        console.log(`No matching key found for "${nameInput}" in localStorage.`);
    }

    // Update the dashed box
    updateSavedDataDisplay()
}
