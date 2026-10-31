import { db } from "./firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";

// Declare variable: the hike ID from the URL (eachHike.html?docID=abc123)
const params = new URL(window.location.href).searchParams;
const goalPostID = params.get("docID");

// Fetch the hike and display its name and image
async function displayGoalPostInfo() {
    try {
        const goalPostRef = doc(db, "goals", goalPostID);
        const goalPostSnap = await getDoc(goalPostRef);

        const goalPost = goalPostSnap.data();
        const name = goal.name;
        const image = goal.image;

        // Update the page
        document.getElementById("goalName").textContent = name;
        const img = document.getElementById("goalImage");
        img.src = image;
        img.alt = `${name} image`;
    } catch (error) {
        console.error("Error loading hike:", error);
        document.getElementById("hikeName").textContent = "Error loading hike.";
    }
}

displayGoalPostInfo();
