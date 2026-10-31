import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { collection, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, deleteField } from "firebase/firestore";
import { onAuthReady } from "/src/authentication.js";
import { db } from "/src/firebaseConfig.js";


// Import the functions you need from the SDKs you need


// If you have custom global styles, import them as well:
// import '../styles/style.css';

function sayHello() {

}

// Import the file that has the authentication helper function we want to use.
// The function we want to use is called "onAuthReady" which returns the login state

import { doc, onSnapshot } from "firebase/firestore";


function showName() {
    // Pass a CALLBACK function to run when Firebase finishes checking login status
    onAuthReady(function (user) {  // Firebase passes the user object (or null)
        if (user) {
            // User is logged in
            const name = user.displayName || user.email;  // Use email if name is missing
            document.getElementById("name-goes-here").textContent = name + "!";
        }
    });
}

showName();
// document.addEventListener('DOMContentLoaded', sayHello);



// Function to retrieve goal name and description from the
//database and put them into cards on the mainGoalsListed page
async function displayGoal() {
    const goalsCollection = collection(db, "users");
    const goalsData = await getDocs(goalsCollection);
    for (const goalDoc of goalsData.docs) {
        const goalDocData = goalDoc.data();
        const goalDesc = goalDocData["goal-description"];
        const goalName = goalDocData["goal-name"];
        const goalCard = document.createElement("div");
        goalCard.innerHTML = `
        <div class="card">
      <div class="card-body">
        <h4 class="card-title"><span id="goal-title"></span></h4>
        <a href="goal-details.html" class="btn btn-primary theme-primary">Details</a>
        <p class="card-text">Deadline</p>
      </div>
    </div>
        `
        goalCard.querySelector("#goal-title").textContent = goalName
        document.getElementById("cards-container").appendChild(goalCard)
    }

}

displayGoal();

//takes the name and description of the goal
//on the add-goal-screen 
//and makes a new goal in the db
async function collectGoalData() {
    const goalNameInput = document.getElementById("goal-name-input")
    const goalDetailsInput = document.getElementById("goal-details-input")
    const goalNameInputValue = goalNameInput.value
    const goalDetailsInputValue = goalDetailsInput.value
    const newGoal = await addDoc(collection(db, "users"), {
        "goal-description": goalDetailsInputValue,
        "goal-name": goalNameInputValue
    });
    window.location.href = "deadline.html"
}


const submitButton = document.getElementById("save-goal");
if (submitButton){
    submitButton.addEventListener("click",collectGoalData);
    goalCard.querySelector(".goal-title").textContent = goalName;
}
//only run the collectGoalData function
//when the continue button is clicked



