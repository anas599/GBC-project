import React, { useState, useEffect } from "react";

const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [voices, setVoices] = useState([]);

  const cheerfulMemories = [
    "Remember the time you danced at Lily’s wedding? You were the star of the night!",
    "Your grandkids still talk about your blueberry pancakes every weekend.",
    "That road trip to Niagara Falls — the pictures are still on the fridge!",
    "Everyone still remembers your Christmas stories by the fireplace.",
    "You taught Emma how to ride a bike — she says she’ll never forget it!",
    "Your garden is blooming beautifully this spring, just like you love it!",
    "The family picnic last summer was a blast! Everyone loved your famous potato salad.",
  ];
  const upComingEvents = [
    "Your 50th wedding anniversary is coming up next month! Planning a big family gathering?",
    "Your granddaughter’s graduation is in two weeks! She’s so excited to see you there.",
    "The family reunion is just around the corner! Everyone can’t wait to see you.",
    "Your birthday is next month! The kids are planning a surprise party for you.",
    "The garden club meeting is this Saturday. They’re excited to see your new flowers!",
    "Your favorite TV show is back next week! Can’t wait to watch it with you.",
  ];

  useEffect(() => {
    const synth = window.speechSynthesis;
    const loadVoices = () => {
      const loadedVoices = synth.getVoices();
      setVoices(loadedVoices);
    };
    loadVoices();
    if (
      typeof speechSynthesis !== "undefined" &&
      speechSynthesis.onvoiceschanged !== undefined
    ) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speakText = (text) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    const preferredVoice = voices.find(
      (v) => v.name.includes("Google") || v.lang === "en-US"
    );
    if (preferredVoice) utter.voice = preferredVoice;
    utter.rate = 1;
    utter.pitch = 1;
    synth.speak(utter);
  };

  const mockAIResponses = {
    greeting: "Hi there, John! How are you feeling today?",
    good: "That’s great to hear! Do you want to talk about happy memories?",
    bad: "I'm here for you. Would you like to hear something uplifting?",
    default: "Thanks for sharing. I'm always here to talk.",
  };

  // Show greeting on load and read it out loud
  useEffect(() => {
    setChatHistory([{ sender: "Ella", message: mockAIResponses.greeting }]);
    // Wait for voices to load before speaking
    if (voices.length > 0 && chatHistory.length === 0) {
      speakText(mockAIResponses.greeting);
    }
    // If voices not loaded yet, speak after they load
    // This effect depends on voices array
    // eslint-disable-next-line
  }, [voices]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    const lowerInput = userMessage.toLowerCase();
    let aiReply = mockAIResponses.default;
    let cheerUp = false;
    // Scroll to bottom after new message is added
    setTimeout(() => {
      const chatBox = document.querySelector('[style*="overflow-y: auto"]');
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }, 100);
    if (lowerInput.includes("good")) {
      aiReply = mockAIResponses.good;
    } else if (
      lowerInput.includes("sad") ||
      lowerInput.includes("depressed") ||
      lowerInput.includes("down") ||
      lowerInput.includes("lonely") ||
      lowerInput.includes("upset") ||
      lowerInput.includes("bad")
    ) {
      aiReply = mockAIResponses.bad;
      cheerUp = true;
    }

    const newHistory = [
      ...chatHistory,
      { sender: "You", message: userMessage },
      { sender: "Ella", message: aiReply },
    ];

    if (cheerUp) {
      const memory =
        cheerfulMemories[Math.floor(Math.random() * cheerfulMemories.length)];
      newHistory.push({ sender: "Ella", message: memory });
      speakText(aiReply + " " + memory);
    } else {
      speakText(aiReply);
    }

    setChatHistory(newHistory);
    setInput("");
  };

  const handleCheerUp = () => {
    const memory =
      cheerfulMemories[Math.floor(Math.random() * cheerfulMemories.length)];
    const newHistory = [...chatHistory, { sender: "Ella", message: memory }];
    setChatHistory(newHistory);
    speakText(memory);
  };
  const handelUpcomingEvents = () => {
    const event =
      upComingEvents[Math.floor(Math.random() * upComingEvents.length)];
    const newHistory = [...chatHistory, { sender: "Ella", message: event }];
    setChatHistory(newHistory);
    speakText(event);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Ella – Your AI Companion</h2>
      <div style={styles.chatBox}>
        {chatHistory.map((entry, index) => (
          <div
            key={index}
            style={entry.sender === "You" ? styles.userBubble : styles.aiBubble}
          >
            <strong>{entry.sender}:</strong> {entry.message}
            {entry.sender === "Ella" && (
              <button
                style={styles.speakBtn}
                onClick={() => speakText(entry.message)}
              >
                🔊 Read Again
              </button>
            )}
          </div>
        ))}
      </div>
      <button onClick={handleCheerUp} style={styles.cheerBtn}>
        🌞 Cheer Me Up
      </button>
      <button onClick={handelUpcomingEvents} style={styles.cheerBtn}>
        📅 Upcoming Events
      </button>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          style={styles.input}
          type="text"
          value={input}
          placeholder="Say something..."
          onChange={(e) => setInput(e.target.value)}
        />
        <button style={styles.button} type="submit">
          Send
        </button>
      </form>
    </div>
  );
};
// Responsive styles for mobile views
const mobileStyles = `
@media (max-width: 600px) {
  .ella-container {
    max-width: 98vw !important;
    padding: 8px !important;
    border-radius: 0 !important;
  }
  .ella-title {
    font-size: 1.2rem !important;
  }
  .ella-chatbox {
    height: 45vw !important;
    min-height: 180px !important;
    font-size: 15px !important;
    padding: 4px !important;
  }
  .ella-user-bubble, .ella-ai-bubble {
    font-size: 15px !important;
    padding: 8px !important;
    margin: 3px 0 !important;
  }
  .ella-speak-btn {
    font-size: 15px !important;
    width: 7rem !important;
    min-width: 7rem !important;
    max-width: 7rem !important;
    padding: 6px 0 !important;
  }
  .ella-cheer-btn {
    font-size: 13px !important;
    padding: 8px 8px !important;
  }
  .ella-input {
    font-size: 15px !important;
    padding: 8px !important;
  }
  .ella-button {
    font-size: 15px !important;
    padding: 8px 8px !important;
  }
}
`;

// Inject responsive styles into the document head
if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (!document.getElementById("ella-mobile-styles")) {
    const styleTag = document.createElement("style");
    styleTag.id = "ella-mobile-styles";
    styleTag.innerHTML = mobileStyles;
    document.head.appendChild(styleTag);
  }
}

// Add classNames to main elements for targeting
// (You must update the JSX to add these classNames)
const styles = {
  container: {
    maxWidth: "500px",
    margin: "20px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    border: "2px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
  },
  title: {
    textAlign: "center",
  },
  chatBox: {
    height: "300px",
    overflowY: "auto",
    marginBottom: "15px",
    padding: "10px",
    background: "#fff",
    borderRadius: "6px",
    border: "1px solid #ddd",
  },
  userBubble: {
    background: "#daf1da",
    padding: "10px",
    borderRadius: "10px",
    margin: "5px 0",
  },
  aiBubble: {
    display: "flex",
    flexDirection: "row",
    background: "#e4e4f5",
    padding: "10px",
    borderRadius: "10px",
    margin: "5px 0",
    alignItems: "flex-start",
    justifyContent: "space-between",
    fontSize: "20px",
    minHeight: "48px",
  },
  speakBtn: {
    width: "10rem",
    minWidth: "10rem",
    maxWidth: "10rem",
    margin: "2px 0px 2px 16px",
    padding: "8px 0px",
    fontSize: "18px",
    background: "rgb(108, 99, 255)",
    color: "rgb(255, 255, 255)",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    letterSpacing: "1px",
    boxShadow: "0 2px 8px rgba(108,99,255,0.08)",
    transition: "background 0.2s",
    alignSelf: "flex-start",
    flexShrink: 0,
  },
  cheerBtn: {
    margin: "10px 2px",
    padding: "10px 16px",
    backgroundColor: "#ffcc66",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "16px",
  },
  button: {
    padding: "10px 16px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Chatbot;
