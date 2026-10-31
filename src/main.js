import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';


// Import the functions you need from the SDKs you need


// If you have custom global styles, import them as well:
// import '../styles/style.css';

function sayHello() {

}

// Import the file that has the authentication helper function we want to use.
// The function we want to use is called "onAuthReady" which returns the login state
import { onAuthReady } from "/src/authentication.js";
import { db } from "./firebaseConfig.js";
import { doc, onSnapshot } from "firebase/firestore";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

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

async function addGoal(userID, goalSubject, goalSteps) {
    try {
        const goalsRef = collection(db, "users", userID, "Goals");

        const docRef = await addDoc(goalsRef, {
            goalSubject: goalSubject,
            goalSteps: goalSteps,          
            createdAt: serverTimestamp()
        });

        console.log("Goal added with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding goal:", error);
    }
}


addGoal("user123", "Pass COMP 1537", [
    "Finish Assignment 4",
    "Review Express routing",
    "Practice for quiz"
]);