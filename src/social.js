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

//manual adding of post data for seeding
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


//seeding goals if we don't have any in the firebase
async function seedGoals() {
    if (!window.location.pathname.includes('social.html')) {
        return; // Exit early if we are not on the correct page
    }

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


//Display goal posts in social
async function displayGoalPostsDynamically() {
    if (!window.location.pathname.includes('social.html')) {
        return; // Exit early if we are not on the correct page
    }
    let cardTemplate = document.getElementById("goal-card-template");
    const goalPostsCollectionRef = collection(db, "posts");

    try {
        const querySnapshot = await getDocs(goalPostsCollectionRef);
        querySnapshot.forEach(goalPostDoc => {

            // Clone the template from social.html
            let newcard = cardTemplate.content.cloneNode(true);
            // Get goal data once
            const goalPost = goalPostDoc.data();

            // Populate the card with goal data
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




displayGoalPostsDynamically();
showName();
seedGoals();