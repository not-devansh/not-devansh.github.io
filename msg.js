const ws = new WebSocket('ws://not-devansh.github.io:3000');
const messages = document.getElementById('messages');
const questionContainer = document.getElementById('question-container');
const form = document.getElementById('form');
const input = document.getElementById('input');

let userName = '';

// Open a pop-up window to ask for the user's name
window.onload = () => {
  userName = prompt('Please enter your name:');
  if (!userName) {
    userName = 'Anonymous';
  }
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = input.value.trim();
  if (message !== '') {
    ws.send(`${userName}: ${message}`);
    input.value = '';
    console.log('Sent message:', message); // Log the message to the console
    displayMessage(`${userName}: ${message}`, true); // Display the sent message with the "sent-message" class
  }
});

ws.addEventListener('message', (event) => {
  const message = event.data;
  if (message instanceof Blob) {
    // Handle Blob messages
    console.log('', message);
    readBlobAsText(message, (text) => {
      displayMessage('' + text, false); // Display the Blob as text
    });
  } else {
    // Handle regular text messages
    console.log('Received message:', message); // Log the received message to the console
    displayMessage(message, false); // Display the received message with the "received-message" class
  }
});

function displayMessage(message, isSent) {
  const li = document.createElement('li');
  li.textContent = message;
  if (isSent) {
    li.classList.add('sent-message'); // Add a class for sent messages
  } else {
    li.classList.add('received-message'); // Add a class for received messages
  }
  messages.appendChild(li);
}

function readBlobAsText(blob, callback) {
  const reader = new FileReader();
  reader.onload = function(event) {
    const text = event.target.result;
    callback(text);
  };
  reader.readAsText(blob);
}

ws.addEventListener('open', () => {
  console.log('WebSocket connection opened');
});

ws.addEventListener('close', () => {
  console.log('WebSocket connection closed');
});

ws.addEventListener('error', (error) => {
  console.error('WebSocket error:', error);
});
// Add this function to scroll the chat container to the bottom
function scrollChatToBottom() {
  const chatContainer = document.getElementById('message-container');
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Modify the displayMessage function to scroll the chat container after adding a new message
function displayMessage(message, isSent) {
  const li = document.createElement('li');
  li.textContent = message;
  if (isSent) {
    li.classList.add('sent-message');
  } else {
    li.classList.add('received-message');
  }
  messages.appendChild(li);
  scrollChatToBottom(); // Scroll to the bottom after adding the message
}// Function to display text with typewriter effect

function fetchAndDisplayQuestion(url) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      questionContainer.textContent = data.question; // Update the question-container with the received question
    })
    .catch(error => {
      console.error('Error fetching question:', error);
      // Display a user-friendly error message in the UI
      questionContainer.textContent = 'Error fetching question. Please try again later.';
    });
}


// Event listeners for both buttons to fetch and display the question
document.getElementById('truthButton').addEventListener('click', () => {
  fetchAndDisplayQuestion('https://api.truthordarebot.xyz/v1/truth');
});

document.getElementById('situationButton').addEventListener('click', () => {
  fetchAndDisplayQuestion('https://api.truthordarebot.xyz/api/wyr');
});

// WebSocket event listeners
ws.addEventListener('message', (event) => {
  const message = event.data;
  // Assuming the message contains the URL of the question API
  fetchAndDisplayQuestion(message);
});

ws.addEventListener('open', () => {
  console.log('WebSocket connection opened');
});

ws.addEventListener('close', () => {
  console.log('WebSocket connection closed');
});

ws.addEventListener('error', (error) => {
  console.error('WebSocket error:', error);
});
