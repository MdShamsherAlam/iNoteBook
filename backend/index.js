const connectToMongo=require('./db');
connectToMongo();
var cors = require('cors')
const express = require('express')
const port = 5000 

var app = express()

app.use(cors())

app.use(express.json())
app.post('/', (req, res) => {
  res.send('Hello Shamsher!')
})

//Available Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
// const express=require('express')
// const app=express()
// const port=5000
// app.use(express.json())
// app.get('/',(req,res)=>{

// res.send('HelloWorld')

// })