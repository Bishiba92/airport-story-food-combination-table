var modals = [];

function createModal(titleText, messageText, element) {
  // Create the modal elements
  var modal = document.createElement('div');
  element.modal = modal;
  var modalContent = document.createElement('div');
  modalContent.modal = modal;
  var closeSpan = document.createElement('span');
  var title = document.createElement('p');
  var message = document.createElement('p');
  var subContainer = document.createElement('div');

  // Add classes for styling
  modal.className = 'modal';
  modalContent.className = 'modal-content';
  closeSpan.className = 'close';
  title.className = 'modal-title';
  message.className = 'modal-message';
  subContainer.className = 'sub-container';

  // Add content
  closeSpan.innerHTML = '&times;';
  title.textContent = titleText;
  message.textContent = messageText;
  subContainer.appendChild(element);

  // Append elements
  modalContent.appendChild(closeSpan);
  modalContent.appendChild(title);
  modalContent.appendChild(message);
  modalContent.appendChild(subContainer);
  modal.appendChild(modalContent);
  
  // Append the modal to the modal-container
  var modalContainer = document.getElementById('modal-container');
  modalContainer.appendChild(modal);

  // Add the modal to the beginning of the modals array
  modals.unshift(modal);

  // Functionality to close the modal
  closeSpan.onclick = function() {
    closeModal(modal);
  };

  // Functionality to close the modal when clicking outside of it
  modal.onclick = function(event) {
    if (event.target == modal) {
      closeModal(modal);
    }
  };
  document.getElementById("modal-container").style.display = "contents";
}

function closeModal(modal) {
  console.log("closeModal")
  // Remove the modal from the modals array
  var index = modals.indexOf(modal);
  if (index > -1) {
    modals.splice(index, 1); // This will remove the item and ensure no empty indices are left
  }

  if (modals.length == 0)
    document.getElementById("modal-container").style.display = "none";
  // Remove the modal from the DOM
  modal.remove();
}

function closeFirstModal() {
  modals.shift();

  if (modals.length == 0)
    document.getElementById("modal-container").style.display = "none";
  // Remove the modal from the DOM
}

function createFormMessage() {
  let optionsArray = ["Subject*", "Combo", "Feedback", "Request", "Error"];
  // Create form elements
  var form = document.createElement('div');
  form.setAttribute("class", "send-message-form")
  var emailInput = document.createElement('input');
  emailInput.setAttribute("class", "email-input")
  var dropdown = document.createElement('select');
  dropdown.setAttribute("class", "dropdown-option")
  var messageInput = document.createElement('textarea');
  messageInput.setAttribute("class", "text-area")
  var submitButton = createToggleButton("Send");

  // Set attributes for the email input
  emailInput.setAttribute('type', 'email');
  emailInput.setAttribute('placeholder', 'Enter your email (optional)');
  emailInput.setAttribute('name', 'email');
  emailInput.required = true; // making the email field required

  // Set attributes for the message textarea
  messageInput.setAttribute('placeholder', 'Enter your message');
  messageInput.setAttribute('name', 'message');
  messageInput.required = true; // making the message field required

  // Populate dropdown with options
  optionsArray.forEach(function(optionText) {
    var option = document.createElement('option');
    option.value = optionText;
    option.textContent = optionText;
    dropdown.appendChild(option);
  });

  // Append elements to the form
  form.appendChild(emailInput);
  form.appendChild(dropdown);
  form.appendChild(messageInput);  
  form.appendChild(submitButton);

  // Function to handle button click
  submitButton.addEventListener('click', function() {
    var emailValue = emailInput.value;
    var messageValue = messageInput.value;
    var dropdownValue = dropdown.value;

    // Call the function that handles the form data
    handleFormData(emailValue, messageValue, dropdownValue, form);
  });
  return form;
}

// Define the function that handles the form data
function handleFormData(email, message, dropdownSelection, form) {
  if (email.length > 100) return;
  if (message.length === 0 || message.length > 1500) return;
  if (dropdownSelection === "Subject*") return;

  if (email === "") email = "Anonymous";
  let sendMessage = {
    contact: email, subject: dropdownSelection, message, 
  }
  let date = new Date();
  let random = Math.random() * 4124323;
  let fieldName = "M" + date.toISOString().replaceAll(" ", "").replaceAll("-", "").replaceAll(":", "").replaceAll(".", "") + random;
  setField("Messages", "messages", fieldName, sendMessage)
  if (form && form.modal) closeModal(form.modal)
}

function createToggleButton(buttonText = "Show Foods") {
  // Create button element
  var button = document.createElement("button");
  button.setAttribute("class", "bigButton");

  // Create span element for button text
  var span = document.createElement("span");
  span.setAttribute("id", "toggleFoodsButtonText");
  span.textContent = buttonText;

  // Create SVG element
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "-5 -5 110 110");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("aria-hidden", "true");

  // Create path element for SVG
  var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M0,0 C0,0 100,0 100,0 C100,0 100,100 100,100 C100,100 0,100 0,100 C0,100 0,0 0,0"
  );

  // Append path to SVG
  svg.appendChild(path);

  // Append span and SVG to button
  button.appendChild(span);
  button.appendChild(svg);

  // Append button to body or any other desired parent element
  return button;
}

function openSendMessageForm() {
  createModal("Send message", "Feel free to send a message to me regarding suggestions or issues with the tool. If email is provided, I may get back to you.", createFormMessage());
}