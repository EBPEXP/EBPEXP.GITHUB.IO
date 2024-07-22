import { auth, db, storage } from "/firebase/firebaseConfig.js";
import { fetchData, benefits, iconsData } from "/firebase/firebaseData.js";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";
import {
  collection,
  where,
  query,
  getDocs,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
let faqCount=0;

import {
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

const params = new URLSearchParams(window.location.search);
let id = params.get("id");
//Initialize Quill editor
let quill = new Quill('#editor-container', {
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

// to populate the texboxes and inputs
document.addEventListener("DOMContentLoaded", async () => {
  const loadingAnimation = document.getElementById("loading-animation");
  // Show loading animation initially
  loadingAnimation.style.display = "flex";
  checkAuth(); // Check authentication status on page load
  //fetching data
  await fetchData();

  // Hide loading animation after everything is loaded
  loadingAnimation.style.display = "none";

  const form = document.getElementById("benefit-form");
  let benefitData = benefits.find((item) => item.id === parseInt(id, 10));
  // displaying the benefit data in the form
  const beneftiName = document.getElementById("benefit-name");
  const description = document.getElementById("description");
  const button = document.getElementById("dropdownButton");
  const iconSearchBar = document.getElementById("icon-search");
  beneftiName.value = benefitData.name;
  description.value = benefitData.description;
  button.textContent = benefitData.categoryId;
  quill.root.innerHTML = benefitData.content;
  iconSearchBar.value = benefitData.icon;

  iconSearchFunction();
  if (benefitData.faqs) {
    showFaqs(benefitData);
    deleteFunctionToButtons();
  }
  if(benefitData.emails){
    showEmail(benefitData);
  }
  addFaqs();
  addEmailDetails();
  dropdownFunctions();
  form.addEventListener("submit", submitEdits);
});

//to check if the user thats signed in is authorized
function checkAuth() {
  auth.onAuthStateChanged((user) => {
    if (!user) {
      // User is not logged in, redirect to login page
      window.location.href = "/admin/login/login.html";
    }
  });
}
//to show the faqs of the benefit in hand
function showFaqs(benefitData) {
  const faqContainer = document.getElementById("faqs-container");
  let faqHtmlData = "";
  benefitData.faqs.forEach((items) => {
    faqCount++;
    faqHtmlData = `<div class="faq border border-danger rounded p-3 mb-3">
                            <label>Question:</label>
                            <input type="text" name="faq-question" class="form-control faq-question" placeholder="Add the FAQ question..." required value="${items.question}">
                            <label>Answer:</label>
                            <div id="faqQuill${faqCount}" class="mb-3" name="faq-answer"></div>
                            <button type="button" class="remove-faq btn btn-outline-danger">Remove FAQ</button>
                        </div>`;
    faqContainer.insertAdjacentHTML("beforeend", faqHtmlData);
    let faqQuillId = `#faqQuill${faqCount}`
        faqQuillId = new Quill(faqQuillId, {
            modules: {
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
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
        faqQuillId.root.innerHTML=items.answer;
  });
}
//apply delete functionality to delete faq button
function deleteFunctionToButtons() {
  document.querySelectorAll(".remove-faq").forEach((button) => {
    button.addEventListener("click", function (event) {
      event.target.closest(".faq").remove();
    });
  });
}
//show email
function showEmail(benefitData) {
  const addEmailDetailsBtn = document.getElementById("addEmailDetailsBtn");
  const emailsContainer = document.getElementById("emailsContainer");
  if(benefitData.emails[0]){
    addEmailDetailsBtn.style.display = "none";
    let newEmailDetails = `<div id="emailDetailsContainer" class="rounded p-3 w-100">
                            <label>To:</label>
                            <input type="text" name="To" class="form-control" placeholder="Add recipient of email..." required value="${benefitData.emails[0].to}">
                            <label>CC:</label>
                            <input type="text" name="CC" class="form-control" placeholder="Add CC recipient of email..." value="${benefitData.emails[0].cc}">
                            <label>Subject:</label>
                            <input type="text" name="subject" class="form-control" placeholder="Add Subject here..." required value="${benefitData.emails[0].subject}">
                            <label>Content:</label>
                            <textarea name="content" class="rounded" placeholder="Add body of email..." required>${benefitData.emails[0].content}</textarea>
                            
                            <button type="button" id="emailDetailsContainerRemoveBtn" class="btn btn-outline-danger">Remove Email Details</button>
                        </div>`;
    emailsContainer.insertAdjacentHTML("beforeend", newEmailDetails);
    deleteFunctionToEmailContainer();
  };
}
//to add faqs
function addFaqs() {
  const addFaqButton = document.getElementById("add-faq");
  const faqContainer = document.getElementById("faqs-container");
  addFaqButton.addEventListener("click", () => {
    faqCount++;
    let newFaq = `<div class="faq border border-danger rounded p-3 mb-3">
                            <label>Question:</label>
                            <input type="text" name="faq-question" class="form-control" required placeholder="Add the FAQ question...">
                            <label>Answer:</label>
                            <div id="faqQuill${faqCount}" class="mb-3" name="faq-answer"></div>
                            <button type="button" class="remove-faq btn btn-outline-danger">Remove FAQ</button>
                        </div>`;
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
  });
}

//to add Email details
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
//adding functionality to remove Email details container
function deleteFunctionToEmailContainer(){
  const addEmailDetailsBtn = document.getElementById("addEmailDetailsBtn");
  document.getElementById("emailDetailsContainerRemoveBtn").addEventListener("click",function(){
    document.getElementById("emailDetailsContainer").remove();
    addEmailDetailsBtn.style.display = "flex";
  })
}

//to search icons
function iconSearchFunction() {
  const iconSearch = document.getElementById("icon-search");
  const iconRecommendations = document.getElementById("icon-recommendations");

  iconSearch.addEventListener("input", () => {
    const searchTerm = iconSearch.value.toLowerCase();
    iconRecommendations.innerHTML = "";

    if (searchTerm.length > 0) {
      const filteredIcons = iconsData.filter((icon) =>
        icon.toLowerCase().includes(searchTerm)
      );
      filteredIcons.forEach((icon) => {
        const iconItem = document.createElement("div");
        iconItem.className = "icon-item icon-container";
        iconItem.innerHTML = `<i class="${icon}"></i> ${icon}`;
        iconItem.addEventListener("click", () => {
          iconSearch.value = icon;
          iconRecommendations.innerHTML = "";
        });
        iconRecommendations.appendChild(iconItem);
      });
    }
  });

  document.addEventListener("click", (event) => {
    if (
      !iconSearch.contains(event.target) &&
      !iconRecommendations.contains(event.target)
    ) {
      iconRecommendations.innerHTML = "";
    }
  });
}
//dropdown category menu functionality
function dropdownFunctions() {
  document.querySelectorAll(".dropdown-item").forEach(function (item) {
    item.addEventListener("click", function (event) {
      const button = document.getElementById("dropdownButton");
      button.textContent = event.target.textContent;
    });
  });
}
//to update the data into the database once the submit button is pressed
async function submitEdits(event) {
  event.preventDefault();
  let faqArray = pushFaqToDb();
  let emailDetails = collectEmailDetailsFromForm();
  const modalHeading = document.getElementById("exampleModal1Label");
  const modalBody = document.getElementsByClassName("modal-body");
  const goBackBtn = document.getElementById("modalGoLastPage");
  goBackBtn.addEventListener("click", () => {
    setTimeout(() => {
      window.history.back();
    }, 100);
  });
  const q = query(
    collection(db, "benefits"),
    where("id", "==", parseInt(id, 10))
  );
  try {
    // Get query snapshot
    const querySnapshot = await getDocs(q);
    // Update the document if it exists
    querySnapshot.forEach(async (doc) => {
      await setDoc(
        doc.ref,
        {
          name: document.getElementById("benefit-name").value,
          icon: document.getElementById("icon-search").value,
          description: document.getElementById("description").value,
          content: quill.root.innerHTML,
          categoryId: document.getElementById("dropdownButton").textContent,
          faqs: faqArray,
          emails: emailDetails,
        },
        { merge: true }
      ); // Use merge option to merge new data with existing document
    });
    $("#exampleModal1").modal("show");
    modalHeading.innerHTML = "Updated succesfully";
    modalBody[0].textContent =
      "Benefit data succesfully updated. Continue editing or go back";
  } catch (error) {
    $("#exampleModal1").modal("show");
    modalHeading.innerHTML = "Error updating document";
    modalBody[0].textContent = "An error occured! Try again.";
  }
}
//function to add faq data into the object to be updated into database
function pushFaqToDb() {
  let faqArray = [];
  const faqElements = document.querySelectorAll(".faq");
  faqElements.forEach((faqElement) => {
    const question = faqElement.querySelector(
      'input[name="faq-question"]'
    ).value;
    const answer = faqElement.querySelector(
      'div[name="faq-answer"]'
    ).firstChild.innerHTML;
    faqArray.push({ question, answer });
  });
  return faqArray;
}

function collectEmailDetailsFromForm(){
  let emailDetails = [];
  
  const emailDetailsContainer = document.getElementById("emailDetailsContainer");
  if(emailDetailsContainer){
    const to = emailDetailsContainer.querySelector('input[name="To"]').value;
    const cc = emailDetailsContainer.querySelector('input[name="CC"]').value;
    const subject = emailDetailsContainer.querySelector('input[name="subject"]').value;
    const content = emailDetailsContainer.querySelector('textarea[name="content"]').value;
    emailDetails.push({to, cc, subject, content});
  };
  return emailDetails;
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