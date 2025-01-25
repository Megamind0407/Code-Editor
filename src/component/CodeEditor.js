import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { dracula } from "@uiw/codemirror-theme-dracula";
import axios from "axios";
import "./CodeEditor.css"; // Import CSS for styling

const CodeEditor = () => {
    const [code, setCode] = useState("// Write your code here...");
    const [language, setLanguage] = useState("javascript");
    const [output, setOutput] = useState("");

    // Language options mapping
    const languageExtensions = {
        javascript: javascript(),
        python: python(),
        css: css(),
        html: html(),
        java: java(),
        cpp: cpp(),
    };

    // Function to run the code
    const runCode = async () => {
        if (language === "javascript") {
            try {
                // eslint-disable-next-line no-eval
                const result = eval(code); // Execute JavaScript code in the browser
                setOutput(String(result));
            } catch (error) {
                setOutput(error.toString());
            }
        } else {
            try {
                const response = await axios.post("http://localhost:5000/run", { code, language });
                setOutput(response.data.output);
            } catch (error) {
                setOutput("Error running code");
            }
        }
    };

    return (
        <div className="editor-container">
            <h2 className="editor-title">Multi-Language Code Editor</h2>

            {/* Language Selector */}
            <select
                onChange={(e) => setLanguage(e.target.value)}
                value={language}
                className="language-selector"
            >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="css">CSS</option>
                <option value="html">HTML</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
            </select>

            {/* Code Editor */}
            <CodeMirror
                value={code}
                height="400px"
                theme={dracula}
                extensions={[languageExtensions[language]]}
                onChange={(value) => setCode(value)}
                className="code-mirror"
            />

            {/* Run Button */}
            <button className="run-button" onClick={runCode}>
                Run Code
            </button>

            {/* Output Section */}
            <div className="output-section">
                <h3>Output:</h3>
                <pre>{output}</pre>
            </div>
        </div>
    );
};

export default CodeEditor;
