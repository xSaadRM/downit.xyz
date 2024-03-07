function submitForm(event) {
  event.preventDefault();

  // Get form values
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var message = document.getElementById("message").value;

  // Validate form data (you can add more validation as needed)
  if (!name || !email || !message) {
    alert("Please fill in all fields.");
    return;
  }

  // Display submitted information
  alert(
    "Submitted information:\nName: " +
      name +
      "\nEmail: " +
      email +
      "\nMessage: " +
      message
  );

  // You can send the form data to a server for further processing if needed

  // Reset the form
  document.getElementById("contactForm").reset();
}
