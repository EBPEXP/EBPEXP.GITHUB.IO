import { fetchData,incrementViews, categories, benefits} from '/firebase/firebaseData.js';

document.addEventListener("DOMContentLoaded", async() => {
  // const loadingAnimation = document.getElementById('loading-animation');

  // Show loading animation initially
  // loadingAnimation.style.display = 'flex';

  // Fetch data from Firestore
  await fetchData();
  // alert(JSON.stringify(benefits, null, 2));

  // Hide loading animation after everything is loaded
  // loadingAnimation.style.display = 'none';

  // Get benefit ID from URL and display corresponding details
  const benefitId = getBenefitIdFromURL();

  if (benefitId) {
    
    //Display benefit details
    displayBenefitDetails(benefitId);
    //Populate nav banner
    populateNavbanner(benefitId);
    // Populate the menu
    populateMenu(benefitId);
    const incrementIntBenefitId = parseInt(benefitId, 10);
    incrementViews(incrementIntBenefitId);
  }
});

// Function to get the benefit ID from the URL
function getBenefitIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// Get benefit by benefit id
function getBenefitById(benefits, benefitId) {
  const benefit = benefits.find((b) => b.id == benefitId);
  return benefit;
}

// Get category details by categoryId
function getCategoryById(categories, categoryId) {
  return categories.find((category) => category.id === categoryId);
}

//Populate nav banner
function populateNavbanner(benefitId) {
  const benefit = getBenefitById(benefits, benefitId);
  const category = getCategoryById(categories, benefit.categoryId);
  if (category) {
    const banner = document.querySelector(".leftNavBanner");
    const iconElement = banner.querySelector("i");
    const nameElement = banner.querySelector("h6");
    // Update icon class and name
    iconElement.className = category.icon;
    nameElement.textContent = category.name;
  } else {
    console.error(
      `Category with id ${getBenefitById(benefitId).categoryId} not found.`
    );
  }
}

// Populate the menu
function populateMenu(benefitId) {
  const benefitsMenu = document.getElementById("benefit-menu");
  benefits.forEach((benefit) => {
    if (benefit.categoryId == getBenefitById(benefits, benefitId).categoryId) {
      const menuItem = document.createElement("li");
      menuItem.classList.add("nav-item", "navItem");
      if (benefit.id == benefitId) {
        menuItem.innerHTML = `<a class="nav-link navLink leftNavActive" href="?id=${benefit.id}">${benefit.name}</a>`;
      } else {
        menuItem.innerHTML = `<a class="nav-link navLink" href="?id=${benefit.id}">${benefit.name}</a>`;
      }
      benefitsMenu.appendChild(menuItem);
    }
  });
}

// Function to display benefit details
function displayBenefitDetails(benefitId) {
  const benefitTitle = document.getElementById("benefit-title");
  const description = document.getElementById("description");
  const benefitContent = document.getElementById("benefit-content");
  const faqContainer = document.getElementById("accordionContainer");
  const benefit = getBenefitById(benefits, benefitId);
  if (benefit) {
    benefitTitle.textContent = benefit.name;
    description.textContent = benefit.description;
    benefitContent.innerHTML = benefit.content;

    // Clear and populate FAQs
    faqContainer.innerHTML = "";
    benefit.faqs.forEach((faq, index) => {
      const faqItem = document.createElement("div");
      faqItem.classList.add("accordion-item");
      faqItem.innerHTML = `
                <h2 class="accordion-header" id="heading${index}">
                    <button class="accordion-button collapsed p-2" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                        ${faq.question}
                    </button>
                </h2>
                <div id="collapse${index}" class="accordion-collapse collapse m-0" aria-labelledby="heading${index}" data-bs-parent="#accordionContainer">
                    <div class="accordion-body p-2">
                        ${faq.answer}
                    </div>
                </div>
            `;
      faqContainer.appendChild(faqItem);
    });
  }
}

// Initialize Quill editor
// document.addEventListener("DOMContentLoaded", function() {
//     var quill = new Quill('#editor-container', {
//       theme: 'snow'
//     });

//   // Get the display content button and output div
//   var displayContentBtn = document.getElementById('display-content-btn');
//   var outputDiv = document.getElementById('output');

//   // Add click event listener to the button
//   displayContentBtn.addEventListener('click', function() {
//     // Get the HTML content from the editor
//     var content = quill.root.innerHTML;
//     console.log(content);
//     // Display the content in the output div
//     outputDiv.innerHTML = content;
//   });
// });
