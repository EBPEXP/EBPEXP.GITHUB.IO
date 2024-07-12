import { db } from '../firebase/firebaseConfig.js';
import { collection, addDoc, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// Function to handle form submission
const handleFormSubmit = async (event) => {
  event.preventDefault();

  // Get the highest current benefit ID
  const benefitsCollection = collection(db, 'benefits');
  const q = query(benefitsCollection, orderBy('id', 'desc'), limit(1));
  const querySnapshot = await getDocs(q);
  
  let newId = 1;
  if (!querySnapshot.empty) {
    const highestBenefit = querySnapshot.docs[0].data();
    newId = highestBenefit.id + 1;
  }

  const benefit = {
    id: newId,
    name: document.getElementById('name').value,
    icon: document.getElementById('icon').value,
    description: document.getElementById('description').value,
    content: document.getElementById('content').value,
    faqs: [],
    categoryId: document.getElementById('categoryId').value,
    views: parseInt(document.getElementById('views').value, 10)
  };

  const faqElements = document.querySelectorAll('.faq');
  faqElements.forEach(faqElement => {
    const question = faqElement.querySelector('input[name="faq-question"]').value;
    const answer = faqElement.querySelector('textarea[name="faq-answer"]').value;
    benefit.faqs.push({ question, answer });
  });

  try {
    // Add a new document with a generated ID
    await addDoc(benefitsCollection, benefit);

    alert('Benefit added successfully!');
  } catch (e) {
    console.error('Error adding document: ', e);
    alert('Error adding benefit. Please try again.');
  }
};

// Attach event listener to the form
document.getElementById('benefit-form').addEventListener('submit', handleFormSubmit);

// Add FAQ event listener
document.getElementById('add-faq').addEventListener('click', () => {
  const faqContainer = document.getElementById('faqs-container');
  const newFaq = document.createElement('div');
  newFaq.classList.add('faq');
  newFaq.innerHTML = `
    <label>Question:</label>
    <input type="text" name="faq-question" required>
    <label>Answer:</label>
    <textarea name="faq-answer" required></textarea>
    <button type="button" class="remove-faq">Remove FAQ</button>
  `;
  faqContainer.appendChild(newFaq);
});

// Remove FAQ event listener
document.getElementById('faqs-container').addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-faq')) {
    e.target.parentElement.remove();
  }
});
