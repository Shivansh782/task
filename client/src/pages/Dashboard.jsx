"use client"

import { useState, useEffect } from "react"
import Header from "../components/Header"
import TaskForm from "../components/TaskForm"
import TaskList from "../components/TaskList"

const Dashboard = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      } else {
        setError("Failed to fetch tasks")
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = async (taskData) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      })

      if (response.ok) {
        const newTask = await response.json()
        setTasks((prev) => [newTask, ...prev])
        setError("")
      } else {
        const data = await response.json()
        setError(data.message || "Failed to create task")
      }
    } catch (error) {
      console.error("Error creating task:", error)
      setError("Network error. Please try again.")
    }
  }

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const updatedTask = await response.json()
        setTasks((prev) => prev.map((task) => (task._id === taskId ? updatedTask : task)))
        setError("")
      } else {
        const data = await response.json()
        setError(data.message || "Failed to update task")
      }
    } catch (error) {
      console.error("Error updating task:", error)
      setError("Network error. Please try again.")
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setTasks((prev) => prev.filter((task) => task._id !== taskId))
        setError("")
      } else {
        const data = await response.json()
        setError(data.message || "Failed to delete task")
      }
    } catch (error) {
      console.error("Error deleting task:", error)
      setError("Network error. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Task</h2>
              <TaskForm onSubmit={handleAddTask} />
            </div>
          </div>

          {/* Task List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">Your Tasks</h2>
                <span className="text-sm text-gray-500">
                  {tasks.length} total task{tasks.length !== 1 ? "s" : ""}
                </span>
              </div>

              <TaskList
                tasks={tasks}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
