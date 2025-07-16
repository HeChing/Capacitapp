// ✅ CREAR: src/components/course/ModuleManager.jsx
import React, { useState } from 'react';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import LessonManager from './LessonManager';
import './ModuleManager.css';

const ModuleManager = ({ course, onUpdateCourse }) => {
  const [expandedModules, setExpandedModules] = useState({});
  const [showAddModule, setShowAddModule] = useState(false);
  const [newModule, setNewModule] = useState({
    title: '',
    description: '',
    duration: 0,
    lessons: [],
  });

  const toggleModule = (moduleIndex) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleIndex]: !prev[moduleIndex],
    }));
  };

  const addModule = () => {
    const modules = course.modules || [];
    const updatedModules = [
      ...modules,
      {
        ...newModule,
        id: `module${modules.length + 1}`,
        order: modules.length,
      },
    ];

    onUpdateCourse((prev) => ({
      ...prev,
      modules: updatedModules,
    }));

    setNewModule({ title: '', description: '', duration: 0, lessons: [] });
    setShowAddModule(false);
  };

  const updateModule = (moduleIndex, updatedModule) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex] = updatedModule;
    onUpdateCourse((prev) => ({
      ...prev,
      modules: updatedModules,
    }));
  };

  const deleteModule = (moduleIndex) => {
    if (window.confirm('¿Estás seguro de eliminar este módulo?')) {
      const updatedModules = course.modules.filter(
        (_, index) => index !== moduleIndex
      );
      onUpdateCourse((prev) => ({
        ...prev,
        modules: updatedModules,
      }));
    }
  };

  return (
    <div className="module-manager">
      <div className="module-header">
        <h3>Módulos del Curso</h3>
        <button
          className="btn-add-module"
          onClick={() => setShowAddModule(true)}
        >
          <FaPlus />
          Agregar Módulo
        </button>
      </div>

      {showAddModule && (
        <div className="add-module-form">
          <div className="module-card">
            <h4>Nuevo Módulo</h4>
            <div className="form-group">
              <label>Título</label>
              <input
                type="text"
                value={newModule.title}
                onChange={(e) =>
                  setNewModule((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Título del módulo"
              />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea
                value={newModule.description}
                onChange={(e) =>
                  setNewModule((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Descripción del módulo"
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Duración estimada (horas)</label>
              <input
                type="number"
                value={newModule.duration}
                onChange={(e) =>
                  setNewModule((prev) => ({
                    ...prev,
                    duration: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div className="form-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowAddModule(false)}
              >
                Cancelar
              </button>
              <button className="btn-save" onClick={addModule}>
                Guardar Módulo
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="modules-list">
        {course.modules?.map((module, index) => (
          <div key={index} className="module-item">
            <div className="module-header-item">
              <div className="module-info">
                <button
                  className="expand-btn"
                  onClick={() => toggleModule(index)}
                >
                  {expandedModules[index] ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                <div className="module-details">
                  <h4>{module.title}</h4>
                  <p>{module.description}</p>
                  <span className="module-meta">
                    {module.lessons?.length || 0} lecciones • {module.duration}h
                  </span>
                </div>
              </div>
              <div className="module-actions">
                <button className="btn-edit">
                  <FaEdit />
                </button>
                <button
                  className="btn-delete"
                  onClick={() => deleteModule(index)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            {expandedModules[index] && (
              <div className="module-content">
                <LessonManager
                  module={module}
                  moduleIndex={index}
                  onUpdateModule={(updatedModule) =>
                    updateModule(index, updatedModule)
                  }
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {(!course.modules || course.modules.length === 0) && (
        <div className="empty-state">
          <p>No hay módulos creados aún</p>
          <button
            className="btn-primary"
            onClick={() => setShowAddModule(true)}
          >
            Crear primer módulo
          </button>
        </div>
      )}
    </div>
  );
};

export default ModuleManager;
