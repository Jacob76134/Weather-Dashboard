const express = require('express')
const app = express()
const PORT = process.env.PORT || 3001
require('dotenv').config();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'index.html'))
})


app.listen(process.env.PORT || 3001, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
