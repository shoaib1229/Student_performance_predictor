"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Users, BarChart3, Database, Lock } from "lucide-react"
import DataInput from "@/components/data-input"
import Predictions from "@/components/predictions"
import Analytics from "@/components/analytics"
import StudentDatabase from "@/components/student-database"
import AuthForm from "@/components/auth-form"

export default function StudentPerformancePredictor() {
  const [activeTab, setActiveTab] = useState("input")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check")
        if (response.ok) {
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.log("Not authenticated")
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthForm onAuthenticated={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Student Performance Prediction System</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Predict student academic performance and identify at-risk students using behavioral, social, and academic
              indicators.
            </p>
          </div>
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" })
              setIsAuthenticated(false)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Lock className="h-4 w-4" />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Upload className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold">Data Entry</h3>
              <p className="text-sm text-gray-600">Add student records</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Database className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold">Database</h3>
              <p className="text-sm text-gray-600">Manage student data</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-semibold">Predictions</h3>
              <p className="text-sm text-gray-600">Performance analysis</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <h3 className="font-semibold">Analytics</h3>
              <p className="text-sm text-gray-600">Data insights</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student Performance Analysis Dashboard</CardTitle>
            <CardDescription>
              Comprehensive tool for managing and analyzing student academic performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="input">Data Entry</TabsTrigger>
                <TabsTrigger value="database">Database</TabsTrigger>
                <TabsTrigger value="predictions">Predictions</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="input" className="mt-6">
                <DataInput />
              </TabsContent>

              <TabsContent value="database" className="mt-6">
                <StudentDatabase />
              </TabsContent>

              <TabsContent value="predictions" className="mt-6">
                <Predictions />
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <Analytics />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
