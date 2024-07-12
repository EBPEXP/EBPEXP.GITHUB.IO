import { db } from '../firebase/firebaseConfig.js';
import { collection, query, where, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// Function to get benefit details and populate the form
const populateBenefitDetails = async (benefitId) => {
  // Convert benefitId to integer
  benefitId = parseInt(benefitId, 10);

  // Query the document based on the id field
  const benefitsCollection = collection(db, 'benefits');
  const q = query(benefitsCollection, where('id', '==', benefitId));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const benefitDoc = querySnapshot.docs[0];
    const benefitData = benefitDoc.data();

    document.getElementById('name').value = benefitData.name;
    document.getElementById('icon').value = benefitData.icon;
    document.getElementById('description').value = benefitData.description;
    document.getElementById('content').value = benefitData.content;
    document.getElementById('categoryId').value = benefitData.categoryId;
    document.getElementById('views').value = benefitData.views;

    const faqsContainer = document.getElementById('faqs-container');
    faqsContainer.innerHTML = '';

    benefitData.faqs.forEach(faq => {
      const newFaq = document.createElement('div');
      newFaq.classList.add('faq');
      newFaq.innerHTML = `
        <label>Question:</label>
        <input type="text" name="faq-question" value="${faq.question}" required>
        <label>Answer:</label>
        <textarea name="faq-answer" required>${faq.answer}</textarea>
        <button type="button" class="remove-faq">Remove FAQ</button>
      `;
      faqsContainer.appendChild(newFaq);
    });

    // Save the document reference for later update
    document.getElementById('benefit-form').dataset.docId = benefitDoc.id;
  } else {
    alert('No such benefit exists!');
  }
};

// Function to handle form submission
const handleFormSubmit = async (event) => {
  event.preventDefault();

  const form = document.getElementById('benefit-form');
  const docId = form.dataset.docId;

  const benefitDocRef = doc(db, 'benefits', docId);

  const benefit = {
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
    // Update the document
    await updateDoc(benefitDocRef, benefit);

    alert('Benefit updated successfully!');
  } catch (e) {
    console.error('Error updating document: ', e);
    alert('Error updating benefit. Please try again.');
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

// Get the benefit ID from the URL and populate the form
const params = new URLSearchParams(window.location.search);
let id = params.get('id');
if (id) {
  id = parseInt(id, 10);
  populateBenefitDetails(id);
}
