import cors from 'cors'
import express, { Request, Response, NextFunction} from 'express'
import morgan from 'morgan'

const app = express()

// Middlewares
app.use(cors())
app.use(morgan('dev'))

const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello world')
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})