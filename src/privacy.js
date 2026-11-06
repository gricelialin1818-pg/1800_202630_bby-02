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

            document.getElementById("name-goes-here").textContent = name + "!";
        }
    });
}

// Function to save privacy setting to Firestore
async function savePrivacySetting(selectedPrivacy) {
    //Reference to collection of posts -> PostID -> privacy
    const privacyDocRef = doc(db, "posts", "PostID");
    console.log("Testing");
    try {
        //merge with whatever is in already
        await setDoc(privacyDocRef, { privacy: selectedPrivacy }, { merge: true });
        console.log("Privacy setting saved:", selectedPrivacy);
    } catch (error) {
        console.error("Error saving privacy setting:", error);
    }
}


//Function to read privacy setting from user input
document.querySelectorAll('.privacy-option').forEach(option => {
    option.addEventListener('click', async (event) => {
        try {
            event.preventDefault();
            const selectedValue = event.target.getAttribute('data-value');
            console.log("Selected privacy setting:", selectedValue);
            const selectedText = event.target.textContent;

            document.getElementById('privacy-placeholder').textContent = selectedText;
            savePrivacySetting(selectedValue);
        } catch (error) {
            console.error("Error updating privacy setting:", error);
        }
    })
});




showName();