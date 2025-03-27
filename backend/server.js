const express = require('express')
const app = express()
const UserRoutes = require('./Routes/UserRoutes')
const WatchlistRoutes = require('./Routes/WatchlistRoutes')
require('dotenv').config();
const db = require('./dbconfig/dbconfig');
const HoldingRoutes = require('./Routes/HoldingRoutes');
const ExchangeRoutes = require('./Routes/ExchangeRoutes');
app.use(express.json())
app.use('/', UserRoutes)
app.use('/stocks',WatchlistRoutes);
app.use('/holding', HoldingRoutes);
app.use('/exchange', ExchangeRoutes);
const port=process.env.PORT;
app.get('/', (req, res) => {
    return res.json( {success:true,message:"Hello from backend"})
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})