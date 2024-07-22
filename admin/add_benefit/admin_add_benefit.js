import { auth, db, storage } from '/firebase/firebaseConfig.js';
import { collection, addDoc, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";
import { fetchData, iconsData } from '/firebase/firebaseData.js';

import {
    onAuthStateChanged,
  } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

const params = new URLSearchParams(window.location.search);
let id = params.get('id');
let faqCount = 0;
// Initialize Quill editor
let quill;
let imageRefs = []; // Track uploaded images for removal
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    document.getElementById('category').setAttribute("value", id);
    document.getElementById('category').setAttribute("placeholder", id);
    quill = new Quill('#editor-container', {
        modules: {
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'link'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'align': [] }],
                    ['blockquote'],
                    ['image'], // Add image button
                    ['clean']
                ],
                handlers: {
                    'image': imageHandler
                }
            }
        },
        placeholder: 'Add benefit details...',
        theme: 'snow'
    });

    iconSearchFunction();
    deleteFunctionToButtons();
    addFaqs();
    addEmailDetails();
});

async function imageHandler() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
        const file = input.files[0];
        if (file) {
            const storageRef = ref(storage, `benefits/${Date.now()}_${file.name}`);
            try {
                const snapshot = await uploadBytes(storageRef, file);
                const url = await getDownloadURL(snapshot.ref);
                quill.insertEmbed(quill.getSelection().index, 'image', url);
                imageRefs.push(storageRef.fullPath); // Track uploaded image
            } catch (error) {
                console.error('Image upload failed:', error);
            }
        }
    };
}

document.getElementById('benefit-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const benefitName = document.getElementById('benefit-name').value;
    const icon = document.getElementById('icon-search').value;
    const description = document.getElementById('description').value;
    const categoryId = document.getElementById('category').value;
    const modalHeading = document.getElementById('exampleModal1Label');
    const modalBody = document.getElementsByClassName('modal-body');
    const goBackBtn = document.getElementById('modalGoLastPage');
    goBackBtn.addEventListener("click", () => {
        setTimeout(() => {
            window.history.back();
        }, 100);
    })

    const content = quill.root.innerHTML;

    // Collect FAQs
    const faqs = [];
    document.querySelectorAll('.faq').forEach((faqElement) => {
        const question = faqElement.querySelector('input[name="faq-question"]').value;
        const answer = faqElement.querySelector('div[name="faq-answer"]').firstChild.innerHTML;
        faqs.push({ question: question, answer: answer });
    });

    // Collect email details
    let emailDetails = collectEmailDetailsFromForm();

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
        emails: emailDetails,
        categoryId: categoryId,
        views: 0
    };

    $('#exampleModal1').modal('show');
    try {
        modalHeading.innerHTML = "Saving...";
        // Add a new document with a generated ID
        await addDoc(benefitsCollection, benefit);
        modalHeading.innerHTML = "Benefit Added Successfully";
        modalBody[0].textContent = "Benefit data added successfully. Click close to go back";
    } catch (e) {
        console.log("error", e);
        modalHeading.innerHTML = "Error adding document";
        modalBody[0].textContent = "An error occurred! Try again.";
    }
});

// To add delete function to FAQs
function deleteFunctionToButtons() {
    document.querySelectorAll('.remove-faq').forEach((button) => {
        button.addEventListener('click', function (event) {
            event.target.closest(".faq").remove();
        });
    });
}

// To add FAQs 
function addFaqs() {
    const addFaqButton = document.getElementById("add-faq")
    const faqContainer = document.getElementById("faqs-container")
    addFaqButton.addEventListener("click",()=>{
        faqCount++;
        let newFaq = `<div class="faq border border-danger p-3 rounded-2 mb-2">
                        <div class="mb-3 row">
                            <label class="col-sm-2">Question:</label>
                            <div class="col-sm-10">
                                <input type="text" name="faq-question" class="form-control" required placeholder="Add the FAQ question...">
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-sm-2">Answer:</label>
                            <div class="col-sm-10" style="height: fit-content;">
                                <div id="faqQuill${faqCount}" name="faq-answer"></div>
                            </div>
                        </div>
                        <button type="button" class="remove-faq btn btn-outline-danger">Remove FAQ</button>
                    </div>`
        faqContainer.insertAdjacentHTML("beforeend", newFaq);
        let faqQuillId = `#faqQuill${faqCount}`;
        let faqQuill = new Quill(faqQuillId, {
            modules: {
                toolbar: [
                  [{ header: [1, 2, 3, 4, 5, 6, false] }],
                  ['bold', 'italic', 'underline', 'link'],  // Text styling options
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],  // List options
                  [{ 'color': [] }, { 'background': [] }],  // Font color and background color
                  [{ 'align': [] }],  // Text alignment
                  ['blockquote'],  // Quote and code block
                  ['clean'],  // Remove formatting
                  ['table'],  // Table functionality
                ],
                table: true, // Enable the better-table module
              },
              placeholder: 'Answer here...',
            theme: 'snow'
        });
        deleteFunctionToButtons();
    })
}

// To add Email details
function addEmailDetails() {
    const addEmailDetailsBtn = document.getElementById("addEmailDetailsBtn");
    const emailsContainer = document.getElementById("emailsContainer");
    addEmailDetailsBtn.addEventListener("click", () => {
        addEmailDetailsBtn.style.display = "none";
        let newEmailDetails = `<div id="emailDetailsContainer" class="rounded p-3 w-100">
                              <label>To:</label>
                              <input type="text" name="To" class="form-control" placeholder="Add recipient of email..." required>
                              <label>CC:</label>
                              <input type="text" name="CC" class="form-control" placeholder="Add CC recipient of email...">
                              <label>Subject:</label>
                              <input type="text" name="subject" class="form-control" placeholder="Add Subject here..." required>
                              <label>Content:</label>
                              <textarea name="content" class="rounded" placeholder="Add body of email..." required></textarea>
                              
                              <button type="button" id="emailDetailsContainerRemoveBtn" class="btn btn-outline-danger">Remove Email Details</button>
                          </div>`;
        emailsContainer.insertAdjacentHTML("beforeend", newEmailDetails);
        deleteFunctionToEmailContainer();
    });
}

// Adding functionality to remove Email details container
function deleteFunctionToEmailContainer() {
    const addEmailDetailsBtn = document.getElementById("addEmailDetailsBtn");
    document.getElementById("emailDetailsContainerRemoveBtn").addEventListener("click", function () {
        document.getElementById("emailDetailsContainer").remove();
        addEmailDetailsBtn.style.display = "flex";
    })
}

function collectEmailDetailsFromForm() {
    let emailDetails = [];
    const emailDetailsContainer = document.getElementById("emailDetailsContainer");
    if (emailDetailsContainer) {
        const to = emailDetailsContainer.querySelector('input[name="To"]').value;
        const cc = emailDetailsContainer.querySelector('input[name="CC"]').value;
        const subject = emailDetailsContainer.querySelector('input[name="subject"]').value;
        const content = emailDetailsContainer.querySelector('textarea[name="content"]').value;
        emailDetails.push({ to, cc, subject, content });
    };
    return emailDetails;
}

//to search icons
function iconSearchFunction(){
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
