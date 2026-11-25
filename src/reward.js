// Import the functions you need from the SDKs you need
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { collection, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, deleteField } from "firebase/firestore";
import { doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { onAuthReady } from "/src/authentication.js";
import { db, auth } from "/src/firebaseConfig.js";

//Import alerts and confirms from Swal
import Swal from 'sweetalert2'

//APPLY FONT TO THE WHOLE {body}
document.body.style.fontFamily = 'Inter-Main-Font'

// Get the goal ID
const editGoalId = new URLSearchParams(window.location.search).get("id");
const goalId = editGoalId || sessionStorage.getItem("newGoalId");

await auth.authStateReady(); //wait for user to authenticate first
const user = auth.currentUser;


// Import the file that has the authentication helper function we want to use.
// The function we want to use is called "onAuthReady" which returns the login state
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

let rewardForm = document.getElementById("reward-message");
//When finalize goal is clicked, update firebase and return to main page
document.getElementById("finalize-goal").addEventListener('click', async () => {
    let goalReward = rewardForm.value;
    const goalRef = doc(db, "users", user.uid, "goals", goalId);
    await updateDoc(goalRef, {
        reward: goalReward
    });
    const result = await Swal.fire({//Send alert confirming that a goal was made
        title: "Congrats on Making Your Goal!",
        text: "Head to the home page to check it out",
        icon: "success",
        confirmButtonText: "Go To Home Page",
        confirmButtonColor: "#20263A",
    })
    if (result) {
        window.location.href = "main-goals-listed.html"
    }
})

//Change the rewardForm if one of the common goals buttons is clicked
document.getElementById("reward-1").addEventListener('click', () => {
    rewardForm.value = "I will treat myself to some time with friends.";
})
document.getElementById("reward-2").addEventListener('click', () => {
    rewardForm.value = "I will treat myself to my favourite food.";
})
document.getElementById("reward-3").addEventListener('click', () => {
    rewardForm.value = "I will play some video games.";
})
document.getElementById("reward-4").addEventListener('click', () => {
    rewardForm.value = "I will grab a drink for myself.";
})
document.getElementById("reward-5").addEventListener('click', () => {
    rewardForm.value = "I will go to sleep.";
})