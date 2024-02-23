import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()

// middlewares
app.use(cors())
app.use(express.json())

// test api
app.get('/test', (req, res) => {
  try {
    res.status(200).json({ message: 'Hello from Express!' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// get all users
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.status(200).json(users)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// create user
app.post('/users', async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email
      }
    })
    res.status(201).json(user)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// update user
app.put('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: Number(req.params.id)
      },
      data: {
        name: req.body.name,
        email: req.body.email
      }
    })
    res.status(200).json(user)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// delete user
app.delete('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.delete({
      where: {
        id: Number(req.params.id)
      }
    })
    res.status(200).json(user)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// start server
const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`))
