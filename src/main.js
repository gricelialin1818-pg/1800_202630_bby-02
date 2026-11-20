// Import the functions you need from the SDKs you need
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { collection, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, deleteField } from "firebase/firestore";
import { doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { onAuthReady } from "/src/authentication.js";
import { db } from "/src/firebaseConfig.js";

//Import alerts and confirms from Swal
import Swal from 'sweetalert2'

//APPLY FONT TO THE WHOLE {body}
document.body.style.fontFamily = 'Inter-Main-Font'


// Import the file that has the authentication helper function we want to use.
// The function we want to use is called "onAuthReady" which returns the login state
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


//Add goals to database
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

// Function to retrieve goal name and description from the
//database and put them into cards on the mainGoalsListed page
async function displayGoal() {
    if (!window.location.pathname.includes('main-goals-listed.html')) {
        return; // Exit early if we are not on the correct page
    }

    onAuthReady(async function (user) {
        if (!user) return;
        const cardsContainer = document.getElementById("cards-container");
        cardsContainer.innerHTML = "";
        const firstGoalCard = document.getElementById("first-goal-card");
        firstGoalCard.style.display = "none";

        const goalsCollection = collection(db, "users", user.uid, "goals");
        //changed to refer to the userID individually instead of just
        //adding everything to users
        const goalsData = await getDocs(goalsCollection);
        // Count active goals
        let displayedGoalCount = 0;
        for (const goalDoc of goalsData.docs) {
            const goalDocData = goalDoc.data();
            const goalDesc = goalDocData["goal-description"];
            const goalName = goalDocData["goal-name"];
            const goalCard = document.createElement("div");
            // const stepsArray = goalDocData["goalSteps"]
            const checkBoxStatusArray = goalDocData["stepsDone"] || [];


            if (checkBoxStatusArray.includes(false) || checkBoxStatusArray.length == 0) {
                // allow for the card to be pasted using .length ==0 because using == [] returns false
                // as the empty array on line 79 and the array in the comparison are two different arrays
                goalCard.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                        <i class="bi bi-trash-fill fs-4 position-absolute top-0 end-0 m-2 remove-goal" role="button"
                                title="remove" style="color: black;"></i>
                        <h4 class="card-title"><span id="goal-title"></span></h4>
                        <a href="goal-details.html?id=${goalDoc.id}" class="btn btn-primary theme-primary">Details</a>
                        </div>
                    </div>           
                    `
                //Add trash (option to delete)
                setupTrash(goalCard, user.uid, goalDoc.id);

                goalCard.querySelector(".card-title").textContent = goalName;
                cardsContainer.appendChild(goalCard);
                displayedGoalCount++;

            }
        }

        // Show the card when no active goals are listed
        if (displayedGoalCount === 0) {
            firstGoalCard.style.display = "block";
        } else {
            firstGoalCard.style.display = "none";
        }
    });
}




//takes the name and description of the goal
//on the add-goal-screen 
//and makes a new goal in the db
async function collectGoalData() {
    //onAuthReady user allows for user.uid to be accessed for the path
    onAuthReady(async function (user) {
        if (user) {
            const goalNameInput = document.getElementById("goal-name-input")
            const goalDetailsInput = document.getElementById("goal-details-input")
            const goalNameInputValue = goalNameInput.value
            const goalDetailsInputValue = goalDetailsInput.value
            const newGoal = await addDoc(collection(db, "users", user.uid, "goals"), {
                "goal-description": goalDetailsInputValue,
                "goal-name": goalNameInputValue
            });

            //Place goalid into session storage for other js and pages to pull later
            sessionStorage.setItem("newGoalId", newGoal.id);

            const savedGoal = await getDoc(newGoal);
            console.log("Exists:", savedGoal.exists(), "Fields:", savedGoal.data());



            window.location.href = "add-goal-details.html"
        }
    });

}


const submitButton = document.getElementById("save-goal");
if (submitButton) {
    submitButton.addEventListener("click", () => {
        onAuthReady(function (user) {
            if (user) {
                collectGoalData(user.uid)
            }
        });
    });
}


//Function to set up trash for each goal 
function setupTrash(card, userID, goalID) {
    const trash = card.querySelector(".remove-goal");

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
            //If cancelled
        }
    });
}



//only run the collectGoalData function
//when the continue button is clicked
displayGoal();
showName();
