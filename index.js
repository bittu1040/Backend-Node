const express=require("express");
const users= require('./MOCK_DATA.json')
const app=express();
const port=8000;
const fs= require('fs')















// middleware - plugin
app.use(express.urlencoded({extended:false}))

app.use((req,res,next)=>{
    // console.log("Hello from middleware");
    fs.appendFile("log.txt", `\n${Date.now()}: ${req.ip} ${req.method} ${req.path}`, (err, data)=>{
        next();
    })
})

// routes

app.get("/users", (req,res)=>{
    const html= `
    <ul>
        ${users.map(user=>`<li>${user.first_name} ${user.last_name}</li>`).join('')}
    </ul>
    `
    res.send(html)
})


app.get("/api/users",(req,res)=>{
    return res.json(users);
})

app.get("/api/users/:id",(req,res)=>{
    const id=parseInt(req.params.id);
    const user=users.find(user=>user.id===id);
    return res.json(user);
})


app.listen(port, function(){
    console.log(`Server is running on port: ${port}`);
})