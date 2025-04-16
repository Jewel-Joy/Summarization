import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  FileText,
  Settings,
  Scissors,
  RefreshCw,
  Loader2,
  Clipboard,
  Check
} from "lucide-react";
import "./App.css";

const genAI = new GoogleGenerativeAI("AIzaSyD8DU61IZZAqAMAam028Cljnh7Duz-sX8s");

function App() {
  const [inputText, setInputText] = useState("");
  const [requirements, setRequirements] = useState("Summarize in 100 words");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!inputText) {
      alert("Please enter text to summarize");
      return;
    }

    setLoading(true);
    setSummary("");

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const prompt = `Summarize the following text in about ${requirements}. Text: ${inputText}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      setSummary(text);
    } catch (error) {
      console.error("Error summarizing:", error);
      setSummary("Error while summarizing. Please try again.");
    }

    setLoading(false);
  };

  const clearFields = () => {
    setInputText("");
    setSummary("");
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="app-container">
      <div className="main-card">
        <div className="header">
          <FileText className="header-icon" />
          <h1>Text Summarization Tool</h1>
        </div>

        <div className="content">
          <div className="input-section">
            <label>
              Paste your text:
              <textarea
                rows={8}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your text here..."
              />
            </label>
          </div>

          <div className="requirements-section">
            <label>
              <div className="requirements-label">
                <Settings className="icon" />
                Summary requirements:
              </div>
              <input
                type="text"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="e.g., Summarize in 100 words"
              />
            </label>
          </div>

          <div className="action-buttons">
            <button
              onClick={handleSummarize}
              disabled={loading || !inputText}
              className="primary-button"
            >
              {loading ? (
                <>
                  <Loader2 className="spinner" />
                  Summarizing...
                </>
              ) : (
                <>
                  <Scissors className="icon" />
                  Generate Summary
                </>
              )}
            </button>
            
            <button
              onClick={clearFields}
              className="secondary-button"
            >
              <RefreshCw className="icon" />
              Clear
            </button>
          </div>

          {summary && (
            <div className="summary-section">
              <div className="summary-header">
                <h2>
                  <Scissors className="icon" />
                  Summary
                </h2>
                <button onClick={copyToClipboard} className="copy-button">
                  {copied ? <Check className="icon" /> : <Clipboard className="icon" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="summary-output">
                {summary}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
