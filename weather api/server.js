const express = require("express");
require("dotenv").config();
const app = express();
app.use(express.json());

async function getWeather(req,res){
    const city = req.query.city;
    if(!city || city.trim() === ""){
        return res.status(400).json({
            message: "City is required"
        })
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}`;
    try{
        const response = await fetch(url);
        if(!response.ok){
            const errorData = await response.json();
            return res.status(response.status).json({
                message: errorData.message
            })
        }
        const data = await response.json();
        const celsius = Number((data.main.temp - 273.15).toFixed(2));
        const mdata = {city: req.query.city,
            temperature: celsius,
            weather: data.weather[0].main,
            description: data.weather[0].description
        }
        return res.json(mdata);
    }catch(error){
        return res.status(500).json({
            message: "Unable to fetch weather data"
        });
    }

}
app.get("/api/weather",getWeather);

app.listen(3000,()=>{
    console.log("PORT 3000 listening");
})