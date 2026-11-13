import { db } from "./firebaseConfig.js";
import { doc, getDoc, getDocs, updateDoc, query, where, collection, serverTimestamp, addDoc, getCountFromServer, increment } from "firebase/firestore";
import { onAuthReady } from "./authentication.js";

// Which goal?
// 1. From the address, e.g. goal-details.html?id=pFXuH8nTrXrnl9wWnrMb
// 2. Otherwise the goal just created (saved by main.js / add-goal-details.js / deadline.js)
const params = new URLSearchParams(window.location.search);
const selectedPost = params.get("id") || sessionStorage.getItem("newGoalId");
let currentUser = null;

// Wait until Firebase knows who is logged in
onAuthReady(async (user) => {
    if (!user) return;  // not logged in, authentication.js redirects them
    currentUser = user
    if (!selectedPost) {
        showError("No post selected.");
        return;
    }

    try {
        const postDetails = doc(db, "posts", selectedPost);
        const goalDoc = await getDoc(postDetails);

        if (!goalDoc.exists()) {
            console.log("Could not load post");;
            return;
        }
        displayPostDetails(goalDoc.data());
    } catch {
        console.log("Could not load post");
    }
});


//Display post details in a different format for commenters to look back on it while commenting
function displayPostDetails(goalDoc) {
    if (goalDoc["image"] == null) {
        document.querySelector('.card-image').src = "https://res.cloudinary.com/tfztlj18/image/upload/v1793932524/lrp9crwmqfhq3j5x9bvr.png";
    } else {
        document.querySelector('.card-image').src = goalDoc["image"];
    }
    document.querySelector('.card-title').textContent = goalDoc["name"];
    if (goalDoc["userName"]) {
        document.querySelector('.card-user-id').textContent = goalDoc["userName"];
    } else {
        document.querySelector('.card-user-id').textContent = goalDoc["user"];
    }
    document.querySelector('.card-text').textContent = goalDoc["description"]
}

//Display comments in the comments-go-here container
async function displayComments() {
    const container = document.getElementById("comments-go-here");
    const template = document.getElementById("commentTemplate");
    container.innerHTML = "";     // start empty so we don't show duplicates

    // Build the question we want to ask Firestore
    const q = query(
        collection(db, "posts", selectedPost, "comments"),
        where("postID", "==", selectedPost),    // check which posts matches with the clicked postID
        // orderBy("timestamp", "desc"),         // newest first
        // limit(5)                        // optional: only the latest 5 (try it yourself)
    );

    try {
        const querySnapshot = await getDocs(q);  // Firebase call

        //If there are no comments yet
        if (querySnapshot.empty) {
            container.innerHTML = "<p class='text-muted'>No comments yet. Be the first!</p>";
            return;
        }

        //fill template with comment fields
        querySnapshot.forEach(doc => {
            const comment = doc.data();
            const card = template.content.cloneNode(true);

            const date = comment.timestamp ? comment.timestamp.toDate().toLocaleDateString() : "just now";
            card.querySelector(".comment-details").textContent = `${comment.userName} · ${date}`;
            card.querySelector(".comment-text").textContent = comment.text;

            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading comments:", error);
    }
}
displayComments();

async function submitComment(event) {
    event.preventDefault();

    const newComment = {
        postID: selectedPost,                                // the PARENT (from the URL)
        userID: currentUser.uid,                             // who
        userName: currentUser.displayName || currentUser.email,
        text: document.getElementById("newComment").value,
        timestamp: serverTimestamp()                         // when
    };

    try {
        const commentPath = collection(db, "posts", selectedPost, "comments");
        await addDoc(collection(db, "posts", selectedPost, "comments"), newComment);
        event.target.reset();     // clear the form
        displayComments();         // re-read the list so the new comment shows

        await updateDoc(doc(db, "posts", selectedPost), { comments: increment(1) })// add number of comments in the post

    } catch (error) {
        alert(`Error saving comment:\n${error.code || ""}\n${error.message || error}`);
    }
}

document.getElementById("commentForm").addEventListener("submit", submitComment); // listen for when the comment submit button is pressed
