// Initialize Firebase with the same config as book.js
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
const auth = firebase.auth();

// DOM Elements
const loginSection = document.getElementById("loginSection");
const appointmentsSection = document.getElementById("appointmentsSection");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const logoutBtn = document.getElementById("logoutBtn");
const appointmentsTableBody = document.getElementById("appointmentsTableBody");
const loadingIndicator = document.getElementById("loadingIndicator");
const noAppointments = document.getElementById("noAppointments");
const statusFilter = document.getElementById("statusFilter");
const dateFilter = document.getElementById("dateFilter");
const clearFiltersBtn = document.getElementById("clearFilters");
const appointmentModal = document.getElementById("appointmentModal");
const appointmentDetails = document.getElementById("appointmentDetails");
const confirmAppointmentBtn = document.getElementById("confirmAppointment");
const completeAppointmentBtn = document.getElementById("completeAppointment");
const cancelAppointmentBtn = document.getElementById("cancelAppointment");
const closeModalBtn = document.querySelector(".close-modal");

// Current appointments data
let currentAppointments = [];
let selectedAppointmentId = null;

// Authentication state observer
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    loginSection.classList.add("hidden");
    appointmentsSection.classList.remove("hidden");
    loadAppointments();
  } else {
    // User is signed out
    loginSection.classList.remove("hidden");
    appointmentsSection.classList.add("hidden");
  }
});

// Login form submission
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  loginError.textContent = "";

  auth.signInWithEmailAndPassword(email, password).catch((error) => {
    loginError.textContent = error.message;
  });
});

// Logout button
logoutBtn.addEventListener("click", () => {
  auth.signOut();
});

// Load appointments from Firestore
function loadAppointments() {
  loadingIndicator.classList.remove("hidden");
  noAppointments.classList.add("hidden");
  appointmentsTableBody.innerHTML = "";

  db.collection("appointments")
    .orderBy("appointmentDate", "desc")
    .get()
    .then((snapshot) => {
      loadingIndicator.classList.add("hidden");

      if (snapshot.empty) {
        noAppointments.classList.remove("hidden");
        return;
      }

      currentAppointments = [];
      snapshot.forEach((doc) => {
        const appointment = {
          id: doc.id,
          ...doc.data(),
        };
        currentAppointments.push(appointment);
      });

      displayAppointments(currentAppointments);
    })
    .catch((error) => {
      console.error("Error loading appointments: ", error);
      loadingIndicator.classList.add("hidden");
      noAppointments.classList.remove("hidden");
      noAppointments.innerHTML = `<p>Error loading appointments: ${error.message}</p>`;
    });
}

// Display appointments in the table
function displayAppointments(appointments) {
  appointmentsTableBody.innerHTML = "";

  if (appointments.length === 0) {
    noAppointments.classList.remove("hidden");
    return;
  }

  noAppointments.classList.add("hidden");

  appointments.forEach((appointment) => {
    const row = document.createElement("tr");

    // Format date
    const appointmentDate = appointment.appointmentDate
      ? new Date(appointment.appointmentDate)
      : new Date();
    const formattedDate = appointmentDate.toLocaleDateString();

    // Default status if not set
    const status = appointment.status || "pending";

    row.innerHTML = `
            <td>${appointment.fullName || "N/A"}</td>
            <td>
                ${appointment.email || "N/A"}<br>
                ${appointment.phone || "N/A"}
            </td>
            <td>
                ${appointment.carMake || "N/A"} ${
      appointment.carModel || ""
    }<br>
                Year: ${appointment.carYear || "N/A"}
            </td>
            <td>${appointment.serviceType || "N/A"}</td>
            <td>
                ${formattedDate}<br>
                ${appointment.appointmentTime || "N/A"}
            </td>
            <td><span class="status-badge status-${status}">${
      status.charAt(0).toUpperCase() + status.slice(1)
    }</span></td>
            <td>
                <button class="action-btn view-btn" data-id="${appointment.id}">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        `;

    appointmentsTableBody.appendChild(row);
  });

  // Add event listeners to view buttons
  document.querySelectorAll(".view-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const appointmentId = button.getAttribute("data-id");
      openAppointmentDetails(appointmentId);
    });
  });
}

// Filter appointments
function filterAppointments() {
  const statusValue = statusFilter.value;
  const dateValue = dateFilter.value;

  let filtered = [...currentAppointments];

  // Filter by status
  if (statusValue && statusValue !== "all") {
    filtered = filtered.filter(
      (appointment) => (appointment.status || "pending") === statusValue
    );
  }

  // Filter by date
  if (dateValue) {
    const filterDate = new Date(dateValue);
    filtered = filtered.filter((appointment) => {
      if (!appointment.appointmentDate) return false;
      const appointmentDate = new Date(appointment.appointmentDate);
      return appointmentDate.toDateString() === filterDate.toDateString();
    });
  }

  displayAppointments(filtered);
}

// Clear filters
clearFiltersBtn.addEventListener("click", () => {
  statusFilter.value = "all";
  dateFilter.value = "";
  displayAppointments(currentAppointments);
});

// Filter change event listeners
statusFilter.addEventListener("change", filterAppointments);
dateFilter.addEventListener("change", filterAppointments);

// Open appointment details modal
function openAppointmentDetails(appointmentId) {
  const appointment = currentAppointments.find((a) => a.id === appointmentId);
  if (!appointment) return;

  selectedAppointmentId = appointmentId;

  // Format date
  const appointmentDate = appointment.appointmentDate
    ? new Date(appointment.appointmentDate)
    : new Date();
  const formattedDate = appointmentDate.toLocaleDateString();

  // Default status
  const status = appointment.status || "pending";

  // Build details HTML
  let detailsHTML = `
        <div class="appointment-detail-row">
            <div class="detail-label">Status:</div>
            <div class="detail-value"><span class="status-badge status-${status}">${
    status.charAt(0).toUpperCase() + status.slice(1)
  }</span></div>
        </div>
        <div class="appointment-detail-row">
            <div class="detail-label">Customer Name:</div>
            <div class="detail-value">${appointment.fullName || "N/A"}</div>
        </div>
        <div class="appointment-detail-row">
            <div class="detail-label">Email:</div>
            <div class="detail-value">${appointment.email || "N/A"}</div>
        </div>
        <div class="appointment-detail-row">
            <div class="detail-label">Phone:</div>
            <div class="detail-value">${appointment.phone || "N/A"}</div>
        </div>
        <div class="appointment-detail-row">
            <div class="detail-label">Vehicle:</div>
            <div class="detail-value">${appointment.carMake || "N/A"} ${
    appointment.carModel || ""
  } (${appointment.carYear || "N/A"})</div>
        </div>
        <div class="appointment-detail-row">
            <div class="detail-label">Service Type:</div>
            <div class="detail-value">${appointment.serviceType || "N/A"}</div>
        </div>
        <div class="appointment-detail-row">
            <div class="detail-label">Appointment Date:</div>
            <div class="detail-value">${formattedDate}</div>
        </div>
        <div class="appointment-detail-row">
            <div class="detail-label">Appointment Time:</div>
            <div class="detail-value">${
              appointment.appointmentTime || "N/A"
            }</div>
        </div>
    `;

  if (appointment.additionalInfo) {
    detailsHTML += `
            <div class="appointment-detail-row">
                <div class="detail-label">Additional Information:</div>
                <div class="detail-value">${appointment.additionalInfo}</div>
            </div>
        `;
  }

  // Add created at timestamp if available
  if (appointment.createdAt) {
    const createdDate = new Date(appointment.createdAt.toDate());
    detailsHTML += `
            <div class="appointment-detail-row">
                <div class="detail-label">Submitted On:</div>
                <div class="detail-value">${createdDate.toLocaleString()}</div>
            </div>
        `;
  }

  appointmentDetails.innerHTML = detailsHTML;

  // In the openAppointmentDetails function, replace the individual button visibility settings with:
  // Show/hide action buttons based on current status
  updateActionButtonsVisibility(status);

  // Show modal
  appointmentModal.style.display = "block";

  // Add this line to enable status editing
  enableStatusEditing();
}

// Close modal
closeModalBtn.addEventListener("click", () => {
  appointmentModal.style.display = "none";
  selectedAppointmentId = null;
});

// Close modal when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === appointmentModal) {
    appointmentModal.style.display = "none";
    selectedAppointmentId = null;
  }
});

// Update appointment status
function updateAppointmentStatus(status) {
  if (!selectedAppointmentId) return;

  db.collection("appointments")
    .doc(selectedAppointmentId)
    .update({
      status: status,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      // Close modal
      appointmentModal.style.display = "none";
      selectedAppointmentId = null;

      // Reload appointments
      loadAppointments();
    })
    .catch((error) => {
      console.error("Error updating appointment: ", error);
      alert(`Error updating appointment: ${error.message}`);
    });
}

// Action button event listeners
confirmAppointmentBtn.addEventListener("click", () =>
  updateAppointmentStatus("confirmed")
);
completeAppointmentBtn.addEventListener("click", () =>
  updateAppointmentStatus("completed")
);
cancelAppointmentBtn.addEventListener("click", () =>
  updateAppointmentStatus("cancelled")
);

// Add this with your other action button event listeners
const fakeAppointmentBtn = document.getElementById("fakeAppointment");
fakeAppointmentBtn.addEventListener("click", () => updateAppointmentStatus("fake"));

// Update the updateActionButtonsVisibility function to hide fake button for completed status
function updateActionButtonsVisibility(status) {
  const confirmBtn = document.getElementById("confirmAppointment");
  const completeBtn = document.getElementById("completeAppointment");
  const cancelBtn = document.getElementById("cancelAppointment");
  const fakeBtn = document.getElementById("fakeAppointment");

  if (confirmBtn)
    confirmBtn.style.display = status === "pending" ? "block" : "none";
  if (completeBtn)
    completeBtn.style.display = status === "confirmed" ? "block" : "none";
  if (cancelBtn)
    cancelBtn.style.display = ["pending", "confirmed"].includes(status)
      ? "block"
      : "none";
  if (fakeBtn)
    fakeBtn.style.display = ["pending", "confirmed", "cancelled"].includes(status) && 
                           !["fake", "completed"].includes(status)
      ? "block"
      : "none";
}

// Function to enable editing appointment status
function enableStatusEditing() {
  if (!selectedAppointmentId) return;

  // Get the current appointment
  const appointment = currentAppointments.find(
    (a) => a.id === selectedAppointmentId
  );
  if (!appointment) return;

  // Create status selection dropdown
  const currentStatus = appointment.status || "pending";
  const statusOptions = `
    <div class="edit-status-container">
      <label for="statusSelect">Change Status:</label>
      <select id="statusSelect">
        <option value="pending" ${
          currentStatus === "pending" ? "selected" : ""
        }>Pending</option>
        <option value="confirmed" ${
          currentStatus === "confirmed" ? "selected" : ""
        }>Confirmed</option>
        <option value="completed" ${
          currentStatus === "completed" ? "selected" : ""
        }>Completed</option>
        <option value="cancelled" ${
          currentStatus === "cancelled" ? "selected" : ""
        }>Cancelled</option>
        <option value="fake" ${
          currentStatus === "fake" ? "selected" : ""
        }>Fake/Duplicate</option>
      </select>
      <button id="updateStatusBtn" class="action-btn edit">Update Status</button>
    </div>
  `;

  // Add the dropdown to the modal
  const editStatusContainer = document.createElement("div");
  editStatusContainer.classList.add("edit-status-section");
  editStatusContainer.innerHTML = statusOptions;

  // Check if edit section already exists
  const existingEditSection = document.querySelector(".edit-status-section");
  if (existingEditSection) {
    existingEditSection.remove();
  }

  // Add the edit section to the modal
  document
    .querySelector("#appointmentDetails")
    .insertAdjacentElement("afterend", editStatusContainer);

  // Add event listener to update button
  // In the enableStatusEditing function, replace renderAppointments() with displayAppointments(currentAppointments)
  document.getElementById("updateStatusBtn").addEventListener("click", () => {
    const newStatus = document.getElementById("statusSelect").value;

    // Update the status in Firestore
    db.collection("appointments")
      .doc(selectedAppointmentId)
      .update({
        status: newStatus,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        // Show success message
        const successMessage = document.createElement("div");
        successMessage.classList.add("status-update-message");
        successMessage.textContent = `Status updated to ${newStatus} successfully!`;
        editStatusContainer.appendChild(successMessage);

        // Remove message after 3 seconds
        setTimeout(() => {
          if (successMessage.parentNode) {
            successMessage.parentNode.removeChild(successMessage);
          }
        }, 3000);

        // Update the status badge in the modal
        const statusBadge = document.querySelector(
          "#appointmentDetails .status-badge"
        );
        if (statusBadge) {
          statusBadge.className = `status-badge status-${newStatus}`;
          statusBadge.textContent =
            newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
        }

        // Update the appointment in the current list
        const appointmentIndex = currentAppointments.findIndex(
          (a) => a.id === selectedAppointmentId
        );
        if (appointmentIndex !== -1) {
          currentAppointments[appointmentIndex].status = newStatus;

          // Replace renderAppointments() with displayAppointments(currentAppointments)
          displayAppointments(currentAppointments);
        }

        // Update action buttons visibility
        updateActionButtonsVisibility(newStatus);
      })
      .catch((error) => {
        console.error("Error updating status: ", error);
        alert(`Error updating status: ${error.message}`);
      });
  });
}
