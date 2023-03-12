import express from "express";
import {fileURLToPath} from "url";
import path from "path";
import hbs from "hbs"
import fs from "node:fs";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

hbs.registerPartials(__dirname + '/views/partials')
app.set("view engine", "hbs");
hbs.registerHelper("getCurrentYear", ()=>{
    return new Date().getFullYear();
});
hbs.registerHelper("screamIt", (text)=>{
    return text.toUpperCase();
})

app.use((req, res, next)=>{
    const now = new Date().toString();
    const log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile("server.log", log + "\n", (err)=>{
        if(err){
            console.log("Unable to append server.log")
        }
    })
    next();
})

app.use((req, res, next)=>{
    res.render("maintenance.hbs");
    
})

app.use(express.static(__dirname + "/public"));


app.get("/", (req, res)=>{
    res.render("home.hbs", {
        pageTitle: "Home Page",
        welcomeMessage: "Welcome to my website",
        
    })
});

app.get("/about", (req, res)=>{
    res.render("about.hbs", {
        pageTitle: "About Page",
        
    });
});

app.get("/bad", (req, res)=>{
    res.send({
        errorMessage: "Unable to handle request"
    });
});

app.listen(3000, ()=>{
    console.log("The server is up on port 3000");
})