const express = require('express')
const app = express()
const PORT = 3000
require('dotenv').config();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'index.html'))
})


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
