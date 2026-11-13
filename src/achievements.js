// Import the functions you need from the SDKs you need
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { collection, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, deleteField } from "firebase/firestore";
import { doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { onAuthReady } from "/src/authentication.js";
import { db } from "/src/firebaseConfig.js";



//in order for the cards to be sorted into achievements and goal tasks pages,
//the boolean array needs to exist.
// async function createBooleanArray(){
//     const goalSteps = goals
//     const goalsCollection = collection(db, "users", user.uid, "goals");
//     const dbRef = doc(db, "users", user.uid, "goals", goalID); 
//     const checkBoxStatusArray = []
//     for (const goalDoc of goalsData.docs) {
//         //changed to refer to the userID individually instead of just
//         //adding everything to users
//         const goalsData = await getDocs(goalsCollection);
//         for (const goalDoc of goalsData.docs) {
//             const goalDocData = goalDoc.data();
//             //const checkBoxStatusArray = goalDocData["stepsDone"];
//             for (let i = 0; i < goalsDocData["goalSteps"].length; i++) {
//                 checkBoxStatusArray.push(false);
//             } 
//         }
//     }
//         await updateDoc(dbRef, {
//         stepsDone: checkBoxStatusArray
//         });
// }



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
            <h4 class="card-title"><span id="goal-title"></span></h4>
            <a href="successful-goal.html?id=${goalDoc.id}" class="btn btn-primary theme-primary">Details</a>
            </div>
            </div>           
            `

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



displayCompletedGoal();
showName();