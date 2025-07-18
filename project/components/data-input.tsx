"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Plus, Save, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StudentData {
  student_name: string
  student_id: string
  class_grade: string
  attendance_rate: number
  study_hours_per_week: number
  sleep_duration: number
  health_status: string
  family_support: string
  internet_access: string
  parental_education: string
  previous_percentage: number
  class_participation: string
  extracurricular_activities: string
  current_percentage: number
}

export default function DataInput() {
  const { toast } = useToast()
  const [studentData, setStudentData] = useState<StudentData>({
    student_name: "",
    student_id: "",
    class_grade: "10th",
    attendance_rate: 85,
    study_hours_per_week: 15,
    sleep_duration: 7,
    health_status: "good",
    family_support: "high",
    internet_access: "yes",
    parental_education: "higher",
    previous_percentage: 75,
    class_participation: "medium",
    extracurricular_activities: "medium",
    current_percentage: 78,
  })

  const [csvData, setCsvData] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: keyof StudentData, value: string | number) => {
    let processedValue = value

    if (typeof studentData[field] === "number") {
      if (value === "" || value === null || value === undefined) {
        processedValue = 0
      } else if (typeof value === "string") {
        const numValue = Number.parseFloat(value)
        processedValue = isNaN(numValue) ? 0 : numValue
      }
    }

    if (typeof studentData[field] === "string" && (value === null || value === undefined)) {
      processedValue = ""
    }

    setStudentData((prev) => ({
      ...prev,
      [field]: processedValue,
    }))
  }

  const handleSaveStudent = async () => {
    if (!studentData.student_name || !studentData.student_id) {
      toast({
        title: "Validation Error",
        description: "Please enter student name and ID.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...studentData,
          created_at: new Date().toISOString(),
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: `Student ${studentData.student_name} added successfully!`,
        })
        // Reset form
        setStudentData({
          student_name: "",
          student_id: "",
          class_grade: "10th",
          attendance_rate: 85,
          study_hours_per_week: 15,
          sleep_duration: 7,
          health_status: "good",
          family_support: "high",
          internet_access: "yes",
          parental_education: "higher",
          previous_percentage: 75,
          class_participation: "medium",
          extracurricular_activities: "medium",
          current_percentage: 78,
        })
      } else {
        throw new Error(result.message || "Failed to save student")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save student data.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkUpload = async () => {
    if (!csvData.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter CSV data.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/students/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ csvData }),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: `Successfully uploaded ${result.count} student records!`,
        })
        setCsvData("")
      } else {
        throw new Error(result.message || "Failed to upload data")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload bulk data.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateRealisticCSV = () => {
    const sampleData = `student_name,student_id,class_grade,attendance_rate,study_hours_per_week,sleep_duration,health_status,family_support,internet_access,parental_education,previous_percentage,class_participation,extracurricular_activities,current_percentage
Aarav Sharma,STU2024001,10th,92,18,7.5,excellent,high,yes,higher,88,high,high,90
Priya Patel,STU2024002,10th,78,12,6.5,good,medium,yes,secondary,72,medium,medium,75
Rohit Kumar,STU2024003,9th,65,8,6,fair,low,no,primary,58,low,low,62
Ananya Singh,STU2024004,11th,88,16,8,good,high,yes,higher,82,high,medium,85
Vikram Reddy,STU2024005,12th,95,20,7,excellent,high,yes,higher,91,high,high,94
Sneha Gupta,STU2024006,10th,82,14,7.5,good,medium,yes,secondary,76,medium,high,79
Arjun Nair,STU2024007,9th,70,10,6.5,fair,medium,yes,primary,65,low,medium,68
Kavya Iyer,STU2024008,11th,90,17,8,excellent,high,yes,higher,86,high,high,89
Ravi Joshi,STU2024009,12th,85,15,7,good,high,yes,secondary,80,medium,medium,83
Meera Agarwal,STU2024010,10th,75,11,6,good,low,yes,primary,70,low,low,73
Karthik Menon,STU2024011,9th,88,16,7.5,good,high,yes,higher,84,high,medium,87
Divya Rao,STU2024012,11th,92,19,8,excellent,high,yes,higher,89,high,high,92
Suresh Pillai,STU2024013,12th,68,9,6,fair,low,no,secondary,63,low,low,66
Pooja Verma,STU2024014,10th,86,15,7.5,good,medium,yes,higher,81,medium,high,84
Amit Sinha,STU2024015,9th,79,13,7,good,medium,yes,secondary,74,medium,medium,77`

    setCsvData(sampleData)
    toast({
      title: "Sample Data Generated",
      description: "Realistic Indian student CSV data has been loaded. You can modify it before uploading.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Individual Student
            </CardTitle>
            <CardDescription>Enter data for a single student</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="student-name">Student Name *</Label>
                <Input
                  id="student-name"
                  type="text"
                  placeholder="Enter full name"
                  value={studentData.student_name}
                  onChange={(e) => handleInputChange("student_name", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="student-id">Student ID *</Label>
                <Input
                  id="student-id"
                  type="text"
                  placeholder="e.g., STU2024001"
                  value={studentData.student_id}
                  onChange={(e) => handleInputChange("student_id", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="class-grade">Class/Grade</Label>
                <Select
                  value={studentData.class_grade}
                  onValueChange={(value) => handleInputChange("class_grade", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6th">6th Grade</SelectItem>
                    <SelectItem value="7th">7th Grade</SelectItem>
                    <SelectItem value="8th">8th Grade</SelectItem>
                    <SelectItem value="9th">9th Grade</SelectItem>
                    <SelectItem value="10th">10th Grade</SelectItem>
                    <SelectItem value="11th">11th Grade</SelectItem>
                    <SelectItem value="12th">12th Grade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="attendance">Attendance Rate (%)</Label>
                <Input
                  id="attendance"
                  type="number"
                  min="0"
                  max="100"
                  value={studentData.attendance_rate || ""}
                  onChange={(e) => handleInputChange("attendance_rate", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="study-hours">Study Hours/Week</Label>
                <Input
                  id="study-hours"
                  type="number"
                  min="0"
                  value={studentData.study_hours_per_week || ""}
                  onChange={(e) => handleInputChange("study_hours_per_week", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="sleep">Sleep Duration (hours)</Label>
                <Input
                  id="sleep"
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={studentData.sleep_duration || ""}
                  onChange={(e) => handleInputChange("sleep_duration", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="previous">Previous Percentage (%)</Label>
                <Input
                  id="previous"
                  type="number"
                  min="0"
                  max="100"
                  value={studentData.previous_percentage || ""}
                  onChange={(e) => handleInputChange("previous_percentage", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="current">Current Percentage (%)</Label>
                <Input
                  id="current"
                  type="number"
                  min="0"
                  max="100"
                  value={studentData.current_percentage || ""}
                  onChange={(e) => handleInputChange("current_percentage", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="health">Health Status</Label>
                <Select
                  value={studentData.health_status}
                  onValueChange={(value) => handleInputChange("health_status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="family-support">Family Support</Label>
                <Select
                  value={studentData.family_support}
                  onValueChange={(value) => handleInputChange("family_support", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="internet">Internet Access</Label>
                <Select
                  value={studentData.internet_access}
                  onValueChange={(value) => handleInputChange("internet_access", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="parental-education">Parental Education</Label>
                <Select
                  value={studentData.parental_education}
                  onValueChange={(value) => handleInputChange("parental_education", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary School</SelectItem>
                    <SelectItem value="secondary">Secondary School</SelectItem>
                    <SelectItem value="higher">Higher Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="participation">Class Participation</Label>
                <Select
                  value={studentData.class_participation}
                  onValueChange={(value) => handleInputChange("class_participation", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="extracurricular">Extracurricular Activities</Label>
                <Select
                  value={studentData.extracurricular_activities}
                  onValueChange={(value) => handleInputChange("extracurricular_activities", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleSaveStudent} disabled={isLoading} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save Student"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Bulk Data Upload
            </CardTitle>
            <CardDescription>Upload multiple student records via CSV</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={generateRealisticCSV}
                className="flex items-center gap-2 bg-transparent"
              >
                <FileText className="h-4 w-4" />
                Generate Realistic Sample
              </Button>
            </div>

            <div>
              <Label htmlFor="csv-data">CSV Data</Label>
              <Textarea
                id="csv-data"
                placeholder="Paste your CSV data here..."
                className="min-h-[300px] font-mono text-sm"
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
              />
            </div>

            <div className="text-sm text-gray-600">
              <p className="font-semibold mb-2">Required CSV columns:</p>
              <code className="text-xs bg-gray-100 p-2 rounded block">
                student_name,student_id,class_grade,attendance_rate,study_hours_per_week,sleep_duration,health_status,family_support,internet_access,parental_education,previous_percentage,class_participation,extracurricular_activities,current_percentage
              </code>
            </div>

            <Button onClick={handleBulkUpload} disabled={isLoading} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              {isLoading ? "Uploading..." : "Upload CSV Data"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
