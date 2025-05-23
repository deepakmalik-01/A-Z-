// JavaScript for A TO Z Car Service Booking Page
// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCI1k9hd8IBm4SYnj9NduVJkAMAOem-hgc",
  authDomain: "atoz-76648.firebaseapp.com",
  projectId: "atoz-76648",
  storageBucket: "atoz-76648.firebasestorage.app",
  messagingSenderId: "549636098254",
  appId: "1:549636098254:web:5ef6f4b96e66b1b100689f",
  measurementId: "G-FJ21QQLZCY"
};

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Get a reference to the Firestore database
    const db = firebase.firestore();

document.addEventListener("DOMContentLoaded", function () {
  // Mobile Menu Toggle
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener("click", function () {
      mobileMenu.classList.toggle("active");

      // Animate hamburger to X
      const spans = mobileMenuToggle.querySelectorAll("span");
      spans.forEach((span) => {
        span.classList.toggle("active");
      });
    });
  }

  // Validate Date Input - Set min date to today and max date to 3 months from now
  const appointmentDateInput = document.getElementById("appointmentDate");
  if (appointmentDateInput) {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setMonth(today.getMonth() + 3);

    appointmentDateInput.min = formatDate(today);
    appointmentDateInput.max = formatDate(maxDate);

    // Set default value to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    appointmentDateInput.value = formatDate(tomorrow);
  }

  // Format date as YYYY-MM-DD
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // FAQ Accordion
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question) => {
    question.addEventListener("click", function () {
      const targetId = this.getAttribute("data-toggle");
      const answer = document.getElementById(targetId);
      const icon = this.querySelector(".toggle-icon");

      // Close all other FAQ items
      document.querySelectorAll(".faq-answer").forEach((item) => {
        if (item.id !== targetId) {
          item.classList.remove("show");
        }
      });

      document.querySelectorAll(".toggle-icon").forEach((toggleIcon) => {
        if (toggleIcon !== icon) {
          toggleIcon.classList.remove("active");
        }
      });

      // Toggle current FAQ item
      answer.classList.toggle("show");
      icon.classList.toggle("active");
    });
  });

  // Form Validation
  const appointmentForm = document.getElementById("appointmentForm");

  if (appointmentForm) {
        appointmentForm.addEventListener("submit", function (e) {
          e.preventDefault();

          if (validateForm()) {
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
              timestamp: firebase.firestore.FieldValue.serverTimestamp() // Add a timestamp
            };

            // Add data to Firestore
            db.collection("appointments").add(formData)
              .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
                // Show confirmation modal
                showConfirmationModal();
                // Reset form
                appointmentForm.reset();
                 // Set default date again
                const tomorrow = new Date();
                tomorrow.setDate(new Date().getDate() + 1);
                 const appointmentDateInput = document.getElementById("appointmentDate");
                 if (appointmentDateInput) {
                   appointmentDateInput.value = formatDate(tomorrow);
                }

              })
              .catch((error) => {
                console.error("Error adding document: ", error);
                alert("There was an error scheduling your appointment. Please try again."); // Show an error message
              });
          }
        });
      }


  function validateForm() {
    let isValid = true;

    // Clear previous error messages
    document.querySelectorAll(".error-message").forEach((error) => {
      error.textContent = "";
    });

    // Validate full name
    const fullName = document.getElementById("fullName");
    if (!fullName.value.trim()) {
      document.getElementById("fullNameError").textContent =
        "Please enter your full name";
      isValid = false;
    } else if (fullName.value.trim().length < 3) {
      document.getElementById("fullNameError").textContent =
        "Name must be at least 3 characters long";
      isValid = false;
    }

    // Validate email
    const email = document.getElementById("email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      document.getElementById("emailError").textContent =
        "Please enter your email address";
      isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
      document.getElementById("emailError").textContent =
        "Please enter a valid email address";
      isValid = false;
    }

    // Validate phone
    const phone = document.getElementById("phone");
    const phoneRegex = /^\d{10,15}$/;
    if (!phone.value.trim()) {
      document.getElementById("phoneError").textContent =
        "Please enter your phone number";
      isValid = false;
    } else if (!phoneRegex.test(phone.value.replace(/\D/g, ""))) {
      document.getElementById("phoneError").textContent =
        "Please enter a valid phone number";
      isValid = false;
    }

    // Validate car make
    const carMake = document.getElementById("carMake");
    if (!carMake.value.trim()) {
      document.getElementById("carMakeError").textContent =
        "Please enter your car make";
      isValid = false;
    }

    // Validate car model
    const carModel = document.getElementById("carModel");
    if (!carModel.value.trim()) {
      document.getElementById("carModelError").textContent =
        "Please enter your car model";
      isValid = false;
    }

    // Validate car year
    const carYear = document.getElementById("carYear");
    const currentYear = new Date().getFullYear();
    if (!carYear.value) {
      document.getElementById("carYearError").textContent =
        "Please enter your car year";
      isValid = false;
    } else if (carYear.value < 1950 || carYear.value > currentYear + 1) {
      document.getElementById(
        "carYearError"
      ).textContent = `Please enter a year between 1950 and ${currentYear + 1}`;
      isValid = false;
    }

    // Validate service type
    const serviceType = document.getElementById("serviceType");
    if (!serviceType.value) {
      document.getElementById("serviceTypeError").textContent =
        "Please select a service type";
      isValid = false;
    }

    // Validate appointment date
    const appointmentDate = document.getElementById("appointmentDate");
    if (!appointmentDate.value) {
      document.getElementById("appointmentDateError").textContent =
        "Please select a preferred date";
      isValid = false;
    } else {
      const selectedDate = new Date(appointmentDate.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        document.getElementById("appointmentDateError").textContent =
          "Please select a future date";
        isValid = false;
      }
    }

    // Validate appointment time
    const appointmentTime = document.getElementById("appointmentTime");
    if (!appointmentTime.value) {
      document.getElementById("appointmentTimeError").textContent =
        "Please select a preferred time";
      isValid = false;
    }

    // Validate agreement
    const agreement = document.getElementById("agreement");
    if (!agreement.checked) {
      document.getElementById("agreementError").textContent =
        "You must agree to the terms and conditions";
      isValid = false;
    }

    return isValid;
  }

  // Confirmation Modal
  const modal = document.getElementById("confirmationModal");
  const closeModal = document.querySelector(".close-modal");
  const modalButton = document.querySelector(".modal-button");

  function showConfirmationModal() {
    // Set confirmation email
    const emailInput = document.getElementById("email");
    const confirmationEmail = document.getElementById("confirmationEmail");
    if (emailInput && confirmationEmail) {
      confirmationEmail.textContent = emailInput.value;
    }

    // Show modal
    modal.classList.add("show");
  }

  if (closeModal) {
    closeModal.addEventListener("click", function () {
      modal.classList.remove("show");
    });
  }

  if (modalButton) {
    modalButton.addEventListener("click", function () {
      modal.classList.remove("show");
      window.location.href = "index.html";
    });
  }

  // Close modal on clicking outside
  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.classList.remove("show");
    }
  });

  // Auto-format phone number
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      // Get only digits from the input
      let digits = e.target.value.replace(/\D/g, "");

      // Limit to 15 digits
      if (digits.length > 15) {
        digits = digits.substring(0, 15);
      }

      // Format the number with parentheses and hyphens
      let formatted = "";
      if (digits.length > 0) {
        formatted = digits;
        if (digits.length > 3) {
          formatted = digits.substring(0, 3) + "-" + digits.substring(3);
        }
        if (digits.length > 6) {
          formatted = formatted.substring(0, 7) + "-" + digits.substring(6);
        }
      }

      e.target.value = formatted;
    });
  }

  // Scroll event for header
  const header = document.querySelector(".header");

  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }
});
