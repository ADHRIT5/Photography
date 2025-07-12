"use client"

import { useState, useEffect } from "react"
import Dashboard from "@/components/admin/Dashboard"
import LoginForm from "@/components/admin/LoginForm"
import { Toaster } from "react-hot-toast"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("adminToken")
      if (token) {
        try {
          const response = await fetch("/api/admin/verify", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (response.ok) {
            setIsAuthenticated(true)
          } else {
            localStorage.removeItem("adminToken")
          }
        } catch (error) {
          console.error("Auth check failed:", error)
          localStorage.removeItem("adminToken")
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogin = (token: string) => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    setIsAuthenticated(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      {isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <LoginForm onLogin={handleLogin} />}
    </>
  )
}
