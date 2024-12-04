// Select DOM elements
const sendMessageButton = document.querySelector(".chat-input span");
const chatInput = document.querySelector(".chat-input textarea");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");

let userMessage;

// Function to format text for better readability
const formatText = (text) => {
  // Example of basic formatting: capitalize the first letter and trim whitespace
  return text.charAt(0).toUpperCase() + text.slice(1).trim();
};

// Create chat list item function
const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  if (className === "incoming") {
    chatLi.innerHTML = `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
  } else {
    chatLi.innerHTML = `<p>${message}</p>`;
  }
  return chatLi;
};

// Generate response from server
const generateResponse = async (chatLi) => {
  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) throw new Error('Server error');
    const data = await response.json();
    const formattedReply = formatText(data.reply); // Format the reply
    chatLi.innerHTML = `<span class="material-symbols-outlined">smart_toy</span><p>${formattedReply}</p>`;
  } catch (error) {
    console.error("Error generating response:", error);
    chatLi.innerHTML = `<span class="material-symbols-outlined">error</span><p>Sorry, there was an error processing your message.</p>`;
  }
};

// Handle chat input function
const handleChat = () => {
  userMessage = chatInput.value;
  if (!userMessage) return;

  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatInput.value = "";

  // Display "THINKING..." message
  const thinkingLi = createChatLi("THINKING...", "incoming");
  chatbox.appendChild(thinkingLi);

  // Generate and display response
  generateResponse(thinkingLi);
};

// Event listeners
sendMessageButton.addEventListener("click", handleChat);
chatbotToggler.addEventListener("click", () => {
  document.body.classList.toggle("show-chatbot");
});