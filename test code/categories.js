import { auth, db } from '../firebase/firebaseConfig.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// Function to handle form submission
const handleFormSubmit = async (event) => {
  event.preventDefault();
  
  const categoryId = document.getElementById('categoryId').value;
  const name = document.getElementById('name').value;
  const icon = document.getElementById('icon').value;
  const description = document.getElementById('description').value;

  try {
    // Add a new document with a generated ID
    await addDoc(collection(db, 'categories'), {
      id: categoryId,
      name: name,
      icon: icon,
      description: description
    });

    alert('Benefit added successfully!');
  } catch (e) {
    console.error('Error adding document: ', e);
    alert('Error adding benefit. Please try again.');
  }
};

// Attach event listener to the form
document.getElementById('benefitsForm').addEventListener('submit', handleFormSubmit);
