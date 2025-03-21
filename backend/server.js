const express = require('express')
const app = express()
const UserRoutes = require('./Routes/UserRoutes')
const WatchlistRoutes = require('./Routes/WatchlistRoutes')
const db = require('./dbconfig/dbconfig');
// const cors = require('cors')
const HoldingRoutes = require('./Routes/HoldingRoutes');

// app.use(cors())
app.use(express.json())
app.use('/', UserRoutes)
app.use('/stocks',WatchlistRoutes);
app.use('/holding', HoldingRoutes);
app.get('/', (req, res) => {
    console.log("Hello from backend")
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})