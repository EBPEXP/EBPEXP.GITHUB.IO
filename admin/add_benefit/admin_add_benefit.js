import { db } from '/firebase/firebaseConfig.js';
import { collection, addDoc, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { fetchData, iconsData } from '/firebase/firebaseData.js';

const params = new URLSearchParams(window.location.search);
let id = params.get('id');
//for testing 
// let id = 'epf'

// Initialize Quill editor
let quill;
// to populate the texboxes and inputs
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    document.getElementById('category').setAttribute("value",id);
    document.getElementById('category').setAttribute("placeholder",id);
    quill = new Quill('#editor-container', {
        modules: {
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'link'],  // Text styling options
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],  // List options
            //   ['image'],  // Link and image insertion
              [{ 'color': [] }, { 'background': [] }],  // Font color and background color
              [{ 'align': [] }],  // Text alignment
              ['blockquote'],  // Quote and code block
              ['clean'],  // Remove formatting
            ],
          },
          placeholder: 'Add benefit details...',
        theme: 'snow'
    });

    iconSearchFunction();
    deleteFunctionToButtons();
    addFaqs();
    // dropdownFunctions();
    
});

document.getElementById('benefit-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const benefitName = document.getElementById('benefit-name').value;
    const icon = document.getElementById('icon-search').value;
    const description = document.getElementById('description').value;
    const categoryId = document.getElementById('category').value;
    const modalHeading = document.getElementById('exampleModal1Label');
    const modalBody = document.getElementsByClassName('modal-body');
    const goBackBtn = document.getElementById('modalGoLastPage');
        goBackBtn.addEventListener("click",()=>{
            setTimeout(() => {
                window.history.back();
            }, 100);
        })
    
    const content = quill.root.innerHTML;
    
    // Collect FAQs
    const faqs = [];
    document.querySelectorAll('.faq').forEach((faqElement) => {
        const question = faqElement.querySelector('input[name="faq-question"]').value;
        const answer = faqElement.querySelector('textarea[name="faq-answer"]').value;
        faqs.push({ question: question, answer: answer });
    });

    // Get the highest current benefit ID
    const benefitsCollection = collection(db, 'benefits');
    const q = query(benefitsCollection, orderBy('id', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);
    
    let newId = 1;
    if (!querySnapshot.empty) {
        const highestBenefit = querySnapshot.docs[0].data();
        newId = highestBenefit.id + 1;
    }

    // Create a benefit object
    const benefit = {
        id: newId,
        name: benefitName,
        icon: icon,
        description: description,
        content: content,
        faqs: faqs,
        categoryId: categoryId,
        views: 0
    };
    $('#exampleModal1').modal('show');
    try {
        modalHeading.innerHTML = "Saving...";
        // Add a new document with a generated ID
        await addDoc(benefitsCollection, benefit);
        modalHeading.innerHTML = "Benefit Added Succesfully";
        modalBody[0].textContent = "Benefit data added succesfully. Click close to go back";
      } catch (e) {
        console.log("error",e);
        modalHeading.innerHTML = "Error adding document";
        modalBody[0].textContent = "An error occured! Try again.";
      }
});

//to add delete function to faqs
function deleteFunctionToButtons(){
    document.querySelectorAll('.remove-faq').forEach((button) => {
        button.addEventListener('click', function(event) {
            event.target.closest(".faq").remove();
        });
    });
}
//to add faqs 
function addFaqs(){
    const addFaqButton = document.getElementById("add-faq")
    const faqContainer = document.getElementById("faqs-container")
    addFaqButton.addEventListener("click",()=>{
        let newFaq = `<div class="faq border border-danger p-3 rounded-2 mb-2">
                        <div class="mb-3 row">
                            <label class="col-sm-2">Question:</label>
                            <div class="col-sm-10">
                                <input type="text" name="faq-question" class="form-control" required placeholder="Add the FAQ question...">
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-sm-2">Answer:</label>
                            <div class="col-sm-10">
                                <textarea name="faq-answer" class="form-control rounded" placeholder="Add the FAQ answer..." required></textarea>
                            </div>
                        </div>
                        <button type="button" class="remove-faq btn btn-outline-danger">Remove FAQ</button>
                    </div>`
        faqContainer.insertAdjacentHTML("beforeend", newFaq)
        deleteFunctionToButtons();
    })
    
}
//to search icons
function iconSearchFunction(){
    // retrieveIconsFromFirestore();
    const iconSearch = document.getElementById('icon-search');
    const iconRecommendations = document.getElementById('icon-recommendations');

    iconSearch.addEventListener('input', () => {
        const searchTerm = iconSearch.value.toLowerCase();
        iconRecommendations.innerHTML = '';

        if (searchTerm.length > 0) {
            const filteredIcons = iconsData.filter(icon => icon.toLowerCase().includes(searchTerm));
            filteredIcons.forEach(icon => {
                const iconItem = document.createElement('div');
                iconItem.className = 'icon-item icon-container';
                iconItem.innerHTML = `<i class="${icon}"></i> ${icon}`;
                iconItem.addEventListener('click', () => {
                    iconSearch.value = icon;
                    iconRecommendations.innerHTML = '';
                });
                iconRecommendations.appendChild(iconItem);
            });
        }
    });

    document.addEventListener('click', (event) => {
        if (!iconSearch.contains(event.target) && !iconRecommendations.contains(event.target)) {
            iconRecommendations.innerHTML = '';
        }
    });
}
