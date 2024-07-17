import { auth,db } from "/firebase/firebaseConfig.js";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getDoc, doc, collection,getDocs, query, where,} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
 
let errorMessage = "";
// Function to validate email
function validateEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@experionglobal\.com$/;
  return emailPattern.test(email);
}
 
// Function to handle sign-in
async function signIn() {
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const errorMessageDiv = document.querySelector("#error-message");
 
  // Clear any previous error message and set loading text
  errorMessageDiv.textContent = "Signing in...";
 
  // Check if fields are filled
  if (!email || !password) {
    errorMessageDiv.textContent = "Please enter both email and password.";
    return;
  }
 
  // Validate email format
  if (!validateEmail(email)) {
    errorMessageDiv.textContent =
      "Please enter a valid @experionglobal.com email address.";
    return;
  }
 
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Sign-in successful
    const user = userCredential.user;
    const userEmail = user.email;
  
    const usersRef = collection(db, "authenticated-users");
    const q1 = query(usersRef, where("email", "==", userEmail));
    const querySnapshots = await getDocs(q1);
    querySnapshots.forEach((docSnapshot) => {
          
      const userData = docSnapshot.data();
      if (userData.role === "super-admin" || userData.role === "normal-admin") {
        // Redirect to the admin home page
        window.location.href = "/admin/home/adminhome.html";
      } else {
        const errorMessage = "User does not have the necessary permissions.";
        errorMessageDiv.textContent = errorMessage;
      }
      
    });
    
    // // Fetch the user document from Firestore
    // const userDoc = await getDoc(doc(db, "authenticated-users", user.uid));
    
    // // Check if the document exists
    // if (userData) {
    //   const userData = userDoc.data();
    //   console.log("User data:", userData);
      
     
    // } else {
    //   alert("User document does not exist in Firestore");
    //   // Optionally redirect to another page
    //   // window.location.href = '/index.html';
    // }
  
  }
  catch (error) {
    // Handle Errors here.
    const errorCode = error.code;
   
 
    switch (errorCode) {
      case "auth/invalid-email":
        errorMessage = "Invalid email format.";
        break;
      case "auth/user-disabled":
        errorMessage = "User account is disabled.";
        break;
      case "auth/user-not-found":
        errorMessage = "No user found with this email.";
        break;
      case "auth/wrong-password":
        errorMessage = "Incorrect password.";
        break;
      case "auth/invalid-credential":
        errorMessage = "Invalid credential.";
        break;
      default:
        errorMessage = error.message;
        break;
    }
 
    errorMessageDiv.textContent = errorMessage;
  } finally {
    // Clear loading text if sign-in operation completes (whether success or error)
    if (errorMessageDiv.textContent === "Signing in...") {
      errorMessageDiv.textContent = "";
    }
  }
}
 
// Function to handle forgot password
function forgotPassword() {
  const email = document.querySelector("#email").value;
  const errorMessageDiv = document.querySelector("#error-message");
 
  // Clear any previous error message and set loading text
  errorMessageDiv.textContent = "Sending password reset email...";
 
  // Validate email format
  if (!validateEmail(email)) {
    errorMessageDiv.textContent =
      "Please enter a valid @experionglobal.com email address.";
    return;
  }
 
  // Send password reset email
  sendPasswordResetEmail(auth, email)
    .then(() => {
      // Password reset email sent successfully
      errorMessageDiv.textContent =
        "Password reset email sent. Check your inbox.";
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      let errorMessage = "";
 
      switch (errorCode) {
        case "auth/invalid-email":
          errorMessage = "Invalid email format.";
          break;
        case "auth/user-not-found":
          errorMessage = "No user found with this email.";
          break;
        default:
          errorMessage = "An error occurred. Please try again.";
          break;
      }
 
      errorMessageDiv.textContent = errorMessage;
    })
    .finally(() => {
      // Clear loading text if password reset operation completes (whether success or error)
      if (errorMessageDiv.textContent === "Sending password reset email...") {
        errorMessageDiv.textContent = "";
      }
    });
}
 
// Event listeners
document.querySelector("#signInButton").addEventListener("click", (e) => {
  e.preventDefault();
  signIn();
});
 
document.querySelector("#forgotPasswordLink").addEventListener("click", (e) => {
  e.preventDefault();
  forgotPassword();
});