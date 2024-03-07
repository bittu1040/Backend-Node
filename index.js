const express = require("express");
const users = require('./MOCK_DATA.json')
const app = express();
const port = 8000;
const fs = require('fs')
const mongoose = require('mongoose');






// mongodb connection
mongoose.connect('mongodb://127.0.0.1:27017/firstDB').then(() => {
    console.log("mongodb connected");
}).catch((err) => {
    console.log("mongodb error", err);
})


const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    job_title: {
        type: String,
    },
    gender: {
        type: String,
    }
   },
   { timestamps: true })

const User = mongoose.model('user', userSchema)



/* ---------------- middleware - plugin------------------- */
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
    // console.log("Hello from middleware");
    fs.appendFile("log.txt", `\n${new Date().toLocaleString()}: ${req.ip} ${req.method} ${req.path}`, (err, data) => {
        next();
    })
})


/* ------------------------ routes --------------------------- */




app.get("/users",  async (req, res) => {
    const allDBUsers= await User.find({});

    // uncomment this once you need html as response and you hit api in browser, not in postman
    const html = `
    <ul>
        ${allDBUsers.map(user => `<li>${user.first_name} ${user.last_name}</li>`).join('')}
    </ul>
    `
    res.send(html)

    // in postman hit:
    // return res.json(allDBUsers)
})

/*------------------ api to create user--------------- */
app.post("/api/users", async (req, res) => {
    const user = req.body;
    if (!user.first_name || !user.last_name || !user.email) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const result = await User.create({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            job_title: user.job_title,
            gender: user.gender
        });
        console.log("result", result);
        return res.status(201).json({ message: "User created" });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).send('Server Error');
    }
})





app.listen(port, function () {
    console.log(`Server is running on port: ${port}`);
})