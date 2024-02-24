import React, { useState, useEffect } from 'react'
import axios, { AxiosResponse } from 'axios'
import CardComponent from '@/components/CardComponent'
import exp from 'constants'

interface User {
  id: number
  name: string
  email: string
}

export default function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

  const [users, setUsers] = useState<User[]>([])
  const [newUser, setNewUser] = useState({ name: '', email: '' })
  const [updateUser, setUpdateUser] = useState({ id: '', name: '', email: '' })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: AxiosResponse<User[], any> = await axios.get(
          `${API_URL}/users`
        )
        setUsers(response.data.reverse())
      } catch (error) {
        console.error('Error fetching data: ', error)
      }
    }
    fetchData()
  }, [API_URL])

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API_URL}/users`, newUser)
      setUsers([response.data, ...users])
      setNewUser({ name: '', email: '' })
    } catch (error) {
      console.error('Error creating user: ', error)
    }
  }

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const newUser = await axios.put(`${API_URL}/users/${updateUser.id}`, {
        name: updateUser.name,
        email: updateUser.email
      })
      setUsers(
        users.map((user) => {
          if (user.id !== Number(updateUser.id)) return user
          return newUser.data
        })
      )
      setUpdateUser({ id: '', name: '', email: '' })
    } catch (error) {
      console.error('Error creating user: ', error)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    try {
      await axios.delete(`${API_URL}/users/${userId}`)
      setUsers(users.filter((user) => user.id !== userId))
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="space-y-4 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          User Management App
        </h1>

        {/* Create User */}
        <form
          onSubmit={(e) => handleCreateUser(e)}
          className="p-4 bg-blue-100 rounded shadow"
        >
          <input
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Add User
          </button>
        </form>

        {/* Update User */}
        <form
          onSubmit={(e) => handleUpdateUser(e)}
          className="p-4 bg-green-100 rounded shadow"
        >
          <input
            placeholder="User ID"
            value={updateUser.id}
            onChange={(e) =>
              setUpdateUser({ ...updateUser, id: e.target.value })
            }
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            placeholder="New Name"
            value={updateUser.name}
            onChange={(e) =>
              setUpdateUser({ ...updateUser, name: e.target.value })
            }
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            placeholder="New Email"
            value={updateUser.email}
            onChange={(e) =>
              setUpdateUser({ ...updateUser, email: e.target.value })
            }
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full p-2 text-white bg-green-500 rounded hover:bg-green-600"
          >
            Update User
          </button>
        </form>

        {/* Display User */}
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
            >
              <CardComponent card={user} />
              {/* Delete User */}
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              >
                Delete User
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
