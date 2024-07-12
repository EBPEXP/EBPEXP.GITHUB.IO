import { forceFetchData, benefits } from '/firebase/firebaseData.js';

window.onload = async () => {
    const loadingAnimation = document.getElementById('loading-animation');

    // Show loading animation initially
    loadingAnimation.style.display = 'flex';

    // Fetch data from Firestore
    await forceFetchData();

    // Hide loading animation after everything is loaded
    loadingAnimation.style.display = 'none';

    // Initialize benefits display after hiding loading animation
    initBenefitsDisplay(benefits);
};

// Function to sort benefits by views in descending order
function sortBenefitsByViews(benefits) {
    return benefits.sort((a, b) => b.views - a.views);
}

// Function to get the top N benefits
function getTopBenefits(benefits, count) {
    return benefits.slice(0, count);
}

// Function to update HTML elements with benefit values and IDs
function updateBenefitCards(container, benefits) {
    const benefitCards = container.querySelectorAll('.benefit-card');

    benefits.forEach((benefit, index) => {
        const card = benefitCards[index];
        if (card) {
            const icon = card.querySelector('.icon');
            const title = card.querySelector('h5');

            if (icon) {
                icon.className = benefit.icon + ' icon';
            }

            if (title) {
                title.textContent = benefit.name;
            }

            // Set href with benefitDetails.html and ID
            card.href = `/user/benefitDetails/benefitDetails.html?id=${benefit.id}`;
        }
    });
}

// Function to initialize the benefits display
function initBenefitsDisplay(benefits) {
    const popularBenefitsContainers = document.querySelectorAll('.popular-benefits');

    // Sort benefits by views and get the top 8
    const sortedBenefits = sortBenefitsByViews(benefits);
    const top8Benefits = getTopBenefits(sortedBenefits, 8);

    // Update each container with the top 8 benefits
    popularBenefitsContainers.forEach(container => {
        updateBenefitCards(container, top8Benefits);
    });
}

const searchInput = document.getElementById('benefit-search');
const recommendations = document.getElementById('recommendations');

searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    recommendations.innerHTML = '';
    if (query) {
        const filteredBenefits = benefits.filter(benefit => benefit.name.toLowerCase().includes(query));
        filteredBenefits.forEach(benefit => {
            const div = document.createElement('div');
            div.className = 'recommendation-item';
            div.textContent = benefit.name;
            div.addEventListener('click', () => {
                searchInput.value = benefit.name;
                recommendations.innerHTML = '';
            });
            recommendations.appendChild(div);
        });
    }
});

function performSearch() {
    const query = searchInput.value.toLowerCase();
    const result = benefits.find(benefit => benefit.name.toLowerCase() === query);
    if (result) {
        window.location.href = `/user/benefitDetails/benefitDetails.html?id=${result.id}`;
    } else {
        alert('Benefit not found.');
    }
}
// Expose performSearch to the global scope
window.performSearch = performSearch;