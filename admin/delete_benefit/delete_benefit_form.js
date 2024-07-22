import { auth, db } from '/firebase/firebaseConfig.js';
import { collection, query, where, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import {
    onAuthStateChanged,
  } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    let id = params.get('id'); // This is the categoryId
    const benefitSelect = document.getElementById('benefit-select');

    // Create a message box element
    const messageBox = document.createElement('div');
    messageBox.id = 'message-box';
    messageBox.style.display = 'none';
    benefitSelect.parentElement.appendChild(messageBox);

    try {
        // Fetch benefits from Firestore with the given categoryId
        const benefitsRef = collection(db, 'benefits');
        const q = query(benefitsRef, where('categoryId', '==', id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const benefit = doc.data();
                const option = document.createElement('option');
                option.value = doc.id; // Use Firestore document ID as the value
                option.textContent = benefit.name;
                benefitSelect.appendChild(option);
            });
        } else {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No benefits found for this category';
            benefitSelect.appendChild(option);
        }
    } catch (error) {
        console.error('Error fetching benefits: ', error);
    }

    document.getElementById('delete-benefit-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const selectedBenefitId = benefitSelect.value;

        if (selectedBenefitId && selectedBenefitId !== 'Choose') {
            messageBox.style.display = 'block';
            messageBox.textContent = 'Deleting...';

            try {
                // Delete the selected benefit from Firestore
                await deleteDoc(doc(db, 'benefits', selectedBenefitId));
                benefitSelect.options[benefitSelect.selectedIndex].remove();
                benefitSelect.selectedIndex = 0;
                messageBox.textContent = 'Benefit deleted successfully. Redirecting...';

                // Redirect after a short delay
                setTimeout(() => {
                    window.history.back();
                }, 1000);
            } catch (error) {
                console.error('Error deleting benefit: ', error);
                messageBox.textContent = 'Error deleting benefit. Please try again.';
            }
        } else {
            alert('Please choose a benefit to delete.');
        }
    });
});

function displayUsername(){
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const email = user.email;
        const username = email.split("@")[0].split(".")[0];
        const capitalizedUsername =
        username.charAt(0).toUpperCase() + username.slice(1);
    
        document.getElementById("adminUserName").textContent = `Admin (${capitalizedUsername})`;
      } else {
        console.log("No user is signed in");
      }
    });
  }
   displayUsername();
