// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCI1k9hd8IBm4SYnj9NduVJkAMAOem-hgc",
  authDomain: "atoz-76648.firebaseapp.com",
  projectId: "atoz-76648",
  storageBucket: "atoz-76648.firebasestorage.app",
  messagingSenderId: "549636098254",
  appId: "1:549636098254:web:5ef6f4b96e66b1b100689f",
  measurementId: "G-FJ21QQLZCY",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM Elements
const appointmentForm = document.getElementById("appointmentForm");
console.log("Appointment form element:", appointmentForm);

// Check if all required elements exist
if (!appointmentForm) {
  console.error("Appointment form not found in the document");
}
const confirmationModal = document.getElementById("confirmationModal");
const confirmationEmail = document.getElementById("confirmationEmail");
const closeModal = document.querySelector(".close-modal");
const modalButton = document.querySelector(".modal-button");
const faqQuestions = document.querySelectorAll(".faq-question");
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const mobileMenu = document.getElementById("mobileMenu");

// Form validation
const validateForm = () => {
  let isValid = true;

  // Clear previous error messages
  document.querySelectorAll(".error-message").forEach((el) => {
    el.textContent = "";
  });

  // Validate Full Name
  const fullName = document.getElementById("fullName");
  if (!fullName.value.trim()) {
    document.getElementById("fullNameError").textContent =
      "Please enter your full name";
    isValid = false;
  }

  // Validate Email
  const email = document.getElementById("email");
  if (!email.value.trim()) {
    document.getElementById("emailError").textContent =
      "Please enter your email address";
    isValid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    document.getElementById("emailError").textContent =
      "Please enter a valid email address";
    isValid = false;
  }

  // Validate Phone
  const phone = document.getElementById("phone");
  if (!phone.value.trim()) {
    document.getElementById("phoneError").textContent =
      "Please enter your phone number";
    isValid = false;
  }

  // Validate Car Make
  const carMake = document.getElementById("carMake");
  if (!carMake.value.trim()) {
    document.getElementById("carMakeError").textContent =
      "Please enter your car make";
    isValid = false;
  }

  // Validate Car Model
  const carModel = document.getElementById("carModel");
  if (!carModel.value.trim()) {
    document.getElementById("carModelError").textContent =
      "Please enter your car model";
    isValid = false;
  }

  // Validate Car Year
  const carYear = document.getElementById("carYear");
  if (!carYear.value) {
    document.getElementById("carYearError").textContent =
      "Please enter your car year";
    isValid = false;
  } else if (carYear.value < 1950 || carYear.value > 2025) {
    document.getElementById("carYearError").textContent =
      "Please enter a valid car year (1950-2025)";
    isValid = false;
  }

  // Validate Service Type
  const serviceType = document.getElementById("serviceType");
  if (!serviceType.value) {
    document.getElementById("serviceTypeError").textContent =
      "Please select a service type";
    isValid = false;
  }

  // Validate Appointment Date
  const appointmentDate = document.getElementById("appointmentDate");
  if (!appointmentDate.value) {
    document.getElementById("appointmentDateError").textContent =
      "Please select a preferred date";
    isValid = false;
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(appointmentDate.value);
    if (selectedDate < today) {
      document.getElementById("appointmentDateError").textContent =
        "Please select a future date";
      isValid = false;
    }
  }

  // Validate Appointment Time
  const appointmentTime = document.getElementById("appointmentTime");
  if (!appointmentTime.value) {
    document.getElementById("appointmentTimeError").textContent =
      "Please select a preferred time";
    isValid = false;
  }

  return isValid;
};

// Handle form submission
appointmentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("Form submission attempted");

  if (!validateForm()) {
    console.log("Form validation failed");
    return;
  }

  console.log("Form validation passed, preparing to save data");

  // Get form data
  const formData = {
    fullName: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    carMake: document.getElementById("carMake").value,
    carModel: document.getElementById("carModel").value,
    carYear: document.getElementById("carYear").value,
    serviceType: document.getElementById("serviceType").value,
    appointmentDate: document.getElementById("appointmentDate").value,
    appointmentTime: document.getElementById("appointmentTime").value,
    additionalInfo: document.getElementById("additionalInfo").value,
    status: "pending", // Default status
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  console.log("Saving appointment data:", formData);

  // Save to Firestore
  db.collection("appointments")
    .add(formData)
    .then((docRef) => {
      console.log("Appointment saved successfully with ID:", docRef.id);

      // Show custom success popup instead of alert
      const successPopup = document.getElementById("successPopup");
      successPopup.style.display = "flex";

      // Reset form
      appointmentForm.reset();
    })
    .catch((error) => {
      console.error("Error adding appointment: ", error);
      alert(
        "There was an error submitting your appointment. Please try again."
      );
    });
});

// Close modal when clicking the X
closeModal.addEventListener("click", () => {
  confirmationModal.style.display = "none";
});

// Close modal when clicking outside of it
window.addEventListener("click", (e) => {
  if (e.target === confirmationModal) {
    confirmationModal.style.display = "none";
  }
});

// Return to home when clicking the modal button
modalButton.addEventListener("click", () => {
  window.location.href = "index.html";
});

// FAQ accordion functionality
faqQuestions.forEach((question) => {
  question.addEventListener("click", () => {
    const targetId = question.getAttribute("data-toggle");
    const answer = document.getElementById(targetId);
    const icon = question.querySelector(".toggle-icon i");

    // Toggle answer visibility
    if (answer.style.maxHeight) {
      answer.style.maxHeight = null;
      icon.classList.remove("fa-minus");
      icon.classList.add("fa-plus");
    } else {
      answer.style.maxHeight = answer.scrollHeight + "px";
      icon.classList.remove("fa-plus");
      icon.classList.add("fa-minus");
    }
  });
});

// Mobile menu toggle
mobileMenuToggle.addEventListener("click", () => {
  mobileMenuToggle.classList.toggle("active");
  mobileMenu.classList.toggle("active");
});

// Set minimum date for appointment date picker to today
const today = new Date().toISOString().split("T")[0];
document.getElementById("appointmentDate").setAttribute("min", today);

// Add these event listeners for the success popup
document.addEventListener("DOMContentLoaded", function () {
  const successPopup = document.getElementById("successPopup");
  const successClose = document.querySelector(".success-close");
  const successBtn = document.querySelector(".success-btn");

  if (successClose) {
    successClose.addEventListener("click", function () {
      successPopup.style.display = "none";
    });
  }

  if (successBtn) {
    successBtn.addEventListener("click", function () {
      successPopup.style.display = "none";
      window.location.href = "index.html";
    });
  }

  // Close popup when clicking outside
  window.addEventListener("click", function (e) {
    if (e.target === successPopup) {
      successPopup.style.display = "none";
    }
  });
});
