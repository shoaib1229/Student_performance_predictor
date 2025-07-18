"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, Play, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ModelResult {
  name: string
  accuracy: number
  precision: number
  recall: number
  f1_score: number
  status: "pending" | "training" | "completed" | "error"
}

export default function ModelTraining() {
  const { toast } = useToast()
  const [isTraining, setIsTraining] = useState(false)
  const [progress, setProgress] = useState(0)
  const [models, setModels] = useState<ModelResult[]>([
    { name: "Logistic Regression", accuracy: 0, precision: 0, recall: 0, f1_score: 0, status: "pending" },
    { name: "Random Forest", accuracy: 0, precision: 0, recall: 0, f1_score: 0, status: "pending" },
    { name: "Support Vector Machine", accuracy: 0, precision: 0, recall: 0, f1_score: 0, status: "pending" },
    { name: "K-Nearest Neighbors", accuracy: 0, precision: 0, recall: 0, f1_score: 0, status: "pending" },
    { name: "XGBoost", accuracy: 0, precision: 0, recall: 0, f1_score: 0, status: "pending" },
  ])

  const startTraining = async () => {
    setIsTraining(true)
    setProgress(0)

    try {
      const response = await fetch("/api/train-models", {
        method: "POST",
      })

      if (response.ok) {
        // Simulate training progress
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval)
              setIsTraining(false)
              // Update models with mock results
              setModels([
                {
                  name: "Logistic Regression",
                  accuracy: 0.82,
                  precision: 0.79,
                  recall: 0.85,
                  f1_score: 0.82,
                  status: "completed",
                },
                {
                  name: "Random Forest",
                  accuracy: 0.89,
                  precision: 0.87,
                  recall: 0.91,
                  f1_score: 0.89,
                  status: "completed",
                },
                {
                  name: "Support Vector Machine",
                  accuracy: 0.85,
                  precision: 0.83,
                  recall: 0.87,
                  f1_score: 0.85,
                  status: "completed",
                },
                {
                  name: "K-Nearest Neighbors",
                  accuracy: 0.78,
                  precision: 0.76,
                  recall: 0.8,
                  f1_score: 0.78,
                  status: "completed",
                },
                { name: "XGBoost", accuracy: 0.91, precision: 0.89, recall: 0.93, f1_score: 0.91, status: "completed" },
              ])
              toast({
                title: "Training Complete",
                description: "All models have been trained successfully!",
              })
              return 100
            }
            return prev + 2
          })
        }, 100)
      }
    } catch (error) {
      setIsTraining(false)
      toast({
        title: "Training Failed",
        description: "Failed to train models. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Brain className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        )
      case "training":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Training
          </Badge>
        )
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Machine Learning Model Training
          </CardTitle>
          <CardDescription>
            Train multiple ML models to predict student performance and compare their effectiveness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Training Progress</h3>
                <p className="text-sm text-gray-600">{isTraining ? "Training models..." : "Ready to train models"}</p>
              </div>
              <Button onClick={startTraining} disabled={isTraining} className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                {isTraining ? "Training..." : "Start Training"}
              </Button>
            </div>

            {isTraining && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-gray-600 text-center">{progress.toFixed(0)}% Complete</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Model Performance Results</CardTitle>
          <CardDescription>
            Comparison of different machine learning models and their performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {models.map((model, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(model.status)}
                    <h3 className="font-semibold">{model.name}</h3>
                  </div>
                  {getStatusBadge(model.status)}
                </div>

                {model.status === "completed" && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{(model.accuracy * 100).toFixed(1)}%</p>
                      <p className="text-sm text-gray-600">Accuracy</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{(model.precision * 100).toFixed(1)}%</p>
                      <p className="text-sm text-gray-600">Precision</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">{(model.recall * 100).toFixed(1)}%</p>
                      <p className="text-sm text-gray-600">Recall</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{(model.f1_score * 100).toFixed(1)}%</p>
                      <p className="text-sm text-gray-600">F1-Score</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Model Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800">Best Overall Performance: XGBoost</h4>
              <p className="text-sm text-green-700">
                XGBoost achieved the highest accuracy (91%) and F1-score (91%), making it the recommended model for
                production use.
              </p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800">Runner-up: Random Forest</h4>
              <p className="text-sm text-blue-700">
                Random Forest provides excellent interpretability with 89% accuracy, ideal for understanding feature
                importance.
              </p>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800">Fastest Training: Logistic Regression</h4>
              <p className="text-sm text-yellow-700">
                While achieving 82% accuracy, Logistic Regression offers the fastest training time and good baseline
                performance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
