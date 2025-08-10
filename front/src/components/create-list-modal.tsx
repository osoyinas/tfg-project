'use client'

import { useState } from 'react'
import { X, Upload, Globe, Lock, Users } from 'lucide-react'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Textarea } from '@components/ui/textarea'
import { Label } from '@components/ui/label'
import { Switch } from '@components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'

interface CreateListModalProps {
  isOpen: boolean
  onClose: () => void
  editList?: any
}

export function CreateListModal({ isOpen, onClose, editList }: CreateListModalProps) {
  const [formData, setFormData] = useState({
    title: editList?.title || '',
    description: editList?.description || '',
    isPublic: editList?.isPublic || false,
    allowCollaborators: editList?.allowCollaborators || false,
    category: editList?.category || 'mixed'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Creating/updating list:', formData)
    onClose()
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-purple-600">
            {editList ? 'Editar Lista' : 'Crear Nueva Lista'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image */}
          <div className="space-y-2">
            <Label htmlFor="cover-image">Imagen de Portada</Label>
            <div className="border-2 border-dashed border-purple-200 rounded-lg p-8 text-center hover:border-purple-300 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Haz clic para subir una imagen o arrastra aquí</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG hasta 5MB</p>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Título de la Lista *</Label>
            <Input
              id="title"
              placeholder="Ej: Mis películas favoritas de 2024"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="border-purple-200 focus:border-purple-400"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe tu lista y qué tipo de contenido incluye..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="border-purple-200 focus:border-purple-400 min-h-[100px]"
              rows={4}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger className="border-purple-200 focus:border-purple-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mixed">Contenido Mixto</SelectItem>
                <SelectItem value="movies">Solo Películas</SelectItem>
                <SelectItem value="books">Solo Libros</SelectItem>
                <SelectItem value="series">Solo Series</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-4 p-4 bg-purple-50 rounded-lg">
            <h3 className="font-medium text-purple-700">Configuración de Privacidad</h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {formData.isPublic ? (
                  <Globe className="w-5 h-5 text-green-500" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <Label htmlFor="public-switch" className="font-medium">
                    {formData.isPublic ? 'Lista Pública' : 'Lista Privada'}
                  </Label>
                  <p className="text-sm text-gray-600">
                    {formData.isPublic 
                      ? 'Cualquiera puede ver y seguir esta lista' 
                      : 'Solo tú puedes ver esta lista'
                    }
                  </p>
                </div>
              </div>
              <Switch
                id="public-switch"
                checked={formData.isPublic}
                onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-500" />
                <div>
                  <Label htmlFor="collaborators-switch" className="font-medium">
                    Permitir Colaboradores
                  </Label>
                  <p className="text-sm text-gray-600">
                    Otros usuarios pueden agregar elementos a tu lista
                  </p>
                </div>
              </div>
              <Switch
                id="collaborators-switch"
                checked={formData.allowCollaborators}
                onCheckedChange={(checked) => handleInputChange('allowCollaborators', checked)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              disabled={!formData.title.trim()}
            >
              {editList ? 'Guardar Cambios' : 'Crear Lista'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
