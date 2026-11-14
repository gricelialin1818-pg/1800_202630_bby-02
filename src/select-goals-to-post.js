// Import the functions you need from the SDKs you need
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { collection, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, deleteField } from "firebase/firestore";
import { doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { onAuthReady } from "/src/authentication.js";
import { db } from "/src/firebaseConfig.js";

function showName() {
    // Pass a CALLBACK function to run when Firebase finishes checking login status
    onAuthReady(function (user) {  // Firebase passes the user object (or null)
        if (user) {
            // User is logged in
            const name = user.displayName || user.email;  // Use email if name is missing
            const checkName = document.getElementById("name-goes-here");
            if (!checkName) {
                return
            }

            document.getElementById("name-goes-here").textContent = name;
        }
    });
}


// Function to retrieve goal name and description from the
//database and put them into cards on the select-goals-to-post page
//Code is similar to main-goals-listed.js
async function displayGoal() {

    onAuthReady(async function (user) {
        const goalsCollection = collection(db, "users", user.uid, "goals");
        //changed to refer to the userID individually instead of just
        //adding everything to users
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
                <a href="post-details.html?id=${goalDoc.id}" class="btn btn-primary theme-primary">Post</a>
                </div>
            </div>
            `
            goalCard.querySelector("#goal-title").textContent = goalName
            document.getElementById("cards-container").appendChild(goalCard)
        }

    });

}




//only run the collectGoalData function
//when the continue button is clicked
displayGoal();
showName();



