const express = require('express')
const mongoose = require('mongoose')
const cors=require("cors")

require('dotenv').config()

const app = express()
app.use(express.json());
app.use(cors())

const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.port || 8000

// app.use('/api',busRoutes.routes)
const routes=require('./routes/bus_router')
app.use(routes)

app.listen(PORT,()=>{
    console.log(`Listening on : ${PORT}`)
})







