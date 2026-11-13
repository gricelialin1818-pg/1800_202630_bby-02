import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { collection, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, deleteField, arrayUnion, arrayRemove, increment } from "firebase/firestore";
import { doc, onSnapshot, serverTimestamp, query, where } from "firebase/firestore";
import { onAuthReady } from "/src/authentication.js";
import { db, auth } from "/src/firebaseConfig.js";

const goalId = sessionStorage.getItem("currentPostId");
const postImage = sessionStorage.getItem("currentPostImage");
const postName = sessionStorage.getItem("currentPostName");
const postDescription = sessionStorage.getItem("currentPostDescription");
await auth.authStateReady();
const user = auth.currentUser;
let postsLiked = [];

const posts = await getDocs(collection(db, "posts"));
let userPosts = 0;
//Count how many posts in database are made by the user
posts.forEach((doc) => {
    const data = doc.data();
    if (data.user == user.uid) {
        userPosts += 1;
    };
});

document.getElementById("user's-posts").textContent = userPosts


function showName() {
    // Pass a CALLBACK function to run when Firebase finishes checking login status
    onAuthReady(async function (user) {  // Firebase passes the user object (or null)
        if (user) {
            // User is logged in
            const name = user.displayName || user.email;  // Use email if name is missing
            const checkName = document.getElementById("name-goes-here");
            if (!checkName) {
                return
            }
            const userDoc = await getDoc(doc(db, "users", user.uid));
            postsLiked = userDoc.data()?.postsLiked || [];

            document.getElementById("name-goes-here").textContent = name;
            displayGoalPostsDynamically();
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
            if (goalPost.userName) {
                newcard.querySelector('.card-user-id').textContent = goalPost.userName;
            } else {
                newcard.querySelector('.card-user-id').textContent = goalPost.user;
            }
            newcard.querySelector('.card-text').textContent = goalPost.description;
            if (goalPost.image == null) {
                newcard.querySelector('.card-image').src = "https://res.cloudinary.com/tfztlj18/image/upload/v1793932524/lrp9crwmqfhq3j5x9bvr.png";
            } else {
                newcard.querySelector('.card-image').src = goalPost.image;
            }
            if (goalPost.comments) {
                newcard.querySelector('.comment-count').textContent = goalPost.comments;
            }
            if (goalPost.likes) {
                newcard.querySelector('.like-count').textContent = goalPost.likes;
            }
            newcard.querySelector('.comment').href = `comments.html?id=${goalPostDoc.id}`;

            setupHeart(newcard, goalPostDoc.id);



            // Attach the new card to the container
            document.getElementById("goal-posts-go-here").appendChild(newcard);

        });
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
}

//setup the heart based on whether the user has liked the post already
function setupHeart(card, postID) {
    const heart = card.querySelector(".fav-btn");

    if (postsLiked.includes(postID)) {
        heart.classList.replace("bi-heart", "bi-heart-fill");
    }

    // Connect it: "heart, when you are clicked, toggle this post"
    heart.addEventListener("click", async function () {
        await toggleFavourite(heart, postID);
        location.reload();
    });
}

// ------------------------------------------------------------
// toggleFavourite(heart, postID)
// Runs on every click: adds or removes the post from postsLiked
// heart  = the heart icon that was clicked
// postID = which post it belongs to
// ------------------------------------------------------------
async function toggleFavourite(heart, postID) {

    // [BACK END] The address of the logged-in user's document in Firestore
    const userRef = doc(db, "users", user.uid);
    const postRef = doc(db, "posts", postID);

    // [FRONT END] Is the heart filled right now?
    if (heart.classList.contains("bi-heart-fill")) {

        // Filled → REMOVE from postsLiked
        // [BACK END] Remove this post's ID from the user's postsLiked array
        await setDoc(userRef, { postsLiked: arrayRemove(postID) }, { merge: true });
        await updateDoc(postRef, { likes: increment(-1) })
        // [FRONT END] Show the empty heart
        heart.classList.replace("bi-heart-fill", "bi-heart");

    } else {

        // Empty → ADD to postsLiked
        // [BACK END] Add this post's ID to the user's postsLiked array
        await setDoc(userRef, { postsLiked: arrayUnion(postID) }, { merge: true });
        await updateDoc(postRef, { likes: increment(1) })
        // [FRONT END] Show the filled heart
        heart.classList.replace("bi-heart", "bi-heart-fill");
    }
}




showName();
seedGoals();