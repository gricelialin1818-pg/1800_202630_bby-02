import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {collection, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, deleteField} from "firebase/firestore";
import { onAuthReady } from "/src/authentication.js";
import {db} from "/src/authentication.js";

// Import the functions you need from the SDKs you need


// If you have custom global styles, import them as well:
// import '../styles/style.css';

function sayHello() {

}

// Import the file that has the authentication helper function we want to use.
// The function we want to use is called "onAuthReady" which returns the login state


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
    const goalsCollection = collection(db, "goals");
    const goalsData = await getDocs(goalsCollection);
    for (const goalDoc of goalsData.docs) {
        const goalDocData = goalDoc.data();
        const goalDesc = goalDocData["goal-description"];
        const goalName = goalDocData["goal-name"];
        const goalCard = document.createElement("div");
        document.getElementById("goal-title").textContent = "test"
    }

    
}

displayGoal();

