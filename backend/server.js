const express = require('express')
const app = express()
const UserRoutes = require('./Routes/UserRoutes')
const db = require('./dbconfig/dbconfig')
app.use(express.json())
app.use('/', UserRoutes)

app.get('/', (req, res) => {
    console.log("Hello from backend")
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})