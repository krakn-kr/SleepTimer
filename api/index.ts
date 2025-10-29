import { createServer } from 'http'
import { parse } from 'url'
import express from 'express'
import { registerRoutes } from '../server/routes'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Set correct MIME types
app.use((req, res, next) => {
  if (req.url?.endsWith('.js')) {
    res.type('application/javascript')
  }
  next()
})

// Initialize Express app with routes
await registerRoutes(app)

const handler = async (req: any, res: any) => {
  try {
    const parsedUrl = parse(req.url!, true)
    await new Promise((resolve, reject) => {
      app(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result)
        }
        return resolve(result)
      })
    })
  } catch (err) {
    console.error(err)
    res.statusCode = 500
    res.end('Internal Server Error')
  }
}

export default handler