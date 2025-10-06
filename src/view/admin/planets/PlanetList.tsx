// src/view/planets/PlanetList.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import './css/PlanetList.css';

// --- 1. Interfaz actualizada para coincidir con los datos de MongoDB ---
interface Exoplanet {
  _id: string; // ID de MongoDB
  pl_name: string;
  hostname: string;
  discoverymethod: string;
  disc_year: number;
  pl_orbper?: number;
  pl_rade?: number;
  sy_dist?: number;
  // Agrega cualquier otro campo que quieras usar del backend
}

// --- Interfaz para la información de paginación ---
interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}


const PlanetList: React.FC = () => {
  const navigate = useNavigate();
  
  // --- 2. Estados para manejar los datos reales y la paginación ---
  const [planets, setPlanets] = useState<Exoplanet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all'); // Aún no se usa con el backend, pero se mantiene la UI
  
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(null);

  // --- 3. Función para obtener los planetas desde el backend ---
  const fetchPlanets = useCallback(async (page: number) => {
    setLoading(true);
    try {
      // Apunta a tu backend. Asegúrate de que esté corriendo en el puerto 3000.
      const response = await fetch(`http://localhost:3000/api/exoplanets/${page}`);
      
      if (!response.ok) {
        throw new Error('Error al obtener los datos del servidor');
      }

      const data = await response.json();
      
      setPlanets(data.data); // Los planetas están en el campo 'data'
      setPaginationInfo(data.pagination); // La info de paginación
      
    } catch (error) {
      console.error("Error fetching planets:", error);
      // Aquí podrías mostrar una notificación de error al usuario
    } finally {
      setLoading(false);
    }
  }, []);

  // --- 4. useEffect para cargar los datos cuando el componente se monta o la página cambia ---
  useEffect(() => {
    fetchPlanets(currentPage);
  }, [currentPage, fetchPlanets]);


  // Filtrado del lado del cliente (solo para los datos de la página actual)
  const filteredPlanets = planets.filter(planet => 
    planet.pl_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    planet.hostname.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // --- Lógica de paginación ---
  const handleNextPage = () => {
    if (paginationInfo && currentPage < paginationInfo.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="planet-list-container">
      {/* Header (sin cambios) */}
      <motion.header
        className="planet-list-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="header-content">
          <button className="back-button" onClick={() => navigate('/admin/dashboard')}>
            <ArrowLeft size={20} /> Volver al Inicio
          </button>
          <h1>🪐 Lista de Exoplanetas</h1>
          <p>Gestiona y visualiza los exoplanetas registrados en el sistema.</p>
        </div>
      </motion.header>

      {/* Controles de búsqueda y filtro (sin cambios en UI) */}
      <motion.section
        className="controls-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre de planeta o estrella..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        {/* El filtro de categoría se mantiene pero no está conectado al backend aún */}
        <div className="filter-box">
          <Filter size={16} />
          <select className="filter-select">
            <option value="all">Todas las categorías</option>
          </select>
        </div>
      </motion.section>

      {/* --- 5. Sección de la lista de planetas --- */}
      <motion.section
        className="planets-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando datos de exoplanetas desde el servidor...</p>
          </div>
        ) : filteredPlanets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔭</div>
            <h3>No se encontraron planetas</h3>
            <p>No hay resultados que coincidan con tu búsqueda en esta página.</p>
          </div>
        ) : (
          <>
            {/* Información de paginación */}
            <div className="results-info">
              {paginationInfo && (
                <span>
                  Mostrando página <strong>{paginationInfo.currentPage}</strong> de <strong>{paginationInfo.totalPages}</strong>
                </span>
              )}
            </div>
            
            {/* Tabla de Planetas */}
            <div className="planets-table-container">
              <table className="planets-table">
                <thead>
                  <tr>
                    <th>Nombre del Planeta</th>
                    <th>Estrella Anfitriona</th>
                    <th>Método de Descubrimiento</th>
                    <th>Año</th>
                    {/* Se eliminó el encabezado de Acciones */}
                  </tr>
                </thead>
                <tbody>
                  {filteredPlanets.map((planet) => (
                    <motion.tr 
                      key={planet._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td>{planet.pl_name}</td>
                      <td>{planet.hostname}</td>
                      <td>
                        <span className={`discovery-method ${planet.discoverymethod.toLowerCase().replace(' ', '-')}`}>
                           {planet.discoverymethod}
                        </span>
                      </td>
                      <td>{planet.disc_year}</td>
                      {/* Se eliminó la celda de acciones */}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* --- 6. Controles de Paginación --- */}
            {paginationInfo && paginationInfo.totalPages > 1 && (
                <div className="pagination-controls">
                    <button onClick={handlePrevPage} disabled={currentPage === 1}>
                        <ChevronLeft size={20} /> Anterior
                    </button>
                    <span>Página {currentPage}</span>
                    <button onClick={handleNextPage} disabled={currentPage === paginationInfo.totalPages}>
                        Siguiente <ChevronRight size={20} />
                    </button>
                </div>
            )}
          </>
        )}
      </motion.section>
    </div>
  );
};

export default PlanetList;