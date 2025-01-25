const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/run", (req, res) => {
    const { code, language } = req.body;

    let fileName;
    let command;

    if (language === "python") {
        fileName = "script.py";
        fs.writeFileSync(fileName, code);
        command = `python3 ${fileName}`;
    } else if (language === "cpp") {
        fileName = "program.cpp";
        fs.writeFileSync(fileName, code);
        command = `g++ ${fileName} -o program && ./program`;
    } else if (language === "java") {
        fileName = "Main.java";
        fs.writeFileSync(fileName, code);
        command = `javac Main.java && java Main`;
    } else {
        return res.json({ output: "Unsupported Language" });
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            res.json({ output: stderr || error.toString() });
        } else {
            res.json({ output: stdout });
        }
    });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
