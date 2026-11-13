// Import the functions you need from the SDKs you need
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { collection, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, deleteField } from "firebase/firestore";
import { doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { onAuthReady } from "/src/authentication.js";
import { db, auth } from "/src/firebaseConfig.js";

const edit = document.getElementById('goalPostDescription');
const cloud = "tfztlj18"
const cloud_convert_preset = "goalGetter"
let imageURL = null

await auth.authStateReady();
const user = auth.currentUser;

const params = new URLSearchParams(window.location.search);
const goalID = params.get("id") || sessionStorage.getItem("newGoalId");

onAuthReady(async (user) => {
    if (!user) return;  // not logged in, authentication.js redirects them

    if (goalID) {
        const goalDetails = doc(db, "users", user.uid, "goals", goalID);
        const goalDoc = await getDoc(goalDetails);
        console.log(goalDoc.data())

        document.getElementById('goalNameInput').value = goalDoc.data()["goal-name"];
        document.getElementById('goalPostDescription').value = goalDoc.data()["goal-description"];
    }
});

// Function to upload an image to Cloudinary so that we can store the URL in Firestore
async function uploadImageToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloud_convert_preset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Cloudinary error:", errorData);
    }

    const data = await response.json();
    return data.secure_url; // Return the URL of the uploaded image
}

//Listen for changes to image upload input and upload to Cloudinary, then change image preview to the uploaded image
document.getElementById('imageUpload').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    console.log('Selected file:', file);
    try {
        imageURL = await uploadImageToCloudinary(file);
        console.log('Image uploaded to Cloudinary:', imageURL);
    } catch {
        console.log('Image upload failed');
    }
    document.getElementById('placeHolderImage').src = URL.createObjectURL(file);

})


//Submission of goal post details to Firestore and redirect to privacy.html
document.getElementById('continueDetailsButton').addEventListener('click', async (event) => {
    const goalName = document.getElementById('goalNameInput').value;
    const goalDescription = document.getElementById('goalPostDescription').value;

    //grab username from users collection
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    const goalpostDetails = collection(db, "posts");
    const newPostRef = await addDoc(goalpostDetails, {
        name: goalName,
        description: goalDescription,
        user: user.uid,
        userName: docSnap.data().userName,
        timestamp: serverTimestamp(),
        image: imageURL // Store the Cloudinary image URL in Firestore
    });
    // Store the new post's ID and other relevant information in sessionStorage to retrieve it on the next page
    sessionStorage.setItem("currentPostId", newPostRef.id);
    sessionStorage.setItem("currentPostImage", imageURL);
    sessionStorage.setItem("currentPostName", goalName);
    sessionStorage.setItem("currentPostDescription", goalDescription);
    window.location.href = "privacy.html";
})



