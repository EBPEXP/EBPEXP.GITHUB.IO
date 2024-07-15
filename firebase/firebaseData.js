import { db } from './firebaseConfig.js';
import { collection, getDocs, doc, getDoc, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// Global arrays to store categories, benefits, icons, and HR contact details data
let categories = [];
let benefits = [];
let iconsData = [];
let hrContactDetails = [];

// Function to fetch data from Firestore and store it in global arrays
const fetchDataFromFirestore = async () => {
    try {
        // Fetch categories data
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        categories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch benefits data
        const benefitsSnapshot = await getDocs(collection(db, 'benefits'));
        benefits = benefitsSnapshot.docs.map(doc => {
            const data = doc.data();
            // Ensure ID is a number if it should be
            data.id = parseInt(data.id, 10);
            return { id: doc.id, ...data };
        });
        
        // Fetch icons data
        const iconsRef = doc(db, 'icons', 'iconList');
        const docSnap = await getDoc(iconsRef);
        if (docSnap.exists()) {
            iconsData = docSnap.data().icons;
        } else {
            console.error('No such document!');
        }

        // Fetch HR contact details data
        const hrContactDetailsSnapshot = await getDocs(collection(db, 'HR-contact-details'));
        hrContactDetails = hrContactDetailsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Cache data in localStorage
        localStorage.setItem('categories', JSON.stringify(categories));
        localStorage.setItem('benefits', JSON.stringify(benefits));
        localStorage.setItem('iconsData', JSON.stringify(iconsData));
        localStorage.setItem('hrContactDetails', JSON.stringify(hrContactDetails));

    } catch (e) {
        console.error('Error fetching data: ', e);
    }
};

// Function to fetch data from cache or Firestore
const fetchData = async () => {
    const cachedCategories = localStorage.getItem('categories');
    const cachedBenefits = localStorage.getItem('benefits');
    const cachedIconsData = localStorage.getItem('iconsData');
    const cachedHRContactDetails = localStorage.getItem('hrContactDetails');

    if (cachedCategories && cachedBenefits && cachedIconsData && cachedHRContactDetails) {
        categories = JSON.parse(cachedCategories);
        benefits = JSON.parse(cachedBenefits).map(benefit => {
            // Ensure ID is a number if it should be
            benefit.id = parseInt(benefit.id, 10);
            return benefit;
        });
        iconsData = JSON.parse(cachedIconsData);
        hrContactDetails = JSON.parse(cachedHRContactDetails);
    } else {
        await fetchDataFromFirestore();
    }
};

// Function to force re-fetch data from Firestore
const forceFetchData = async () => {
    await fetchDataFromFirestore();
};

// Function to increment the views field
const incrementViews = async (benefitId) => {
    const benefitsCollection = collection(db, 'benefits');
    const q = query(benefitsCollection, where('id', '==', benefitId));

    try {
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const benefitDoc = querySnapshot.docs[0];
            const benefitRef = benefitDoc.ref;
            const benefitData = benefitDoc.data();
            const currentViews = benefitData.views || 0;

            // Increment views by 1
            await updateDoc(benefitRef, {
                views: currentViews + 1
            });

            console.log(`Views incremented to ${currentViews + 1}`);
        } else {
            console.error('Benefit not found');
        }
    } catch (e) {
        console.error('Error updating views: ', e);
    }
};

export { fetchData, forceFetchData, incrementViews, categories, benefits, iconsData, hrContactDetails };
