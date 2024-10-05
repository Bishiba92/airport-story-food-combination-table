// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpUd_j2qhjjfeUpcf7umpol2NIQoVEsUk",
  authDomain: "airportstory-b457c.firebaseapp.com",
  projectId: "airportstory-b457c",
  storageBucket: "airportstory-b457c.appspot.com",
  messagingSenderId: "1050727754181",
  appId: "1:1050727754181:web:9f48bb912c5ef87e8e43ac",
  measurementId: "G-PPSNPW9JMH",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const firebaseDatabase = firebase.firestore(); // Initialize Firestore
//const analytics = firebase.getAnalytics(app);

// Ensure you've already initialized Firebase here

// Function to set a specific field in a document
function setField(collectionName, docId, fieldName, value) {
  try {
    console.log("setField:");
    console.table({ collectionName, docId, fieldName, value });
    const docRef = firebaseDatabase.doc(`${collectionName}/${docId}`);
    return docRef
      .set({ [fieldName]: value }, { merge: true })  // Use set with merge to create or update
      .then(() => {
        console.log("Document successfully set or updated!");
      })
      .catch((error) => {
        console.error("Error setting or updating document: ", error);
      });
  } catch (err) {
    console.error(`setField error: ${err}`);
    throw new Error(
      `setField failed. collectionName: ${collectionName} | docId: ${docId} | fieldName: ${fieldName} | value: ${value} | error: ${err}`,
    );
  }
}

// Function to increment the visitor count
function updateVisitorCount() {
  const collectionName = "Visitors";
  const docId = "visitors";
  const fieldName = "number";
  const incrementAmount = 1; // Value to increment

  // Check if the user has a cookie indicating a recent visit
  const lastVisitTime = getCookie("lastVisitorTime");
  const currentTime = new Date().getTime();
  const tenMinutes = 600000; // 10 minutes in milliseconds

  if (lastVisitTime && currentTime - lastVisitTime < tenMinutes) return;

  // Use Firestore increment to update the visitor count
  const docRef = firebaseDatabase.doc(`${collectionName}/${docId}`);
  docRef
    .update({
      [fieldName]: firebase.firestore.FieldValue.increment(incrementAmount),
    })
    .then(() => {
      setCookie("lastVisitorTime", currentTime, 10); // Set cookie for 10 minutes
      console.log("Visitor count has been increased.");
    })
    .catch((error) => {
      console.error("Error increasing visitor count: ", error);
    });
}

// Rest of the cookie functions remain the same

// Function to set a cookie
function setCookie(name, value, minutes) {
  const d = new Date();
  d.setTime(d.getTime() + minutes * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Function to get a cookie
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
