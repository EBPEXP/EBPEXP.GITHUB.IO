import {
  onAuthStateChanged,
  signOut,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { auth, db } from "/firebase/firebaseConfig.js";

// Execute when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Get elements to display admin and super admin lists
    const adminListElement = document.getElementById("adminList");
    const superAdminListElement = document.getElementById("superAdminList");
    const inactiveAdminListElement = document.getElementById("inactiveadminList");

    // Reference to the authenticated-users collection in Firestore
    const usersRef = collection(db, "authenticated-users");

    // Listen for changes in authentication state
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const currentUserUid = user.uid;
        const currentUsermail = user.email;

        let spanElement = document.getElementById('currentSuperAdmin');
        spanElement.textContent = currentUsermail;

        // Query for super-admin users
        const q1 = query(usersRef, where("role", "==", "super-admin"));
        const querySnapshots = await getDocs(q1);
        const superAdminHeader = document.createElement("h3");
        superAdminHeader.textContent = "Super-Admins";
        superAdminHeader.className = "px-5 align-self-start";

// Append the header to the super admin list element
      superAdminListElement.appendChild(superAdminHeader);
        
        querySnapshots.forEach((docSnapshot) => {
          const userData = docSnapshot.data();
          
          if (userData.email !== currentUsermail) {
            
            const email = userData.email;

            // Create elements to display super-admin user info
            const userWrapper = document.createElement("div");
            userWrapper.className =
              "input-wrapper d-flex justify-content-between align-items-center border border-black rounded px-2";

            const emailSpan = document.createElement("span");
            emailSpan.id = `emailID-superAdmin-${docSnapshot.id}`;
            emailSpan.textContent = email;

            const buttonContainer = document.createElement("div");
            buttonContainer.className = "d-flex align-end";

            const revokePermissionButton = document.createElement("button");
            revokePermissionButton.className = "subscribe-button m-2 rounded";
            revokePermissionButton.id = `revokePermissionButton-${docSnapshot.id}`;
            revokePermissionButton.textContent = "Revoke Permission";

            // Append elements to the DOM
            buttonContainer.appendChild(revokePermissionButton);
            userWrapper.appendChild(emailSpan);
            userWrapper.appendChild(buttonContainer);
            superAdminListElement.appendChild(userWrapper);

            // Add event listener to revoke permission button
            revokePermissionButton.addEventListener("click", async () => {
              const userEmail = emailSpan.textContent.trim();

              try {
                const userDocRef = doc(db, "authenticated-users", docSnapshot.id);
                const userDocSnap = await getDoc(userDocRef);
                const currentRole = userDocSnap.data().role;

                const newRole =
                  currentRole === "super-admin"
                    ? "normal-admin"
                    : "super-admin";
                const newButtonText =
                  newRole === "super-admin"
                    ? "Revoke Permission"
                    : "Add Permission";

                // Update user role in Firestore
                await setDoc(userDocRef, { role: newRole }, { merge: true });

                revokePermissionButton.textContent = newButtonText;

                console.log(`Role updated successfully for ${userEmail}`);
                alert(`Role updated successfully for ${userEmail}`);
              } catch (error) {
                console.error("Error updating role:", error);
                alert(
                  "Failed to update role. Check console for error details."
                );
              
              }
              location.reload();

            });
          }
        });

        // Query for normal-admin users
        const q = query(usersRef, where("role", "==", "normal-admin"));
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((docSnapshot) => {
          
          const userData = docSnapshot.data();
          // console.log(userData.role);
          const email = userData.email;

          // Create elements to display normal users info
          const userWrapper = document.createElement("div");
          userWrapper.className =
            "input-wrapper d-flex justify-content-between align-items-center border border-black rounded px-2";

          const emailSpan = document.createElement("span");
          emailSpan.id = `emailId-${docSnapshot.id}`;
          emailSpan.textContent = email;

          const buttonContainer = document.createElement("div");
          buttonContainer.className = "d-flex align-end";

          const addPermissionButton = document.createElement("button");
          addPermissionButton.className = "subscribe-button m-2 rounded";
          addPermissionButton.id = `addAdminButton-${docSnapshot.id}`;
          addPermissionButton.textContent = "Make Super Admin";

          const deleteAdminButton = document.createElement("button");
          deleteAdminButton.className = "subscribe-button m-2 rounded";
          deleteAdminButton.id = `deleteAdminButton-${docSnapshot.id}`;
          deleteAdminButton.textContent = "Revoke Permission";

          // Set initial button text based on current role
          const currentRole = userData.role;
          if (currentRole === "normal-admin") {
            deleteAdminButton.textContent = "Revoke Permission";
          } else {
            deleteAdminButton.textContent = "Add Permission";
          }
          // quesry for normal-user
          const qq = query(usersRef, where("role", "==", "normal-user"));
          
          // Add event listener to add permission button
          addPermissionButton.addEventListener("click", async () => {
            try {
              const userDocRef = doc(db, "authenticated-users", docSnapshot.id);
              await setDoc(userDocRef, { role: "super-admin" }, { merge: true });

              console.log(`Role updated successfully for ${email}`);
              alert(`Role updated successfully for ${email}`);
            } catch (error) {
              console.error("Error updating role:", error);
              alert("Failed to update role. Check console for error details.");
            }
            location.reload();

          });

          // Add event listener to delete permission button
          deleteAdminButton.addEventListener("click", async () => {
            const userEmail = emailSpan.textContent.trim();

            try {
              const userDocRef = doc(db, "authenticated-users", docSnapshot.id);
              const userDocSnap = await getDoc(userDocRef);
              const currentRole = userDocSnap.data().role;

              const newRole =
                currentRole === "normal-admin" ? "normal-user" : "normal-admin";
              const newButtonText =
                newRole === "normal-admin" ? "Revoke Permission" : "Add Permission";

              // Update user role in Firestore
              await setDoc(userDocRef, { role: newRole }, { merge: true });

              deleteAdminButton.textContent = newButtonText;

              
              alert(`Role updated successfully for ${userEmail}`);
            } catch (error) {
              
              alert("Failed to update role. Check console for error details.");
            }
            location.reload();
          });

          // Append elements to the DOM
          buttonContainer.appendChild(addPermissionButton);
          buttonContainer.appendChild(deleteAdminButton);
          userWrapper.appendChild(emailSpan);
          userWrapper.appendChild(buttonContainer);
          adminListElement.appendChild(userWrapper);
        });
        //Query for normal-users
        const qq = query(usersRef, where("role", "==", "normal-user"));
        const querySnapshot1 = await getDocs(qq);
        
        querySnapshot1.forEach((docSnapshot) => {
          
          const userData = docSnapshot.data();
          console.log(userData.role);
          const email = userData.email;

          // Create elements to display normal users info
          const userWrapper = document.createElement("div");
          userWrapper.className =
            "input-wrapper d-flex justify-content-between align-items-center border border-black rounded px-2";

          const emailSpan = document.createElement("span");
          emailSpan.id = `emailId-${docSnapshot.id}`;
          emailSpan.textContent = email;

          const buttonContainer = document.createElement("div");
          buttonContainer.className = "d-flex align-end";

          const addPermissionButton = document.createElement("button");
          addPermissionButton.className = "subscribe-button m-2 rounded";
          addPermissionButton.id = `addAdminButton-${docSnapshot.id}`;
          addPermissionButton.textContent = "Make Super Admin";

          const deleteAdminButton = document.createElement("button");
          deleteAdminButton.className = "subscribe-button m-2 rounded";
          deleteAdminButton.id = `deleteAdminButton-${docSnapshot.id}`;
          deleteAdminButton.textContent = "Revoke Permission";

          // Set initial button text based on current role
          const currentRole = userData.role;
          if (currentRole === "normal-admin") {
            deleteAdminButton.textContent = "Revoke Permission";
          } else {
            deleteAdminButton.textContent = "Add Permission";
          }
          
          
          // Add event listener to add permission button
          addPermissionButton.addEventListener("click", async () => {
            try {
              const userDocRef = doc(db, "authenticated-users", docSnapshot.id);
              await setDoc(userDocRef, { role: "super-admin" }, { merge: true });

              console.log(`Role updated successfully for ${email}`);
              alert(`Role updated successfully for ${email}`);
            } catch (error) {
              console.error("Error updating role:", error);
              alert("Failed to update role. Check console for error details.");
            }
            location.reload();

          });

          // Add event listener to delete permission button
          deleteAdminButton.addEventListener("click", async () => {
            const userEmail = emailSpan.textContent.trim();

            try {
              const userDocRef = doc(db, "authenticated-users", docSnapshot.id);
              const userDocSnap = await getDoc(userDocRef);
              const currentRole = userDocSnap.data().role;

              const newRole =
                currentRole === "normal-admin" ? "normal-user" : "normal-admin";
              const newButtonText =
                newRole === "normal-admin" ? "Revoke Permission" : "Add Permission";

              // Update user role in Firestore
              await setDoc(userDocRef, { role: newRole }, { merge: true });

              deleteAdminButton.textContent = newButtonText;

              
              alert(`Role updated successfully for ${userEmail}`);
            } catch (error) {
              
              alert("Failed to update role. Check console for error details.");
            }
            location.reload();
          });

          // Append elements to the DOM
          buttonContainer.appendChild(addPermissionButton);
          buttonContainer.appendChild(deleteAdminButton);
          userWrapper.appendChild(emailSpan);
          userWrapper.appendChild(buttonContainer);
          inactiveAdminListElement.appendChild(userWrapper);
        });
      }
    });
  } catch (error) {
    console.error("Error fetching users: ", error);
    document.getElementById("error-message").textContent =
      "Error loading admin users.";
  }
});

// Listen for changes in authentication state to update UI
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    const userDocRef = doc(db, "authenticated-users", uid);
    const userDocSnap = await getDoc(userDocRef);

    const email = user.email;
    const username = email.split("@")[0].split(".")[0];

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      if (userData.role === "super-admin") {
        document.getElementById(
          "greeting"
        ).textContent = `Hi ${capitalizedUsername}`;
        document.getElementById("emailId").textContent = email; // Update email span here
      } else {
        window.location.href = '/index.html';
        alert("You do not have the necessary permissions to access this page.");
      }
    } else {
      console.log("No such document!");
    }
  } else {
    window.location.href = "/index.html";
  }
});

// Listen for changes in authentication state to handle user actions
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const email = user.email;
    const username = email.split("@")[0].split(".")[0];
    const capitalizedUsername =
    username.charAt(0).toUpperCase() + username.slice(1);

    document.getElementById("greeting").textContent = `Hi ${capitalizedUsername}`;

    const deleteButton = document.getElementById("deleteAdminButton");
    if (deleteButton) {
      // Add event listener to delete account button
      deleteButton.addEventListener("click", async () => {
        if (
          confirm(
            "Are you sure you want to delete your account? This action cannot be undone."
          )
        ) {
          try {
            const password = prompt(
              "Please enter your password to confirm deletion:"
            );
            const credential = EmailAuthProvider.credential(
              user.email,
              password
            );
            await reauthenticateWithCredential(user, credential);

            await deleteUserData(user.uid);

            await deleteUser(user);

            await signOut(auth);

            alert("Your account has been deleted successfully.");
            window.location.href = "/index.html";
          } catch (error) {
            console.error("Error deleting user:", error);
            alert(
              "Failed to delete user account. Please check console for details."
            );
          }
        }
      });
    }
  } else {
    console.log("No user is signed in");
  }
});

// Function to delete user data from Firestore
async function deleteUserData(uid) {
  const userDocRef = doc(db, "authenticated-users", uid);
  await deleteDoc(userDocRef);
}
