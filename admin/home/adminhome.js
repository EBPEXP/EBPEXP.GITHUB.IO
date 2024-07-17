import { auth, db } from "/firebase/firebaseConfig.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import {
  hrContactDetails,
  fetchData,
  forceFetchData,
} from "/firebase/firebaseData.js";

document.addEventListener("DOMContentLoaded", async function () {
  await fetchData(); // Fetch data on page load

  checkAuth(); // Check authentication status on page load

  document
    .querySelector("#addAdminButton")
    .addEventListener("click", function () {
      openPasswordModal();
    });

  document.querySelector("#logoutLink").addEventListener("click", function (e) {
    e.preventDefault();
    logout();
  });

  // Attach event listener to the "Edit HR Contact" button to open the modal and pre-fill fields
  document
    .getElementById("editHrContactButton")
    .addEventListener("click", function () {
      preFillModal();
      $("#editHrContactModal").modal("show");
    });

  document
    .getElementById("saveChangesButton")
    .addEventListener("click", function () {
      var email = document.getElementById("email").value;
      var phone = document.getElementById("phone").value;
      var teamsMail = document.getElementById("teamsMail").value;

      if (hrContactDetails.length === 0) {
        return;
      }

      // Get the document ID for the HR contact details
      var hrContactDetailId = hrContactDetails[0].id; // Assuming there's only one document

      // Reference to the document in Firestore
      var docRef = doc(db, "HR-contact-details", hrContactDetailId);

      // Update the document
      setDoc(docRef, {
        email: email,
        contactnumber: phone,
        teamsmail: teamsMail,
      })
        .then(() => {
          document.getElementById("result").textContent =
            "Details successfully updated!";
          // Close the modal after saving changes
          forceFetchData();
          setTimeout(() => {
            $("#editHrContactModal").modal("hide");
            document.getElementById("result").textContent = "";
          }, 1500);
        })
        .catch((error) => {
          document.getElementById("result").textContent =
            "Error updating data!";
          setTimeout(() => {
            $("#editHrContactModal").modal("hide");
            document.getElementById("result").textContent = "";
          }, 2000);
        });
    });

  // Handle the password submission for adding admin
  document
    .getElementById("passwordSubmitButton")
    .addEventListener("click", async function () {
      $("#passwordModal").modal("hide"); // Manually close the modal after adding admin
      await addAdmin();
    });

  // Manually close the modal when the close button is clicked
  document
    .getElementById("passwordModalCloseButton")
    .addEventListener("click", function () {
      $("#passwordModal").modal("hide");
    });
});

function checkAuth() {
  auth.onAuthStateChanged((user) => {
    if (!user) {
      // User is not logged in, redirect to login page
      window.location.href = "/admin/login/login.html";
    }
  });
}

async function addAdmin() {
  const email = document.querySelector(".email-input").value.trim();
  const errorMessageDiv = document.querySelector("#error-message");
  const addAdminButton = document.querySelector("#addAdminButton");

  // Clear any previous error message
  errorMessageDiv.textContent = "";
  // Show loading text
  errorMessageDiv.textContent = "Loading...";

  if (!email || !validateEmail(email)) {
    errorMessageDiv.textContent =
      "Please enter a valid @experionglobal.com email address.";
    return;
  }

  // Save the current user's authentication state
  const currentUser = auth.currentUser;
  if (!currentUser) {
    errorMessageDiv.textContent = "No authenticated user found.";
    return;
  }
  const currentUserEmail = currentUser.email;

  // Get the entered password from the modal
  const currentUserPassword = document
    .getElementById("passwordInput")
    .value.trim();
  if (!currentUserPassword) {
    errorMessageDiv.textContent = "Password is required to re-authenticate.";
    return;
  }

  try {
    // Re-authenticate the current user
    await signInWithEmailAndPassword(
      auth,
      currentUserEmail,
      currentUserPassword
    );

    // Create the new user with a default password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      "defaultpassword"
    );

    // Send email to the new user to set password
    await sendPasswordResetEmail(auth, email);
    // Add user data to Firestore
    const user = userCredential.user;

    await setDoc(doc(db, "authenticated-users", user.uid), {
      email: email,
      role: "normal-admin",
    });
    errorMessageDiv.textContent = `Admin privilege added for ${email}. Check your email to set the password.`;

    // Re-sign in the original user
    await signInWithEmailAndPassword(
      auth,
      currentUserEmail,
      currentUserPassword
    );

    $("#passwordModal").modal("hide");
  } catch (error) {
    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessageDiv.textContent = "Email already in use.";
        break;
      default:
        errorMessageDiv.textContent = `Error adding admin: ${error.message}`;
        break;
    }
  } finally {
    addAdminButton.disabled = false; // Re-enable the button after operation
  }
}

function logout() {
  auth
    .signOut()
    .then(() => {
      // Sign-out successful.
      window.location.href = "/index.html";
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
}

function validateEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@experionglobal\.com$/;
  return emailPattern.test(email);
}

// Function to pre-fill modal fields with existing HR contact details
function preFillModal() {
  if (hrContactDetails.length === 0) {
    console.error("HR contact details are not loaded.");
    return;
  }

  const hrContactDetail = hrContactDetails[0]; // Assuming there's only one document

  document.getElementById("email").value = hrContactDetail.email || "";
  document.getElementById("phone").value = hrContactDetail.contactnumber || "";
  document.getElementById("teamsMail").value = hrContactDetail.teamsmail || "";
}

// Function to open the password modal and display the user's email
function openPasswordModal() {
  const currentUser = auth.currentUser;
  if (currentUser) {
    document.getElementById("userEmail").textContent = currentUser.email;
    $("#passwordModal").modal("show");
  }
}



