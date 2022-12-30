const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

// Middlewares
app.use(cors())
app.use(morgan('dev'))

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

app.get('/', (req, res, next) => {
    res.send('Hello world')
})