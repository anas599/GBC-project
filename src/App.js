import React from "react";
import "./App.css";
import Chatbot from "./components/Chatbot";

function App() {
  return (
    <div className="App flex justify-center items-center min-h-screen bg-gray-200">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Ella: Your AI Companion</h2>
        <Chatbot />
      </div>
    </div>
  );
}

export default App;
