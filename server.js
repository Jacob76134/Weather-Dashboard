const express = require('express')
const axios = require('axios')
const app = express()
const PORT = process.env.PORT || 3001
require('dotenv').config();

const apiKey = process.env.API_KEY;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname,'index.html'))
})


var resData = {
    lat: 0,
    lon: 0,
    current: {},
    forecast: [],
};


app.get('/api', (req, res) => {

    let query = req.query.q;

    urlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&Appid=" + apiKey + "&units=imperial";

    axios.get(urlCurrent).then(response => {

            // If we get status 200
            if(response.data.cod === 200){

                resData.lat = response.data.coord.lat;
                resData.lon = response.data.coord.lon;
                resData.current = response.data;

                urlForecast = "https://api.openweathermap.org/data/2.5/onecall?lat=" + resData.lat + "&lon=" + resData.lon + "&Appid=" + apiKey + "&exclude=minutely,hourly&units=imperial";

                axios.get(urlForecast).then(data => {
                
                    for (let i = 0; i < 5; i++) {
                        resData.forecast.push(data.data.daily[i]);
                    }

                    res.send(resData);

                })
            }else{
                res.sendStatus(response.data.cod);
            }
        })
});


app.listen(process.env.PORT || 3001, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
