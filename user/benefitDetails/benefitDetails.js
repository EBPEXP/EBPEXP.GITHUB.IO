import {
  fetchData,
  incrementViews,
  categories,
  benefits,
  hrContactDetails,
} from "/firebase/firebaseData.js";
let faqCount=0;
const benefitId = getBenefitIdFromURL();
document.addEventListener("DOMContentLoaded", async () => {
  // Fetch data from Firestore
  await fetchData();
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
    populateHRdetails(benefitId);
  }
});

//download feature
const downloadButton = document.getElementById("downloadButton");
downloadButton.addEventListener("click", function () {
  downloadButton.style.display = "none";
  const benefitName = getBenefitById(benefits, benefitId).name;
  var opt = {
    margin: 0.3, // Margin around the content in inches
    filename: `${benefitName}.pdf`, // Name of the generated PDF file
    image: { type: "jpeg", quality: 0.98 }, // Image settings for the PDF
    html2canvas: { scale: 4 }, // Scaling factor for html2canvas to improve quality
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" }, // PDF settings
  };
  var element = document.getElementById("div2Pdf");
  html2pdf()
    .from(element)
    .set(opt)
    .save()
    .then(function () {
      downloadButton.style.display = "block";
    });
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
      menuItem.classList.add("nav-item", "leftNavItem");
      if (benefit.id == benefitId) {
        menuItem.innerHTML = `<a class="nav-link leftNavLink leftNavActive" href="?id=${benefit.id}">${benefit.name}</a>`;
      } else {
        menuItem.innerHTML = `<a class="nav-link leftNavLink" href="?id=${benefit.id}">${benefit.name}</a>`;
      }
      benefitsMenu.appendChild(menuItem);
    }
  });
}

// Function to display benefit details
function displayBenefitDetails(benefitId) {
  const benefitTitle = document.getElementById("benefit-title");
  const description = document.getElementById("description");
  const faqContainer = document.getElementById("accordionContainer");
  const benefit = getBenefitById(benefits, benefitId);
  if (benefit) {
    benefitTitle.textContent = benefit.name;
    description.textContent = benefit.description;
    const options = {
      readOnly: true,
      modules: {
        toolbar: null
      },
      theme: 'snow'
    };
    const quill = new Quill('#benefit-content', options);
    quill.root.innerHTML = benefit.content;
    
    if(benefit.emails[0]){
      document.getElementById("customMailBox").style.display= 'flex';
      const encodedBody = encodeURIComponent(benefit.emails[0].content).replace(/%0A/g, '%0D%0A');
      document.getElementById("customMail").setAttribute("href","mailto:"+benefit.emails[0].to+"?cc="+benefit.emails[0].cc+"&subject="+benefit.emails[0].subject+"&body="+encodedBody);
    }

    if(benefit.links[0]){
      const supportLinksContainer = document.getElementById("supportLinksContainer");
      supportLinksContainer.style.display = 'flex';
      const supportLinks = document.getElementById("supportLinks");
      // Clear and populate links
      supportLinks.innerHTML = "";
      benefit.links.forEach(link => {
        const linkBtn = document.createElement("a");
        linkBtn.setAttribute("href",link.link);
        linkBtn.setAttribute("target","_blank");
        linkBtn.innerText = link.name;
        supportLinks.appendChild(linkBtn);
      })
    }

    if(benefit.faqs[0]){
      document.getElementById("faq").style.display = 'block';
      // Clear and populate FAQs
      faqContainer.innerHTML = "";
      benefit.faqs.forEach((faq, index) => {
        faqCount++;
        const faqItem = document.createElement("div");
        faqItem.classList.add("accordion-item");
        faqItem.innerHTML = `
                  <h2 class="accordion-header" id="heading${index}">
                      <button class="accordion-button collapsed p-2" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                          ${faq.question}
                      </button>
                  </h2>
                  <div id="collapse${index}" class="accordion-collapse collapse m-0" aria-labelledby="heading${index}" data-bs-parent="#accordionContainer">
                      <div class="accordion-body p-0">
                      <div id="faqQuill${faqCount}" name="faq-answer"></div>
                      </div>
                  </div>
              `;
        faqContainer.appendChild(faqItem);
        let faqQuillId = `#faqQuill${faqCount}`
        const options = {
          readOnly: true,
          modules: {
            toolbar: null
          },
          theme: 'snow'
        };
        faqQuillId = new Quill(faqQuillId, options);
        faqQuillId.root.innerHTML=faq.answer;
      });
      if (document.getElementById("collapse0")) {
        document.getElementById("collapse0").classList.add("show");
      }
    }
  }
}

//function to populate hr contact details
function populateHRdetails(benefitId){
  const teamsCall = document.getElementById("teamsCall");
  const email = document.getElementById("email");
  const teamsMessage = document.getElementById("teamsMessage");
  teamsCall.parentElement.setAttribute("href","https://teams.microsoft.com/l/call/0/0?users="+hrContactDetails[0].teamsCall);
  email.textContent= hrContactDetails[0].email;
  const benefitName = getBenefitById(benefits, benefitId).name;
  email.parentElement.setAttribute(
    "href",
    "mailto:" + hrContactDetails[0].email + "?subject=Query on " + benefitName
  );
  teamsMessage.setAttribute(
    "href",
    "https://teams.microsoft.com/l/chat/0/0?users=" +
      hrContactDetails[0].teamsmail +
      "&message=Hello%20I%20had%20a%20query%20on%20" +
      benefitName
  );
}
