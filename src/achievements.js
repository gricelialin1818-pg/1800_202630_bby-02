// Import the functions you need from the SDKs you need
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { collection, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, deleteField } from "firebase/firestore";
import { doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { onAuthReady } from "/src/authentication.js";
import { db } from "/src/firebaseConfig.js";

//Alerts and confirms import
import Swal from 'sweetalert2'


async function displayCompletedGoal() {
    if (!window.location.pathname.includes('achievements.html')) {
        return; // Exit early if we are not on the correct page
    }

    onAuthReady(async function (user) {
        const goalsCollection = collection(db, "users", user.uid, "goals");
        //changed to refer to the userID individually instead of just
        //adding everything to users
        const goalsData = await getDocs(goalsCollection);
        for (const goalDoc of goalsData.docs) {
            const goalDocData = goalDoc.data();
            const goalDesc = goalDocData["goal-description"];
            const goalName = goalDocData["goal-name"];
            const checkBoxStatusArray = goalDocData["stepsDone"] || [];
            // const goalComplete = goalDocData["finished"];
            const goalCard = document.createElement("div");

            let check = true;
            if (checkBoxStatusArray) {
                if (checkBoxStatusArray.length == 0) {
                    check = false;
                }
                for (let i = 0; i < checkBoxStatusArray.length; i++) {
                    if ((checkBoxStatusArray[i] == false)) {
                        check = false;
                        break;
                    }
                    //displays the goal only if all the checkboxes are checked
                    //checks via the checkbox boolean array in firestore
                }
            }


            if (check) { //appends once all the booleans in the array have been gone through and all been confirmed to be true.
                goalCard.innerHTML = `
                <div class="card">
                <div class="card-body">
                <i class="bi bi-trash-fill fs-4 position-absolute top-0 end-0 m-2 remove-post" role="button"
                            title="remove" style="color: black;"></i>
                <h4 class="card-title"><span id="goal-title"></span></h4>
                <a href="successful-goal.html?id=${goalDoc.id}" class="btn btn-primary theme-primary">Details</a>
                </div>
                </div>           
                `
                setupTrash(goalCard, user.uid, goalDoc.id);

                goalCard.querySelector("#goal-title").textContent = goalName
                document.getElementById("cards-container").appendChild(goalCard);
            }
        }
    });

}

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

function setupTrash(card, userID, goalID) {
    const trash = card.querySelector(".remove-post");

    // When trash is clicked, confirm, delete, then reload page
    trash.addEventListener("click", async function () {
        console.log(goalID);
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
            await deleteDoc(doc(db, "users", userID, "goals", goalID))
            location.reload();
            swalWithBootstrapButtons.fire({
                title: "Deleted!",
                text: "Your goal has been deleted.",
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



displayCompletedGoal();
showName();