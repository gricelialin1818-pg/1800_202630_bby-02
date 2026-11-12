import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { collection, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, deleteField } from "firebase/firestore";
import { doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { onAuthReady } from "/src/authentication.js";
import { db } from "/src/firebaseConfig.js";

const goalId = sessionStorage.getItem("currentPostId");
const postImage = sessionStorage.getItem("currentPostImage");
const postName = sessionStorage.getItem("currentPostName");
const postDescription = sessionStorage.getItem("currentPostDescription");
console.log("Current Post ID:", goalId);


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

async function saveAutoUpdateDaySettings(selectedDay) {
    //Reference to collections -> PostID -> autoUpdateDay
    const privacyDocRef = doc(db, "posts", goalId);
    console.log("Testing");
    try {
        //merge with whatever is in already
        await updateDoc(privacyDocRef, { autoUpdateDay: selectedDay }, { merge: true });
        console.log("Auto-update day setting saved:", selectedDay);
    } catch (error) {
        console.error("Error saving auto-update day setting:", error);
    }
}

async function saveAutoUpdateTimeSettings(selectedTime) {
    //Reference to collections -> PostID -> autoUpdateTime
    const privacyDocRef = doc(db, "posts", goalId);
    console.log("Testing");
    try {
        //merge with whatever is in already
        await updateDoc(privacyDocRef, { autoUpdateTime: selectedTime }, { merge: true });
        console.log("Auto-update time setting saved:", selectedTime);
    } catch (error) {
        console.error("Error saving auto-update time setting:", error);
    }
}

async function savePostDateSettings(selectedDate) {
    //Reference to collections -> PostID -> postDate
    const privacyDocRef = doc(db, "posts", goalId);
    try {
        await updateDoc(privacyDocRef, { postDate: selectedDate }, { merge: true });
        console.log("Post date setting saved:", selectedDate);
    } catch (error) {
        console.error("Error saving post date setting:", error);
    }
}

//Function to read auto-update day setting from user input
document.querySelectorAll('.auto-update-day-option').forEach(option => {
    option.addEventListener('click', async (event) => {
        try {
            event.preventDefault();
            const selectedValue = event.target.getAttribute('data-value');
            console.log("Selected day setting:", selectedValue);
            const selectedText = event.target.textContent;

            document.getElementById('auto-update-day-placeholder').textContent = selectedText;
            saveAutoUpdateDaySettings(selectedValue);
        } catch (error) {
            console.error("Error updating day setting:", error);
        }
    })
});


//Function to read auto-update time setting from user input
document.querySelectorAll('.auto-update-time-option').forEach(option => {
    option.addEventListener('click', async (event) => {
        try {
            event.preventDefault();
            const selectedValue = event.target.getAttribute('data-value');
            console.log("Selected time setting:", selectedValue);
            const selectedText = event.target.textContent;

            document.getElementById('auto-update-time-placeholder').textContent = selectedText;
            saveAutoUpdateTimeSettings(selectedValue);
        } catch (error) {
            console.error("Error updating time setting:", error);
        }
    })
});

//function to read post date from user input
document.getElementById("post-date")?.addEventListener("input", async (event) => {
    try {
        const selectedDate = event.target.value;
        console.log("Selected post date:", selectedDate);
        await savePostDateSettings(selectedDate);
    } catch (error) {
        console.error("Error saving post date setting:", error);
    }
});


showName();
