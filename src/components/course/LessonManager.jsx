// ✅ CREAR: src/components/course/LessonManager.jsx
import React, { useState } from 'react';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaVideo,
  FaFileAlt,
  FaLink,
  FaQuestionCircle,
} from 'react-icons/fa';
import ContentUploader from './ContentUploader';
import './LessonManager.css';

const LessonManager = ({ module, onUpdateModule }) => {
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    type: 'video', // video, document, link, quiz
    content: '',
    duration: 0,
    order: 0,
    isRequired: true,
  });

  const lessonTypes = [
    { value: 'video', label: 'Video', icon: FaVideo },
    { value: 'document', label: 'Documento', icon: FaFileAlt },
    { value: 'link', label: 'Enlace', icon: FaLink },
    { value: 'quiz', label: 'Quiz', icon: FaQuestionCircle },
  ];

  const addLesson = () => {
    const lessons = module.lessons || [];
    const updatedLessons = [
      ...lessons,
      {
        ...newLesson,
        id: `lesson${lessons.length + 1}`,
        order: lessons.length,
        createdAt: new Date().toISOString(),
      },
    ];

    onUpdateModule({
      ...module,
      lessons: updatedLessons,
    });

    setNewLesson({
      title: '',
      description: '',
      type: 'video',
      content: '',
      duration: 0,
      order: 0,
      isRequired: true,
    });
    setShowAddLesson(false);
  };

  const updateLesson = (lessonIndex, updatedLesson) => {
    const updatedLessons = [...module.lessons];
    updatedLessons[lessonIndex] = updatedLesson;
    onUpdateModule({
      ...module,
      lessons: updatedLessons,
    });
    setEditingLesson(null);
  };

  const deleteLesson = (lessonIndex) => {
    if (window.confirm('¿Estás seguro de eliminar esta lección?')) {
      const updatedLessons = module.lessons.filter(
        (_, index) => index !== lessonIndex
      );
      onUpdateModule({
        ...module,
        lessons: updatedLessons,
      });
    }
  };

  const moveLesson = (fromIndex, toIndex) => {
    const updatedLessons = [...module.lessons];
    const [movedLesson] = updatedLessons.splice(fromIndex, 1);
    updatedLessons.splice(toIndex, 0, movedLesson);

    // Actualizar orden
    updatedLessons.forEach((lesson, index) => {
      lesson.order = index;
    });

    onUpdateModule({
      ...module,
      lessons: updatedLessons,
    });
  };

  const renderLessonContent = (lesson) => {
    const TypeIcon =
      lessonTypes.find((t) => t.value === lesson.type)?.icon || FaFileAlt;

    return (
      <div className="lesson-content">
        <div className="lesson-type">
          <TypeIcon className="type-icon" />
          <span>{lessonTypes.find((t) => t.value === lesson.type)?.label}</span>
        </div>
        {lesson.content && (
          <div className="lesson-preview">
            {lesson.type === 'video' && <span>Video: {lesson.content}</span>}
            {lesson.type === 'document' && (
              <span>Documento: {lesson.content}</span>
            )}
            {lesson.type === 'link' && (
              <a
                href={lesson.content}
                target="_blank"
                rel="noopener noreferrer"
              >
                {lesson.content}
              </a>
            )}
            {lesson.type === 'quiz' && <span>Quiz configurado</span>}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="lesson-manager">
      <div className="lesson-header">
        <h4>Lecciones</h4>
        <button
          className="btn-add-lesson"
          onClick={() => setShowAddLesson(true)}
        >
          <FaPlus />
          Agregar Lección
        </button>
      </div>

      {(showAddLesson || editingLesson !== null) && (
        <div className="lesson-form">
          <div className="lesson-form-card">
            <h5>
              {editingLesson !== null ? 'Editar Lección' : 'Nueva Lección'}
            </h5>

            <div className="form-group">
              <label>Título</label>
              <input
                type="text"
                value={
                  editingLesson !== null
                    ? module.lessons[editingLesson].title
                    : newLesson.title
                }
                onChange={(e) => {
                  if (editingLesson !== null) {
                    const updatedLesson = {
                      ...module.lessons[editingLesson],
                      title: e.target.value,
                    };
                    updateLesson(editingLesson, updatedLesson);
                  } else {
                    setNewLesson((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }));
                  }
                }}
                placeholder="Título de la lección"
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                value={
                  editingLesson !== null
                    ? module.lessons[editingLesson].description
                    : newLesson.description
                }
                onChange={(e) => {
                  if (editingLesson !== null) {
                    const updatedLesson = {
                      ...module.lessons[editingLesson],
                      description: e.target.value,
                    };
                    updateLesson(editingLesson, updatedLesson);
                  } else {
                    setNewLesson((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }));
                  }
                }}
                placeholder="Descripción de la lección"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tipo de contenido</label>
                <select
                  value={
                    editingLesson !== null
                      ? module.lessons[editingLesson].type
                      : newLesson.type
                  }
                  onChange={(e) => {
                    if (editingLesson !== null) {
                      const updatedLesson = {
                        ...module.lessons[editingLesson],
                        type: e.target.value,
                      };
                      updateLesson(editingLesson, updatedLesson);
                    } else {
                      setNewLesson((prev) => ({
                        ...prev,
                        type: e.target.value,
                      }));
                    }
                  }}
                >
                  {lessonTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Duración (minutos)</label>
                <input
                  type="number"
                  value={
                    editingLesson !== null
                      ? module.lessons[editingLesson].duration
                      : newLesson.duration
                  }
                  onChange={(e) => {
                    if (editingLesson !== null) {
                      const updatedLesson = {
                        ...module.lessons[editingLesson],
                        duration: Number(e.target.value),
                      };
                      updateLesson(editingLesson, updatedLesson);
                    } else {
                      setNewLesson((prev) => ({
                        ...prev,
                        duration: Number(e.target.value),
                      }));
                    }
                  }}
                />
              </div>
            </div>

            <ContentUploader
              lessonType={
                editingLesson !== null
                  ? module.lessons[editingLesson].type
                  : newLesson.type
              }
              currentContent={
                editingLesson !== null
                  ? module.lessons[editingLesson].content
                  : newLesson.content
              }
              onContentUpdate={(content) => {
                if (editingLesson !== null) {
                  const updatedLesson = {
                    ...module.lessons[editingLesson],
                    content,
                  };
                  updateLesson(editingLesson, updatedLesson);
                } else {
                  setNewLesson((prev) => ({ ...prev, content }));
                }
              }}
            />

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={
                    editingLesson !== null
                      ? module.lessons[editingLesson].isRequired
                      : newLesson.isRequired
                  }
                  onChange={(e) => {
                    if (editingLesson !== null) {
                      const updatedLesson = {
                        ...module.lessons[editingLesson],
                        isRequired: e.target.checked,
                      };
                      updateLesson(editingLesson, updatedLesson);
                    } else {
                      setNewLesson((prev) => ({
                        ...prev,
                        isRequired: e.target.checked,
                      }));
                    }
                  }}
                />
                Lección obligatoria
              </label>
            </div>

            <div className="form-actions">
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowAddLesson(false);
                  setEditingLesson(null);
                }}
              >
                Cancelar
              </button>
              <button
                className="btn-save"
                onClick={
                  editingLesson !== null
                    ? () => setEditingLesson(null)
                    : addLesson
                }
              >
                {editingLesson !== null ? 'Actualizar' : 'Guardar Lección'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="lessons-list">
        {module.lessons?.map((lesson, index) => (
          <div key={index} className="lesson-item">
            <div className="lesson-order">
              <span>{index + 1}</span>
              <div className="order-controls">
                <button
                  onClick={() => moveLesson(index, index - 1)}
                  disabled={index === 0}
                >
                  ↑
                </button>
                <button
                  onClick={() => moveLesson(index, index + 1)}
                  disabled={index === module.lessons.length - 1}
                >
                  ↓
                </button>
              </div>
            </div>

            <div className="lesson-info">
              <div className="lesson-header-info">
                <h5>{lesson.title}</h5>
                <span className="lesson-duration">{lesson.duration} min</span>
                {lesson.isRequired && (
                  <span className="required-badge">Obligatorio</span>
                )}
              </div>
              <p className="lesson-description">{lesson.description}</p>
              {renderLessonContent(lesson)}
            </div>

            <div className="lesson-actions">
              <button
                className="btn-edit"
                onClick={() => setEditingLesson(index)}
              >
                <FaEdit />
              </button>
              <button
                className="btn-delete"
                onClick={() => deleteLesson(index)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {(!module.lessons || module.lessons.length === 0) && (
        <div className="empty-lessons">
          <p>No hay lecciones creadas aún</p>
          <button
            className="btn-primary"
            onClick={() => setShowAddLesson(true)}
          >
            Crear primera lección
          </button>
        </div>
      )}
    </div>
  );
};

export default LessonManager;
