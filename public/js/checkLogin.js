// Get the 'choice' button element
const choiceButton = document.getElementById('choice');

// Check if the 'choice' button exists on the page
if (choiceButton) {
    choiceButton.addEventListener('click', function (event) {
        // Assuming `isLoggedIn` is passed as a data attribute from EJS
        if (!window.isLoggedIn) {
            event.preventDefault(); // Prevent navigation
            alert('Please log in to continue'); // Alert the user
            window.location.href = '/login'; // Redirect to login page
        }
    });
}
