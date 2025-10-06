// src/view/planets/PlanetCharts.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, BarChart3, PieChart, LineChart, Activity } from 'lucide-react';
import './css/PlanetCharts.css';

// Interfaces
interface PlanetData {
  id: string;
  name: string;
  csvFileName: string;
  uploadDate: string;
  size: string;
  category: string;
  status: 'processed' | 'pending' | 'error';
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string | string[];
    borderColor: string | string[];
    borderWidth: number;
  }[];
}

// Campos científicos con descripciones detalladas y exactas
const SCIENTIFIC_FIELDS = {
  pl_orbper: {
    name: 'Período Orbital',
    unit: 'días',
    description: 'Tiempo que tarda el planeta en completar una órbita alrededor de su estrella anfitriona. Valores bajos indican órbitas cercanas a la estrella, mientras valores altos sugieren órbitas más distantes.',
    significance: 'Determina la zona habitable y la temperatura del planeta',
    range: '0.5 - 1000+ días'
  },
  pl_trandep: {
    name: 'Profundidad de Tránsito',
    unit: '%',
    description: 'Disminución porcentual en el brillo de la estrella cuando el planeta transita frente a ella. Calculada como (Rp/Rs)² × 100%, donde Rp es el radio del planeta y Rs el radio estelar.',
    significance: 'Permite calcular el radio del planeta relativo a la estrella',
    range: '0.001% - 3%'
  },
  pl_trandur: {
    name: 'Duración del Tránsito',
    unit: 'horas',
    description: 'Tiempo total que el planeta tarda en cruzar completamente el disco estelar durante un tránsito. Depende del radio estelar, período orbital y parámetro de impacto.',
    significance: 'Proporciona información sobre la inclinación orbital',
    range: '1 - 16 horas'
  },
  pl_rade: {
    name: 'Radio del Planeta',
    unit: 'R_Tierra',
    description: 'Radio del exoplaneta medido en radios terrestres (1 R⊕ = 6,371 km). Clasifica planetas como sub-Tierras (<1 R⊕), Tierras (1-1.5 R⊕), super-Tierras (1.5-2 R⊕), o mini-Neptunos (>2 R⊕).',
    significance: 'Indica la posible composición y tipo planetario',
    range: '0.5 - 20 R_Tierra'
  },
  pl_imppar: {
    name: 'Parámetro de Impacto',
    unit: 'adimensional',
    description: 'Distancia mínima normalizada entre el centro de la estrella y el centro del planeta durante el tránsito. Varía de 0 (tránsito central) a 1 (tránsito tangencial).',
    significance: 'Afecta la forma y duración del tránsito observado',
    range: '0 - 1'
  },
  pl_ratror: {
    name: 'Radio Planeta/Estrella',
    unit: 'adimensional',
    description: 'Relación entre el radio del planeta (Rp) y el radio de la estrella (Rs). Valor fundamental derivado directamente de la profundidad del tránsito: Rp/Rs = √(profundidad).',
    significance: 'Relación directa entre tamaños planetario y estelar',
    range: '0.01 - 0.2'
  },
  pl_ratdor: {
    name: 'Semieje Mayor/Radio Estelar',
    unit: 'adimensional',
    description: 'Relación entre el semieje mayor de la órbita planetaria (a) y el radio estelar (Rs). Calculado mediante la tercera ley de Kepler y la duración del tránsito.',
    significance: 'Determina la escala del sistema y la temperatura de equilibrio',
    range: '5 - 500'
  },
  st_rad: {
    name: 'Radio Estelar',
    unit: 'R_Sol',
    description: 'Radio de la estrella anfitriona en radios solares (1 R☉ = 696,340 km). Obtenido mediante espectroscopía o modelos evolutivos estelares.',
    significance: 'Escala fundamental para todas las mediciones planetarias',
    range: '0.1 - 2 R_Sol'
  },
  st_teff: {
    name: 'Temperatura Efectiva Estelar',
    unit: 'Kelvin',
    description: 'Temperatura de un cuerpo negro que emitiría la misma cantidad total de energía electromagnética que la estrella. Determina el tipo espectral y la luminosidad.',
    significance: 'Define la zona habitable y la energía recibida por el planeta',
    range: '2,500 - 10,000 K'
  }
};

const PlanetCharts: React.FC = () => {
  const navigate = useNavigate();
  const { planetId } = useParams<{ planetId: string }>();
  const [planet, setPlanet] = useState<PlanetData | null>(null);
  const [planetData, setPlanetData] = useState<{ [key: string]: number }>({});
  const [activeTab, setActiveTab] = useState<'radar' | 'bar' | 'comparison'>('radar');
  const [loading, setLoading] = useState(true);

  // Datos de ejemplo de planetas (deberían venir de una API real)
  const mockPlanets: PlanetData[] = [
    {
      id: '1',
      name: 'TRAPPIST-1e',
      csvFileName: 'trappist1e_data.csv',
      uploadDate: '2024-01-15',
      size: '2.4 MB',
      category: 'exoplanet',
      status: 'processed'
    },
    {
      id: '2',
      name: 'Kepler-186f',
      csvFileName: 'kepler186f_analysis.csv',
      uploadDate: '2024-01-14',
      size: '1.8 MB',
      category: 'analysis',
      status: 'processed'
    },
    {
      id: '3',
      name: 'Proxima Centauri b',
      csvFileName: 'proxima_centauri_b.csv',
      uploadDate: '2024-01-13',
      size: '3.1 MB',
      category: 'research',
      status: 'pending'
    },
    {
      id: '4',
      name: 'GJ 667Cc',
      csvFileName: 'gj667cc_observations.csv',
      uploadDate: '2024-01-12',
      size: '1.5 MB',
      category: 'observation',
      status: 'processed'
    },
    {
      id: '5',
      name: 'HD 40307g',
      csvFileName: 'hd40307g_discovery.csv',
      uploadDate: '2024-01-11',
      size: '4.2 MB',
      category: 'discovery',
      status: 'error'
    }
  ];

  // Generar datos científicos realistas para cada planeta
  const generatePlanetData = (planetName: string) => {
    const planetExamples: { [key: string]: { [key: string]: number } } = {
      'TRAPPIST-1e': {
        pl_orbper: 6.10,
        pl_trandep: 0.067,
        pl_trandur: 0.85,
        pl_rade: 0.92,
        pl_imppar: 0.3,
        pl_ratror: 0.0846,
        pl_ratdor: 40.2,
        st_rad: 0.119,
        st_teff: 2559
      },
      'Kepler-186f': {
        pl_orbper: 129.9,
        pl_trandep: 0.032,
        pl_trandur: 2.1,
        pl_rade: 1.11,
        pl_imppar: 0.4,
        pl_ratror: 0.021,
        pl_ratdor: 60.1,
        st_rad: 0.472,
        st_teff: 3755
      },
      'Proxima Centauri b': {
        pl_orbper: 11.186,
        pl_trandep: 0.015,
        pl_trandur: 1.8,
        pl_rade: 1.30,
        pl_imppar: 0.25,
        pl_ratror: 0.035,
        pl_ratdor: 85.3,
        st_rad: 0.141,
        st_teff: 3042
      },
      'GJ 667Cc': {
        pl_orbper: 28.14,
        pl_trandep: 0.028,
        pl_trandur: 2.5,
        pl_rade: 1.54,
        pl_imppar: 0.35,
        pl_ratror: 0.045,
        pl_ratdor: 22.8,
        st_rad: 0.42,
        st_teff: 3700
      },
      'HD 40307g': {
        pl_orbper: 197.8,
        pl_trandep: 0.042,
        pl_trandur: 3.2,
        pl_rade: 2.39,
        pl_imppar: 0.2,
        pl_ratror: 0.067,
        pl_ratdor: 45.6,
        st_rad: 0.716,
        st_teff: 4977
      }
    };

    return planetExamples[planetName] || {
      pl_orbper: 50.5,
      pl_trandep: 0.025,
      pl_trandur: 2.0,
      pl_rade: 1.5,
      pl_imppar: 0.3,
      pl_ratror: 0.05,
      pl_ratdor: 50.0,
      st_rad: 0.5,
      st_teff: 4000
    };
  };

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      const foundPlanet = mockPlanets.find(p => p.id === planetId);
      if (foundPlanet) {
        setPlanet(foundPlanet);
        setPlanetData(generatePlanetData(foundPlanet.name));
      }
      setLoading(false);
    }, 800);
  }, [planetId]);

  // Preparar datos para gráficas
  const getRadarChartData = (): ChartData => {
    const labels = Object.keys(SCIENTIFIC_FIELDS).map(key =>
      SCIENTIFIC_FIELDS[key as keyof typeof SCIENTIFIC_FIELDS].name
    );

    const data = Object.keys(SCIENTIFIC_FIELDS).map(key =>
      planetData[key] || 0
    );

    // Normalizar datos para mejor visualización en radar
    const maxValue = Math.max(...data);
    const normalizedData = data.map(value => (value / maxValue) * 100);

    return {
      labels,
      datasets: [
        {
          label: 'Valores Normalizados (%)',
          data: normalizedData,
          backgroundColor: [
            'rgba(100, 149, 237, 0.2)',
            'rgba(156, 246, 253, 0.2)',
            'rgba(152, 251, 152, 0.2)',
            'rgba(255, 215, 0, 0.2)',
            'rgba(255, 165, 0, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: 'rgba(100, 149, 237, 1)',
          borderWidth: 2
        }
      ]
    };
  };

  const getBarChartData = (): ChartData => {
    const labels = Object.keys(SCIENTIFIC_FIELDS).map(key =>
      SCIENTIFIC_FIELDS[key as keyof typeof SCIENTIFIC_FIELDS].name
    );

    const data = Object.keys(SCIENTIFIC_FIELDS).map(key =>
      planetData[key] || 0
    );

    return {
      labels,
      datasets: [
        {
          label: 'Valores Reales',
          data,
          backgroundColor: [
            'rgba(100, 149, 237, 0.8)',
            'rgba(156, 246, 253, 0.8)',
            'rgba(152, 251, 152, 0.8)',
            'rgba(255, 215, 0, 0.8)',
            'rgba(255, 165, 0, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(255, 159, 64, 0.8)'
          ],
          borderColor: [
            'rgba(100, 149, 237, 1)',
            'rgba(156, 246, 253, 1)',
            'rgba(152, 251, 152, 1)',
            'rgba(255, 215, 0, 1)',
            'rgba(255, 165, 0, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  const getComparisonData = (): ChartData => {
    const earthData = {
      pl_orbper: 365.25,
      pl_trandep: 0.008,
      pl_trandur: 13,
      pl_rade: 1.0,
      pl_imppar: 0.0,
      pl_ratror: 0.009,
      pl_ratdor: 215,
      st_rad: 1.0,
      st_teff: 5778
    };

    const labels = Object.keys(SCIENTIFIC_FIELDS).map(key =>
      SCIENTIFIC_FIELDS[key as keyof typeof SCIENTIFIC_FIELDS].name
    );

    // Para el dataset del planeta actual
    const planetColors = [
      'rgba(100, 149, 237, 0.8)',
      'rgba(100, 149, 237, 0.8)',
      'rgba(100, 149, 237, 0.8)',
      'rgba(100, 149, 237, 0.8)',
      'rgba(100, 149, 237, 0.8)',
      'rgba(100, 149, 237, 0.8)',
      'rgba(100, 149, 237, 0.8)',
      'rgba(100, 149, 237, 0.8)',
      'rgba(100, 149, 237, 0.8)'
    ];

    // Para el dataset de la Tierra
    const earthColors = [
      'rgba(34, 197, 94, 0.8)',
      'rgba(34, 197, 94, 0.8)',
      'rgba(34, 197, 94, 0.8)',
      'rgba(34, 197, 94, 0.8)',
      'rgba(34, 197, 94, 0.8)',
      'rgba(34, 197, 94, 0.8)',
      'rgba(34, 197, 94, 0.8)',
      'rgba(34, 197, 94, 0.8)',
      'rgba(34, 197, 94, 0.8)'
    ];

    return {
      labels,
      datasets: [
        {
          label: planet?.name || 'Planeta',
          data: Object.keys(SCIENTIFIC_FIELDS).map(key => planetData[key] || 0),
          backgroundColor: planetColors,
          borderColor: 'rgba(100, 149, 237, 1)',
          borderWidth: 2
        },
        {
          label: 'Tierra',
          data: Object.keys(SCIENTIFIC_FIELDS).map(key => earthData[key as keyof typeof earthData]),
          backgroundColor: earthColors,
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 2
        }
      ]
    };
  };

  const handleDownloadChart = () => {
    alert(`📊 Descargando reporte de análisis para ${planet?.name}\n\nSe generarían PDFs con todas las gráficas y análisis científicos.`);
  };

  const renderRadarChart = () => {
    const data = getRadarChartData();
    return (
      <div className="chart-container">
        <h3>📡 Análisis Radar - Parámetros Normalizados</h3>
        <div className="radar-chart">
          <div className="chart-placeholder">
            <PieChart size={48} />
            <p>Gráfico Radar - Visualización de todos los parámetros</p>
            <div className="radar-grid">
              {data.labels.map((label, index) => (
                <div key={index} className="radar-item">
                  <span className="radar-label">{label}</span>
                  <div
                    className="radar-value"
                    style={{
                      height: `${data.datasets[0].data[index]}%`,
                      backgroundColor: Array.isArray(data.datasets[0].backgroundColor)
                        ? data.datasets[0].backgroundColor[index] as string
                        : data.datasets[0].backgroundColor as string
                    }}
                  >
                    {data.datasets[0].data[index].toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBarChart = () => {
    const data = getBarChartData();
    return (
      <div className="chart-container">
        <h3>📊 Análisis de Barras - Valores Reales</h3>
        <div className="bar-chart">
          <div className="chart-placeholder">
            <BarChart3 size={48} />
            <p>Gráfico de Barras - Valores científicos reales</p>
            <div className="bar-grid">
              {data.labels.map((label, index) => (
                <div key={index} className="bar-item">
                  <span className="bar-label">{label}</span>
                  <div className="bar-container">
                    <div
                      className="bar-value"
                      style={{
                        width: `${(data.datasets[0].data[index] / Math.max(...data.datasets[0].data)) * 100}%`,
                        backgroundColor: Array.isArray(data.datasets[0].backgroundColor)
                          ? data.datasets[0].backgroundColor[index] as string
                          : data.datasets[0].backgroundColor as string
                      }}
                    >
                      <span className="bar-text">
                        {data.datasets[0].data[index]} {SCIENTIFIC_FIELDS[Object.keys(SCIENTIFIC_FIELDS)[index] as keyof typeof SCIENTIFIC_FIELDS].unit}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderComparisonChart = () => {
    const data = getComparisonData();
    return (
      <div className="chart-container">
        <h3>🔄 Comparación con la Tierra</h3>
        <div className="comparison-chart">
          <div className="chart-placeholder">
            <Activity size={48} />
            <p>Gráfico Comparativo - {planet?.name} vs Tierra</p>
            <div className="comparison-grid">
              {data.labels.map((label, index) => (
                <div key={index} className="comparison-item">
                  <span className="comparison-label">{label}</span>
                  <div className="comparison-bars">
                    <div
                      className="comparison-bar planet-bar"
                      style={{
                        width: `${(data.datasets[0].data[index] / Math.max(data.datasets[0].data[index], data.datasets[1].data[index])) * 50}%`,
                        backgroundColor: Array.isArray(data.datasets[0].backgroundColor)
                          ? data.datasets[0].backgroundColor[index] as string
                          : data.datasets[0].backgroundColor as string
                      }}
                    >
                      <span>{data.datasets[0].data[index].toFixed(2)}</span>
                    </div>
                    <div
                      className="comparison-bar earth-bar"
                      style={{
                        width: `${(data.datasets[1].data[index] / Math.max(data.datasets[0].data[index], data.datasets[1].data[index])) * 50}%`,
                        backgroundColor: Array.isArray(data.datasets[1].backgroundColor)
                          ? data.datasets[1].backgroundColor[index] as string
                          : data.datasets[1].backgroundColor as string
                      }}
                    >
                      <span>{data.datasets[1].data[index].toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="planet-charts-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando datos del planeta...</p>
        </div>
      </div>
    );
  }

  if (!planet) {
    return (
      <div className="planet-charts-container">
        <div className="error-container">
          <h2>🚫 Planeta no encontrado</h2>
          <p>El planeta solicitado no existe o no está disponible.</p>
          <button onClick={() => navigate('/planets')} className="back-button">
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="planet-charts-container">
      {/* Header */}
      <motion.header
        className="charts-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <button
            className="back-button"
            onClick={() => navigate('/planets')}
          >
            <ArrowLeft size={20} />
            Volver a la Lista
          </button>
          <div className="title-section">
            <h1>📈 Análisis Científico - {planet.name}</h1>
            <p>Visualización de datos y parámetros del exoplaneta</p>
          </div>
          <button
            className="download-report-button"
            onClick={handleDownloadChart}
          >
            <Download size={18} />
            Descargar Reporte
          </button>
        </div>
      </motion.header>

      {/* Información del planeta */}
      <motion.section
        className="planet-info"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="info-grid">
          <div className="info-card">
            <div className="info-card-header">
              <h3>📁 Metadatos del Archivo</h3>
            </div>
            <div className="info-card-content">
              <div className="info-item">
                <span className="info-label">Nombre del archivo:</span>
                <span className="info-value">{planet.csvFileName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Fecha de subida:</span>
                <span className="info-value">{planet.uploadDate}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Tamaño del dataset:</span>
                <span className="info-value">{planet.size}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Estado de procesamiento:</span>
                <span className={`info-value status-${planet.status}`}>
                  {planet.status === 'processed' ? '✅ Procesado' :
                   planet.status === 'pending' ? '⏳ Pendiente' : '❌ Error'}
                </span>
              </div>
            </div>
          </div>

          <div className="info-card">
            <div className="info-card-header">
              <h3>🔍 Resumen Científico</h3>
            </div>
            <div className="info-card-content">
              <div className="info-item">
                <span className="info-label">Tipo de exoplaneta:</span>
                <span className="info-value">
                  {planetData.pl_rade < 1.5 ? 'Planeta Terrestre' :
                   planetData.pl_rade < 2 ? 'Super-Tierra' : 'Mini-Neptuno'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Zona orbital:</span>
                <span className="info-value">
                  {planetData.pl_orbper < 10 ? 'Órbita Cercana' :
                   planetData.pl_orbper < 100 ? 'Órbita Media' : 'Órbita Distante'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Tipo estelar:</span>
                <span className="info-value">
                  {planetData.st_teff < 3500 ? 'Estrella M (Enana Roja)' :
                   planetData.st_teff < 5000 ? 'Estrella K (Naranja)' :
                   planetData.st_teff < 6000 ? 'Estrella G (Amarilla)' : 'Estrella F (Blanca)'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Parámetros analizados:</span>
                <span className="info-value">{Object.keys(SCIENTIFIC_FIELDS).length} campos</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Navegación de pestañas */}
      <motion.section
        className="tabs-navigation"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'radar' ? 'active' : ''}`}
            onClick={() => setActiveTab('radar')}
          >
            <PieChart size={18} />
            Análisis Radar
          </button>
          <button
            className={`tab ${activeTab === 'bar' ? 'active' : ''}`}
            onClick={() => setActiveTab('bar')}
          >
            <BarChart3 size={18} />
            Gráfico de Barras
          </button>
          <button
            className={`tab ${activeTab === 'comparison' ? 'active' : ''}`}
            onClick={() => setActiveTab('comparison')}
          >
            <LineChart size={18} />
            Comparación Tierra
          </button>
        </div>
      </motion.section>

      {/* Contenido de gráficas */}
      <motion.section
        className="charts-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {activeTab === 'radar' && renderRadarChart()}
        {activeTab === 'bar' && renderBarChart()}
        {activeTab === 'comparison' && renderComparisonChart()}
      </motion.section>

      {/* Información adicional */}
      <motion.footer
        className="charts-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="footer-content">
          <h3>🔬 Información Detallada de los Campos Científicos</h3>
          <div className="fields-info-grid">
            {Object.entries(SCIENTIFIC_FIELDS).map(([key, field]) => (
              <div key={key} className="field-card">
                <div className="field-header">
                  <h4>{field.name}</h4>
                  <span className="field-unit">{field.unit}</span>
                </div>
                <div className="field-body">
                  <p className="field-description">{field.description}</p>
                  <div className="field-meta">
                    <div className="meta-item">
                      <strong>Significancia:</strong>
                      <span>{field.significance}</span>
                    </div>
                    <div className="meta-item">
                      <strong>Rango típico:</strong>
                      <span>{field.range}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default PlanetCharts;