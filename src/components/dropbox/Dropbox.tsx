// src/components/dropbox/Dropbox.tsx

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, Database, Check, AlertCircle } from 'lucide-react';
import './css/Dropbox.css';

interface DropboxProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UploadFile {
  id: string;
  name: string;
  type: string;
  size: number;
  progress: number;
  status: 'uploading' | 'completed' | 'error' | 'validating';
  validation?: {
    isValid: boolean;
    missingFields: string[];
    totalFields: number;
    foundFields: number;
  };
}

// Campos requeridos para la validación
const REQUIRED_FIELDS = {
  pl_orbper: 'Período orbital del planeta (días)',
  pl_trandep: 'Profundidad de tránsito (%)',
  pl_trandur: 'Duración del tránsito (horas)',
  pl_rade: 'Radio del planeta (R_Tierra)',
  pl_imppar: 'Parámetro de impacto (0-1)',
  pl_ratror: 'Ratio radio planeta/estrella',
  pl_ratdor: 'Ratio eje semi-mayor/radio estelar',
  st_rad: 'Radio de la estrella (R_Sol)',
  st_teff: 'Temperatura efectiva de la estrella (K)'
};

const Dropbox: React.FC<DropboxProps> = ({ isOpen, onClose }) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [category, setCategory] = useState('exoplanet');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { value: 'exoplanet', label: 'Datos de Exoplanetas', icon: '🪐' },
    { value: 'research', label: 'Investigación', icon: '🔬' },
    { value: 'analysis', label: 'Análisis', icon: '📊' },
    { value: 'discovery', label: 'Descubrimientos', icon: '✨' },
    { value: 'observation', label: 'Observaciones', icon: '🔭' }
  ];

  // Cerrar con Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  // Función para validar los campos del CSV
  const validateCSVFields = (file: File): Promise<{isValid: boolean, missingFields: string[], totalFields: number, foundFields: number}> => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const lines = content.split('\n');

          if (lines.length === 0) {
            resolve({
              isValid: false,
              missingFields: Object.keys(REQUIRED_FIELDS),
              totalFields: Object.keys(REQUIRED_FIELDS).length,
              foundFields: 0
            });
            return;
          }

          // Obtener los headers del CSV (primera línea)
          const headers = lines[0].split(',').map(header => header.trim().toLowerCase());

          // Verificar campos requeridos
          const missingFields: string[] = [];
          let foundFields = 0;

          Object.keys(REQUIRED_FIELDS).forEach(field => {
            if (headers.includes(field.toLowerCase())) {
              foundFields++;
            } else {
              missingFields.push(field);
            }
          });

          const isValid = missingFields.length === 0;

          resolve({
            isValid,
            missingFields,
            totalFields: Object.keys(REQUIRED_FIELDS).length,
            foundFields
          });

        } catch (error) {
          console.error('Error validando CSV:', error);
          resolve({
            isValid: false,
            missingFields: Object.keys(REQUIRED_FIELDS),
            totalFields: Object.keys(REQUIRED_FIELDS).length,
            foundFields: 0
          });
        }
      };

      reader.onerror = () => {
        resolve({
          isValid: false,
          missingFields: Object.keys(REQUIRED_FIELDS),
          totalFields: Object.keys(REQUIRED_FIELDS).length,
          foundFields: 0
        });
      };

      reader.readAsText(file);
    });
  };

  const handleFiles = async (fileList: FileList) => {
    const validFiles: UploadFile[] = [];

    for (const file of Array.from(fileList)) {
      // Validar que sea archivo CSV
      if (file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv')) {
        validFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: 'csv',
          size: file.size,
          progress: 0,
          status: 'validating'
        });
      }
    }

    if (validFiles.length === 0) {
      alert('❌ Por favor, selecciona solo archivos CSV.');
      return;
    }

    setFiles(prev => [...prev, ...validFiles]);

    // Validar cada archivo
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const originalFile = Array.from(fileList)[i];

      try {
        const validation = await validateCSVFields(originalFile);

        setFiles(prev =>
          prev.map(f =>
            f.id === file.id
              ? {
                  ...f,
                  validation,
                  status: validation.isValid ? 'uploading' : 'error'
                }
              : f
          )
        );

        // Solo simular upload si es válido
        if (validation.isValid) {
          simulateUpload(file.id);
        } else {
          // Mostrar error específico
          const missingFieldsList = validation.missingFields.map(field =>
            `• ${field} (${REQUIRED_FIELDS[field as keyof typeof REQUIRED_FIELDS]})`
          ).join('\n');

          setTimeout(() => {
            alert(`❌ Archivo "${file.name}" no cumple con los campos requeridos.\n\nCampos faltantes:\n${missingFieldsList}\n\nEl archivo debe contener todos los campos especificados para el análisis de exoplanetas.`);
          }, 100);
        }

      } catch (error) {
        console.error('Error procesando archivo:', error);
        setFiles(prev =>
          prev.map(f =>
            f.id === file.id
              ? { ...f, status: 'error' }
              : f
          )
        );
      }
    }
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        setFiles(prev =>
          prev.map(file =>
            file.id === fileId
              ? { ...file, progress: 100, status: 'completed' }
              : file
          )
        );
        clearInterval(interval);
      } else {
        setFiles(prev =>
          prev.map(file =>
            file.id === fileId ? { ...file, progress } : file
          )
        );
      }
    }, 200);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const getFileIcon = (file: UploadFile) => {
    if (file.status === 'validating') {
      return <AlertCircle size={16} className="validating-icon" />;
    }
    if (file.status === 'error') {
      return <AlertCircle size={16} className="error-icon" />;
    }
    if (file.status === 'completed') {
      return <Check size={16} className="success-icon" />;
    }
    return <File size={16} />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validFiles = files.filter(f => f.status === 'completed');

    if (validFiles.length === 0) {
      alert('Por favor, selecciona al menos un archivo CSV válido para subir.');
      return;
    }

    // Verificar que todos los archivos sean válidos
    const invalidFiles = files.filter(f => f.status === 'error');
    if (invalidFiles.length > 0) {
      alert('❌ Por favor, corrige los archivos con errores antes de enviar.');
      return;
    }

    // Simular envío de datos
    const formData = {
      category,
      files: validFiles
    };

    console.log('Datos a enviar:', formData);

    // Aquí iría la lógica real de envío
    const categoryLabel = categories.find(c => c.value === category)?.label;
    alert(`✅ Archivos CSV validados y enviados exitosamente!\n\nCategoría: ${categoryLabel}\nArchivos válidos: ${validFiles.length}\n\nLos datos han pasado todas las verificaciones de campos requeridos.`);

    // Limpiar formulario
    setFiles([]);
    onClose();
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const getValidationStatus = (file: UploadFile) => {
    if (!file.validation) return null;

    if (file.status === 'validating') {
      return <span className="validation-status validating">Validando campos...</span>;
    }

    if (file.validation.isValid) {
      return (
        <span className="validation-status valid">
          ✅ {file.validation.foundFields}/{file.validation.totalFields} campos OK
        </span>
      );
    }

    return (
      <span className="validation-status invalid">
        ❌ {file.validation.foundFields}/{file.validation.totalFields} campos
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="dropbox-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="dropbox-container"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="dropbox-header">
            <h2>📁 Agregar Datos CSV de Exoplanetas</h2>
            <button className="close-button" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="dropbox-form">
            <div className="form-group">
              <label htmlFor="category">Categoría de Datos</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="category-select"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="upload-section">
              <label>Subir Archivos CSV de Exoplanetas</label>
              <div
                className={`dropzone ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleButtonClick}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileInput}
                  className="file-input"
                  accept=".csv,text/csv"
                />
                <Upload size={48} className="upload-icon" />
                <p>Arrastra archivos CSV aquí o haz clic para seleccionar</p>
                <span className="dropzone-hint">
                  Solo se aceptan archivos CSV con los campos requeridos para análisis de exoplanetas
                </span>

                {/* Información de campos requeridos */}
                <div className="fields-info">
                  <h4>Campos requeridos en el CSV:</h4>
                  <div className="fields-grid">
                    {Object.entries(REQUIRED_FIELDS).map(([field, description]) => (
                      <div key={field} className="field-item">
                        <code>{field}</code>
                        <span>{description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {files.length > 0 && (
              <div className="files-list">
                <h4>Archivos CSV seleccionados ({files.length})</h4>
                {files.map(file => (
                  <div key={file.id} className={`file-item ${file.status}`}>
                    <div className="file-info">
                      <span className="file-icon">
                        {getFileIcon(file)}
                      </span>
                      <div className="file-details">
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">{formatFileSize(file.size)}</span>
                        {getValidationStatus(file)}
                      </div>
                    </div>
                    <div className="file-actions">
                      {file.status === 'uploading' && (
                        <div className="upload-progress">
                          <div
                            className="progress-bar"
                            style={{ width: `${file.progress}%` }}
                          />
                          <span>{Math.round(file.progress)}%</span>
                        </div>
                      )}
                      {file.status === 'completed' && (
                        <span className="upload-complete">✅</span>
                      )}
                      {file.status === 'error' && file.validation && (
                        <span className="validation-error" title={`Faltan ${file.validation.missingFields.length} campos`}>
                          ❌
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="remove-file-button"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                onClick={onClose}
                className="cancel-button"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={files.length === 0 ||
                         files.some(f => f.status === 'uploading' || f.status === 'validating') ||
                         files.filter(f => f.status === 'completed').length === 0}
              >
                <Database size={18} />
                Subir Datos Validados
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Dropbox;