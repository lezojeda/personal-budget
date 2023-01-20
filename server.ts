import dotenv from 'dotenv'
dotenv.config()

import cors from 'cors'
import express, { Request, Response} from 'express'
import morgan from 'morgan'
import pool from './db'

const app = express()

// Middlewares
app.use(cors())
app.use(morgan('dev'))

const PORT = process.env.PORT || 3000;

app.get('/', async (req: Request, res: Response) => {
    pool.query('SELECT * FROM test;', (err, results) => {
        if (err) {
            res.send(err)
        } else {
            res.json(results.rows)
        }
    })
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})