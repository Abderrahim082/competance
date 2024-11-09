import React, { useState } from 'react'
import { createSlice, configureStore } from "@reduxjs/toolkit"
import { Provider, useSelector, useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, Pencil, Trash2, Download, Plus, Upload } from 'lucide-react'

// Redux Slice
const skillsSlice = createSlice({
  name: 'skills',
  initialState: {
    skills: [
      { id: 'c1', code: 'c1', title: 'competence1', moduleCode: 'M101_F01', moduleName: 'M101', course: 'Cours', quiz: 'Quiz' },
      { id: 'c10', code: 'c10', title: 'competence10', moduleCode: 'M103_F02', moduleName: 'M103', course: 'Cours', quiz: 'Quiz' },
      { id: 'c11', code: 'c11', title: 'competence11', moduleCode: 'M103_F01', moduleName: 'M103', course: 'Cours', quiz: 'Quiz' },
    ],
    modules: ['M101', 'M102', 'M103']
  },
  reducers: {
    addSkill: (state, action) => {
      state.skills.push(action.payload)
    },
    deleteSkill: (state, action) => {
      state.skills = state.skills.filter(skill => skill.id !== action.payload)
    },
    updateSkill: (state, action) => {
      const index = state.skills.findIndex(skill => skill.id === action.payload.id)
      if (index !== -1) {
        state.skills[index] = action.payload
      }
    }
  }
})

const store = configureStore({
  reducer: {
    skills: skillsSlice.reducer
  }
})

// Form Component
function SkillForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState(initialData || {
    code: '',
    title: '',
    moduleCode: '',
    moduleName: '',
    course: 'Cours',
    quiz: ''
  })

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      onSubmit(formData)
    }} className="space-y-6">
      <div className="grid gap-4">
        <Label htmlFor="code">Code Compétence</Label>
        <Input
          id="code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          className="border border-gray-300 p-2 rounded-md"
        />
      </div>
      <div className="grid gap-4">
        <Label htmlFor="title">Intitule Compétence</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="border border-gray-300 p-2 rounded-md"
        />
      </div>
      <div className="grid gap-4">
        <Label htmlFor="moduleCode">Code Module</Label>
        <Input
          id="moduleCode"
          value={formData.moduleCode}
          onChange={(e) => setFormData({ ...formData, moduleCode: e.target.value })}
          className="border border-gray-300 p-2 rounded-md"
        />
      </div>
      <div className="grid gap-4">
        <Label htmlFor="moduleName">Intitule Module</Label>
        <Input
          id="moduleName"
          value={formData.moduleName}
          onChange={(e) => setFormData({ ...formData, moduleName: e.target.value })}
          className="border border-gray-300 p-2 rounded-md"
        />
      </div>
      <div className="grid gap-4">
        <Label htmlFor="quiz">Quiz</Label>
        <Input
          id="quiz"
          type="file"
          onChange={(e) => setFormData({ ...formData, quiz: e.target.files[0] })}
          className="border border-gray-300 p-2 rounded-md"
        />
      </div>
      <Button
        type="submit"
        className="bg-blue-600 text-white hover:bg-blue-700 py-2 px-4 rounded-md"
      >
        Submit
      </Button>
    </form>
  )
}

// Main Component
function SkillsList() {
  const dispatch = useDispatch()
  const skills = useSelector((state) => state.skills.skills)
  const modules = useSelector((state) => state.skills.modules)
  const [selectedModule, setSelectedModule] = useState('all')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState(null)

  const filteredSkills = selectedModule === 'all' || selectedModule === ''
    ? skills
    : skills.filter(skill => skill.moduleName === selectedModule)

  const handleExportPDF = () => {
    // Implementation for PDF export would go here
    console.log('Exporting to PDF...')
  }

  const handleImport = () => {
    // Implementation for import would go here
    console.log('Importing skills...')
  }

  return (
    <Card className="w-full max-w-6xl mx-auto shadow-lg rounded-lg">
      <CardContent className="p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">LISTE DES COMPÉTENCES</h1>
        
        <div className="mb-6">
          <Label htmlFor="module-filter" className="font-semibold">MODULES:</Label>
          <Select value={selectedModule} onValueChange={setSelectedModule} className="w-full max-w-xs border border-gray-300 p-2 rounded-md">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select module..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              {modules.map(module => (
                <SelectItem key={module} value={module}>{module}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-6 flex gap-4">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 text-white hover:bg-green-700 py-2 px-4 rounded-md">
                <Plus className="mr-2 h-4 w-4" /> Add Compétence
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-lg bg-white p-6 shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold">Add New Skill</DialogTitle>
              </DialogHeader>
              <SkillForm onSubmit={(data) => {
                dispatch(skillsSlice.actions.addSkill({ id: Date.now().toString(), ...data }))
                setShowAddDialog(false)
              }} />
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="border border-gray-300 text-gray-700 hover:bg-gray-100 py-2 px-4 rounded-md" onClick={handleImport}>
            <Upload className="mr-2 h-4 w-4" /> Import Compétences
          </Button>
        </div>

        <Table className="w-full text-sm">
          <TableHeader className="bg-gray-200 text-gray-700">
            <TableRow>
              <TableHead>Code Compétence</TableHead>
              <TableHead>Intitule Compétence</TableHead>
              <TableHead>Code Module</TableHead>
              <TableHead>Intitule Module</TableHead>
              <TableHead>Cours</TableHead>
              <TableHead>Quiz</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSkills.map((skill) => (
              <TableRow key={skill.id} className="hover:bg-gray-50">
                <TableCell>{skill.code}</TableCell>
                <TableCell>{skill.title}</TableCell>
                <TableCell>{skill.moduleCode}</TableCell>
                <TableCell>{skill.moduleName}</TableCell>
                <TableCell>
                  <Button variant="link" className="text-blue-600 hover:underline">{skill.course}</Button>
                </TableCell>
                <TableCell>{skill.quiz ? skill.quiz : 'No file selected'}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="outline"
                    className="bg-blue-600 text-white hover:bg-blue-700 py-1 px-3 rounded-md"
                    onClick={() => {
                      setSelectedSkill(skill)
                      setShowDetailDialog(true)
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4" /> View Detail
                  </Button>

                  <Button
                    variant="outline"
                    className="bg-blue-600 text-white hover:bg-blue-700 py-1 px-3 rounded-md"
                    onClick={() => {
                      setSelectedSkill(skill)
                      setShowEditDialog(true)
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                    <DialogContent className="p-6">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold">Edit Skill</DialogTitle>
                      </DialogHeader>
                      <SkillForm
                        initialData={selectedSkill}
                        onSubmit={(data) => {
                          dispatch(skillsSlice.actions.updateSkill({ id: selectedSkill.id, ...data }))
                          setShowEditDialog(false)
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    variant="outline"
                    className="bg-red-600 text-white hover:bg-red-700 py-1 px-3 rounded-md"
                    onClick={() => dispatch(skillsSlice.actions.deleteSkill(skill.id))}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="rounded-lg p-6 shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">Skill Details</DialogTitle>
            </DialogHeader>
            {selectedSkill && (
              <div className="space-y-4">
                <div>
                  <Label>Code Compétence</Label>
                  <p className="mt-1">{selectedSkill.code}</p>
                </div>
                <div>
                  <Label>Intitule Compétence</Label>
                  <p className="mt-1">{selectedSkill.title}</p>
                </div>
                <div>
                  <Label>Code Module</Label>
                  <p className="mt-1">{selectedSkill.moduleCode}</p>
                </div>
                <div>
                  <Label>Intitule Module</Label>
                  <p className="mt-1">{selectedSkill.moduleName}</p>
                </div>
                <div>
                  <Label>Quiz</Label>
                  <p className="mt-1">{selectedSkill.quiz || 'No file selected'}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

// Wrap with Provider
export default function Component() {
  return (
    <Provider store={store}>
      <SkillsList />
    </Provider>
  )
}
