import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { collection, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, deleteField, getCountFromServer } from "firebase/firestore";
import { doc, onSnapshot, serverTimestamp, query, where } from "firebase/firestore";
import { onAuthReady } from "/src/authentication.js";
import { db, auth } from "/src/firebaseConfig.js";

//Alerts and confirms import
import Swal from 'sweetalert2'

await auth.authStateReady();
const user = auth.currentUser;



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

//Display only personal goal posts
async function displayGoalPostsDynamically() {
    let cardTemplate = document.getElementById("goal-card-template");
    const q = query(
        collection(db, "posts"),
        where("user", "==", user.uid),    // only THIS user id
    );

    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(goalPostDoc => {

            // Clone the template from personal-posts.html
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

            setupTrash(newcard, goalPostDoc.id);//setup trash/delete option


            // Attach the new card to the container
            document.getElementById("goal-posts-go-here").appendChild(newcard);

        });
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
}

//Set up trash/delete button in personal-posts
function setupTrash(card, postID) {
    const trash = card.querySelector(".remove-post");

    // When trash is clicked, confirm, delete, then reload page
    trash.addEventListener("click", async function () {
        //Send confirmation message
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            confirmButtonColor: "#20263A",
            cancelButtonColor: "#93A0BF",
            cancelButtonText: "No, cancel!",
            reverseButtons: true
        })
        //If confirmed
        if (result.isConfirmed) {
            await deleteDoc(doc(db, "posts", postID))
            location.reload();
            swalWithBootstrapButtons.fire({
                title: "Deleted!",
                text: "Your post has been deleted.",
                icon: success
            });
            //If cancelled
        } else if (result.dismess === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire({
                title: "Deletion Cancelled",
                icon: "error"
            })
        }
    });
}


displayGoalPostsDynamically();
showName();