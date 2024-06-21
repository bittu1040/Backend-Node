const express = require("express");
const users = require('./MOCK_DATA.json')
const app = express();
const port = 8000;
const fs = require('fs')
const mongoose = require('mongoose');

// bittu1040
// cnSDoVH5TlTSnPap



// mongodb connection
// mongoose.connect('mongodb://127.0.0.1:27017/firstDB').then(() => {
    mongoose.connect('mongodb+srv://bittu1040:cnSDoVH5TlTSnPap@test-node.ex0ov2a.mongodb.net/?retryWrites=true&w=majority&appName=test-node').then(() => {
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
    fs.appendFile("log.txt", `\n${new Date().toLocaleString()}: ${req.ip} ${req.method} ${req.path}`, (err, data) => {
        next();
    })
})


/* ------------------------ routes --------------------------- */

app.get("/", (req, res)=>{
    res.json({message: "hello from express"})
})


/*------------------ api to get all user--------------- */
app.get("/users",  async (req, res) => {
    const allDBUsers= await User.find({});
    return res.json(allDBUsers)
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

app.get('/get_image_info', (req, res) => {
    // Example image path and description
    const imagesInfo = [
        {
            image_path: 'https://i.postimg.cc/wTDQxChr/carbon-1.png',
            description: 'A beautiful sunset over the mountains.'
        },
        {
            image_path: 'https://i.postimg.cc/wTDQxChr/carbon-1.png',
            description: 'A serene forest with tall trees.'
        },
        {
            image_path: 'https://i.postimg.cc/wTDQxChr/carbon-1.png',
            description: 'A tranquil beach with golden sands.'
        }
    ];
    res.json(imagesInfo);
});





app.listen(port, function () {
    console.log(`Server is running on port: ${port}`);
})