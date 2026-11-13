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



//takes the name and description of the goal
//on the add-goal-screen 
//and makes a new goal in the db
async function collectGoalData() {
    //onAuthReady user allows for user.uid to be accessed for the path
    onAuthReady(async function (user) {
        if (user) {
            const goalNameInput = document.getElementById("goal-name-input")
            const goalDetailsInput = document.getElementById("goal-details-input")
            const goalNameInputValue = goalNameInput.value
            const goalDetailsInputValue = goalDetailsInput.value
            const newGoal = await addDoc(collection(db, "users", user.uid, "goals"), {
                "goal-description": goalDetailsInputValue,
                "goal-name": goalNameInputValue
            });

            sessionStorage.setItem("newGoalId", newGoal.id);

            const savedGoal = await getDoc(newGoal);
            console.log("Exists:", savedGoal.exists(), "Fields:", savedGoal.data());
            window.location.href = "add-goal-details.html"

        }
    });

}



//only run the collectGoalData function
//when the continue button is clicked
displayGoal();
showName();



