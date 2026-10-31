// Import the functions you need from the SDKs you need
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { collection, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, deleteField } from "firebase/firestore";
import { doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { onAuthReady } from "/src/authentication.js";
import { db } from "/src/firebaseConfig.js";


// If you have custom global styles, import them as well:
// import '../styles/style.css';


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

// Function to save privacy setting to Firestore
async function savePrivacySetting(selectedPrivacy) {
    //Reference to collections -> PostID -> privacySettingsTest -> selectedPrivacy
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

async function saveAutoUpdateDaySettings(selectedDay) {
    //Reference to collections -> PostID -> privacySettingsTest -> selectedPrivacy
    const privacyDocRef = doc(db, "posts", "PostID");
    console.log("Testing");
    try {
        //merge with whatever is in already
        await updateDoc(privacyDocRef, { day: selectedDay }, { merge: true });
        console.log("Auto-update day setting saved:", selectedDay);
    } catch (error) {
        console.error("Error saving auto-update day setting:", error);
    }
}

async function saveAutoUpdateTimeSettings(selectedTime) {
    //Reference to collections -> PostID -> privacySettingsTest -> selectedPrivacy
    const privacyDocRef = doc(db, "posts", "PostID");
    console.log("Testing");
    try {
        //merge with whatever is in already
        await updateDoc(privacyDocRef, { time: selectedTime }, { merge: true });
        console.log("Auto-update time setting saved:", selectedTime);
    } catch (error) {
        console.error("Error saving auto-update time setting:", error);
    }
}

async function savePostDateSettings(selectedDate) {
    //Reference to collections -> PostID -> privacySettingsTest -> selectedPrivacy
    const privacyDocRef = doc(db, "posts", "PostID");
    try {
        await updateDoc(privacyDocRef, { postDate: selectedDate }, { merge: true });
        console.log("Post date setting saved:", selectedDate);
    } catch (error) {
        console.error("Error saving post date setting:", error);
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


document.getElementById("post-date")?.addEventListener("input", async (event) => {
    try {
        const selectedDate = event.target.value;
        console.log("Selected post date:", selectedDate);
        await savePostDateSettings(selectedDate);
    } catch (error) {
        console.error("Error saving post date setting:", error);
    }
});



function addGoalData() {
    const goalsRef = collection(db, "posts");
    console.log("Adding sample post data...");
    addDoc(goalsRef, {
        name: "blank", user: "blank", status: "blank", description: "blank",
        comments: 0, likes: 0, image: "grey.png", last_updated: serverTimestamp()

    });
    addDoc(goalsRef, {
        name: "blank", user: "blank", status: "blank", description: "blank",
        comments: 0, likes: 0, image: "grey.png", last_updated: serverTimestamp()

    });
    addDoc(goalsRef, {
        name: "blank", user: "blank", status: "blank", description: "blank",
        comments: 0, likes: 0, image: "grey.png", last_updated: serverTimestamp()

    });
}

async function seedGoals() {
    const goalsRef = collection(db, "posts");
    console.log("Testing")
    const querySnapshot = await getDocs(goalsRef);

    if (querySnapshot.empty) {
        console.log("Goal posts collection is empty. Seeding data...");
        addGoalData();
    } else {
        console.log("Goal posts collection already contains data. Skipping seed.");
    }
}

async function displayGoalPostsDynamically() {
    let cardTemplate = document.getElementById("goal-card-template");
    const goalPostsCollectionRef = collection(db, "posts");

    try {
        const querySnapshot = await getDocs(goalPostsCollectionRef);
        querySnapshot.forEach(goalPostDoc => {

            // Clone the template
            let newcard = cardTemplate.content.cloneNode(true);
            // Get goal data once
            const goalPost = goalPostDoc.data();

            // Populate the card with hike data
            newcard.querySelector('.card-title').textContent = goalPost.name;
            newcard.querySelector('.card-text').textContent = goalPost.description;
            newcard.querySelector('.card-image').src = "/images/" + goalPost.image;

            // Attach the new card to the container
            console.log(newcard)
            document.getElementById("goal-posts-go-here").appendChild(newcard);

        });
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
}

// Call the function to display cards when the page loads
// document.addEventListener('DOMContentLoaded', sayHello);


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
displayGoalPostsDynamically();
displayGoal();
showName();
seedGoals();



