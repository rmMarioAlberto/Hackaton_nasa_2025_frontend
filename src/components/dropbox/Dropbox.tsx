// src/components/dropbox/Dropbox.tsx

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, X, Database, Check, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './css/Dropbox.css';

// --- Interfaces (sin cambios) ---
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
  parsedData?: any[]; 
}

interface NotificationState {
  isOpen: boolean;
  type: 'error' | 'success' | 'warning' | 'info';
  title: string;
  message: string;
  details: string[];
}

// --- Componente Notification (sin cambios) ---
const Notification: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  type: 'error' | 'success' | 'warning' | 'info';
  title: string;
  message: string;
  details?: string[];
  duration?: number;
}> = ({ isOpen, onClose, type, title, message, details = [], duration = 5000 }) => {
    useEffect(() => {
        if (isOpen && duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [isOpen, duration, onClose]);
    const getIcon = () => {
        switch (type) {
            case 'error': return <AlertCircle size={24} />;
            case 'success': return <CheckCircle size={24} />;
            case 'warning': return <AlertCircle size={24} />;
            case 'info': return <Info size={24} />;
            default: return <Info size={24} />;
        }
    };
    if (!isOpen) return null;
    return (
        <motion.div
            className={`notification notification-${type}`}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
            <div className="notification-header">
                <div className="notification-title">{getIcon()}<span>{title}</span></div>
                <button className="notification-close" onClick={onClose}><X size={16} /></button>
            </div>
            <div className="notification-content">
                <p className="notification-message">{message}</p>
                {details.length > 0 && (
                    <div className="notification-details">
                        <ul>{details.map((detail, index) => (<li key={index}>{detail}</li>))}</ul>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// --- Campos Requeridos (sin cambios) ---
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


const Dropbox: React.FC = () => {
  const navigate = useNavigate();
  type FileItem = { uploadFile: UploadFile; fileObject: File };
  const [files, setFiles] = useState<FileItem[]>([]);
  
  const [dragActive, setDragActive] = useState(false);
  const [category, setCategory] = useState('exoplanet');
  const [notification, setNotification] = useState<NotificationState>({ isOpen: false, type: 'info', title: '', message: '', details: [] });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [jsonDataPreview, setJsonDataPreview] = useState<string | null>(null);

  const categories = [
    { value: 'exoplanet', label: 'Datos de Exoplanetas', icon: '🪐' },
    { value: 'research', label: 'Investigación', icon: '🔬' },
    { value: 'analysis', label: 'Análisis', icon: '📊' },
    { value: 'discovery', label: 'Descubrimientos', icon: '✨' },
    { value: 'observation', label: 'Observaciones', icon: '🔭' }
  ];

  // Funciones auxiliares (sin cambios)
  const showNotification = (type: NotificationState['type'], title: string, message: string, details: string[] = []) => {
    setNotification({ isOpen: true, type, title, message, details });
  };
  const closeNotification = () => setNotification(prev => ({ ...prev, isOpen: false }));
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFiles(e.dataTransfer.files);
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) handleFiles(e.target.files);
  };

  const parseCSV = (file: File): Promise<any[]> => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
              try {
                  const text = e.target?.result as string;
                  const lines = text.split('\n').filter(line => line.trim() !== '');
                  if (lines.length < 2) {
                      resolve([]); 
                      return;
                  }
                  const headers = lines[0].split(',').map(header => header.trim());
                  const dataRows = lines.slice(1);
                  const jsonResult = dataRows.map(row => {
                      const values = row.split(',').map(value => value.trim());
                      const rowObject: { [key: string]: any } = {};
                      headers.forEach((header, index) => {
                          rowObject[header] = values[index] || null;
                      });
                      return rowObject;
                  });
                  resolve(jsonResult);
              } catch (error) {
                  reject(error);
              }
          };
          reader.onerror = (error) => reject(error);
          reader.readAsText(file);
      });
  };

  const validateCSVFields = (file: File): Promise<{isValid: boolean, missingFields: string[], totalFields: number, foundFields: number}> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const lines = content.split('\n');
          if (lines.length === 0) {
            resolve({ isValid: false, missingFields: Object.keys(REQUIRED_FIELDS), totalFields: Object.keys(REQUIRED_FIELDS).length, foundFields: 0 });
            return;
          }
          const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
          const missingFields: string[] = [];
          let foundFields = 0;
          Object.keys(REQUIRED_FIELDS).forEach(field => {
            if (headers.includes(field.toLowerCase())) foundFields++;
            else missingFields.push(field);
          });
          const isValid = missingFields.length === 0;
          resolve({ isValid, missingFields, totalFields: Object.keys(REQUIRED_FIELDS).length, foundFields });
        } catch (error) {
          console.error('Error validando CSV:', error);
          resolve({ isValid: false, missingFields: Object.keys(REQUIRED_FIELDS), totalFields: Object.keys(REQUIRED_FIELDS).length, foundFields: 0 });
        }
      };
      reader.onerror = () => resolve({ isValid: false, missingFields: Object.keys(REQUIRED_FIELDS), totalFields: Object.keys(REQUIRED_FIELDS).length, foundFields: 0 });
      reader.readAsText(file);
    });
  };

  const handleFiles = async (fileList: FileList) => {
    const newFilesToProcess: FileItem[] = [];
    
    for (const file of Array.from(fileList)) {
        if (file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv')) {
            const uploadFile: UploadFile = {
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                type: 'csv',
                size: file.size,
                progress: 0,
                status: 'validating'
            };
            newFilesToProcess.push({ uploadFile, fileObject: file });
        }
    }
    
    if (newFilesToProcess.length === 0) {
        showNotification('error', 'Tipo de archivo incorrecto', 'Por favor, selecciona solo archivos CSV.');
        return;
    }

    setFiles(prev => [...prev, ...newFilesToProcess]);

    for (const item of newFilesToProcess) {
        try {
            const validation = await validateCSVFields(item.fileObject);
            let parsedData: any[] = [];
            
            if (validation.isValid) {
                parsedData = await parseCSV(item.fileObject);
            }

            setFiles(prev => prev.map(f =>
                f.uploadFile.id === item.uploadFile.id
                    ? {
                        ...f,
                        uploadFile: {
                            ...f.uploadFile,
                            validation,
                            status: validation.isValid ? 'uploading' : 'error',
                            parsedData: parsedData 
                        }
                      }
                    : f
            ));

            if (validation.isValid) {
                simulateUpload(item.uploadFile.id);
                showNotification('success', 'Archivo validado y procesado', `El archivo "${item.uploadFile.name}" contiene todos los campos y sus datos han sido leídos.`, [`${parsedData.length} filas de datos encontradas.`]);
            } else {
                const missingFieldsDetails = validation.missingFields.map(field => `• ${field} - ${REQUIRED_FIELDS[field as keyof typeof REQUIRED_FIELDS]}`);
                showNotification('error', 'Error de validación', `El archivo "${item.uploadFile.name}" no cumple con los campos requeridos.`, [`Faltan ${validation.missingFields.length} campos requeridos.`, ...missingFieldsDetails]);
            }
        } catch (error) {
            console.error('Error procesando archivo:', error);
            setFiles(prev => prev.map(f => f.uploadFile.id === item.uploadFile.id ? { ...f, uploadFile: {...f.uploadFile, status: 'error'} } : f));
            showNotification('error', 'Error al procesar archivo', `No se pudo procesar el archivo "${item.uploadFile.name}".`);
        }
    }
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        setFiles(prev => prev.map(item => item.uploadFile.id === fileId ? { ...item, uploadFile: { ...item.uploadFile, progress: 100, status: 'completed' }} : item));
        clearInterval(interval);
      } else {
        setFiles(prev => prev.map(item => item.uploadFile.id === fileId ? { ...item, uploadFile: { ...item.uploadFile, progress }} : item));
      }
    }, 200);
  };

  const removeFile = (fileId: string) => {
    const fileToRemove = files.find(f => f.uploadFile.id === fileId);
    setFiles(prev => prev.filter(f => f.uploadFile.id !== fileId));
    if (fileToRemove) {
      showNotification('info', 'Archivo removido', `El archivo "${fileToRemove.uploadFile.name}" ha sido removido.`);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setJsonDataPreview(null);

    const validItems = files.filter(item => item.uploadFile.status === 'completed');

    if (validItems.length === 0) {
        showNotification('warning', 'No hay archivos válidos', 'Por favor, sube y valida al menos un archivo CSV antes de enviar.');
        return;
    }
    
    const allDataRows = validItems.flatMap(item => item.uploadFile.parsedData || []);

    const payload = {
      planetas: {
        category: category,
        data: allDataRows
      }
    };
    
    setJsonDataPreview(JSON.stringify(payload, null, 2));
    
    console.log('--- JSON que se enviará al backend ---', payload);

    try {
        const response = await fetch('http://localhost:3000/api/planetas/agregarPlanetas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'El servidor devolvió un error.');
        }

        showNotification(
            'success', 
            '¡Datos Enviados!', 
            `Se enviaron ${allDataRows.length} registros de planetas al servidor correctamente.`
        );
        
        // --- ⭐ CAMBIO PRINCIPAL AQUÍ ---
        // Se ha eliminado la redirección automática para que puedas seguir en la página.
        // La página se limpiará después de 3 segundos para que puedas subir más archivos.
        setTimeout(() => {
            setFiles([]);
            setJsonDataPreview(null);
            // navigate('/admin/dashboard'); // <-- LÍNEA ELIMINADA
        }, 3000);

    } catch (error) {
        console.error('Error al enviar los datos al backend:', error);
        const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error de red o de servidor.';
        showNotification(
            'error', 
            'Error de Envío', 
            'No se pudieron guardar los datos.',
            [errorMessage]
        );
    }
  };
  
  // --- RESTO DEL COMPONENTE (sin cambios) ---
  const getFileIcon = (file: UploadFile) => {
    if (file.status === 'validating') return <AlertCircle size={16} className="validating-icon" />;
    if (file.status === 'error') return <AlertCircle size={16} className="error-icon" />;
    if (file.status === 'completed') return <Check size={16} className="success-icon" />;
    return <File size={16} />;
  };
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  const handleButtonClick = () => fileInputRef.current?.click();
  const getValidationStatus = (file: UploadFile) => {
    if (!file.validation) return null;
    if (file.status === 'validating') return <span className="validation-status validating">Validando campos...</span>;
    if (file.validation.isValid) return <span className="validation-status valid">✅ {file.validation.foundFields}/{file.validation.totalFields} campos OK</span>;
    return <span className="validation-status invalid">❌ {file.validation.foundFields}/{file.validation.totalFields} campos</span>;
  };
  
  return (
    <>
      <motion.div
        className="dropbox-page-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="dropbox-header">
          <h2>📁 Agregar Datos CSV de Exoplanetas</h2>
          <button className="close-button" onClick={() => navigate(-1)}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="dropbox-form">
          <div className="form-group">
            <label htmlFor="category">Categoría de Datos</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="category-select">
              {categories.map(cat => (<option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>))}
            </select>
          </div>
          <div className="upload-section">
            <label>Subir Archivos CSV de Exoplanetas</label>
            <div
                className={`dropzone ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={handleButtonClick}
            >
                <input ref={fileInputRef} type="file" multiple onChange={handleFileInput} className="file-input" accept=".csv,text/csv" />
                <Upload size={48} className="upload-icon" />
                <p>Arrastra archivos CSV aquí o haz clic para seleccionar</p>
                <span className="dropzone-hint">Solo se aceptan archivos CSV con los campos requeridos</span>
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
                {files.map(item => (
                    <div key={item.uploadFile.id} className={`file-item ${item.uploadFile.status}`}>
                        <div className="file-info">
                            <span className="file-icon">{getFileIcon(item.uploadFile)}</span>
                            <div className="file-details">
                                <span className="file-name">{item.uploadFile.name}</span>
                                <span className="file-size">{formatFileSize(item.uploadFile.size)}</span>
                                {getValidationStatus(item.uploadFile)}
                            </div>
                        </div>
                        <div className="file-actions">
                            {item.uploadFile.status === 'uploading' && (
                                <div className="upload-progress">
                                    <div className="progress-bar" style={{ width: `${item.uploadFile.progress}%` }} />
                                    <span>{Math.round(item.uploadFile.progress)}%</span>
                                </div>
                            )}
                            {item.uploadFile.status === 'completed' && (<span className="upload-complete">✅</span>)}
                            {item.uploadFile.status === 'error' && item.uploadFile.validation && (
                                <span className="validation-error" title={`Faltan ${item.uploadFile.validation.missingFields.length} campos`} onClick={() => {
                                    const missingFieldsDetails = item.uploadFile.validation!.missingFields.map(field => `• ${field} - ${REQUIRED_FIELDS[field as keyof typeof REQUIRED_FIELDS]}`);
                                    showNotification('error', 'Detalles del error', `El archivo "${item.uploadFile.name}" tiene campos faltantes:`, missingFieldsDetails);
                                }}>❌</span>
                            )}
                            <button type="button" onClick={() => removeFile(item.uploadFile.id)} className="remove-file-button"><X size={14} /></button>
                        </div>
                    </div>
                ))}
            </div>
          )}

          {jsonDataPreview && (
            <div className="json-preview-section">
              <h4>JSON a Enviar al Backend</h4>
              <pre className="json-preview-box">
                <code>{jsonDataPreview}</code>
              </pre>
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={() => navigate(-1)} className="cancel-button">Cancelar</button>
            <button
                type="submit"
                className="submit-button"
                disabled={files.length === 0 || files.some(f => f.uploadFile.status !== 'completed')}
            >
                <Database size={18} />
                Procesar y Enviar Datos
            </button>
          </div>
        </form>
      </motion.div>
      <Notification
        isOpen={notification.isOpen}
        onClose={closeNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        details={notification.details}
        duration={notification.type === 'error' ? 8000 : 5000}
      />
    </>
  );
};

export default Dropbox;