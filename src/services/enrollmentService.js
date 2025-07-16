// ✅ CREAR: src/services/enrollmentService.js
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  getDoc,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

export const enrollmentService = {
  // Inscribir usuario a un curso
  async enrollUserInCourse(userId, courseId) {
    try {
      // Verificar si ya está inscrito
      const existingEnrollment = await this.getUserEnrollment(userId, courseId);
      if (existingEnrollment) {
        throw new Error('Ya estás inscrito en este curso');
      }

      // Obtener información del curso
      const courseDoc = await getDoc(doc(db, 'courses', courseId));
      if (!courseDoc.exists()) {
        throw new Error('El curso no existe');
      }

      const courseData = courseDoc.data();

      // Verificar disponibilidad
      if (
        courseData.enrolledUsers &&
        courseData.enrolledUsers.length >= courseData.maxStudents
      ) {
        throw new Error('El curso ha alcanzado el máximo de estudiantes');
      }

      // Crear inscripción
      const enrollmentData = {
        userId,
        courseId,
        enrolledAt: new Date().toISOString(),
        status: 'active', // active, completed, paused
        progress: 0,
        completedLessons: [],
        currentModule: 0,
        currentLesson: 0,
        grade: null,
        completedAt: null,
      };

      // Agregar a la colección de inscripciones
      const enrollmentRef = await addDoc(
        collection(db, 'enrollmentId'),
        enrollmentData
      );

      // Actualizar el curso para agregar el usuario
      await updateDoc(doc(db, 'courses', courseId), {
        enrolledUsers: arrayUnion(userId),
        updatedAt: new Date().toISOString(),
      });

      return { id: enrollmentRef.id, ...enrollmentData };
    } catch (error) {
      console.error('Error enrolling user:', error);
      throw error;
    }
  },

  // Obtener inscripción específica
  async getUserEnrollment(userId, courseId) {
    try {
      const q = query(
        collection(db, 'enrollmentId'),
        where('userId', '==', userId),
        where('courseId', '==', courseId)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting user enrollment:', error);
      return null;
    }
  },

  // Obtener todas las inscripciones del usuario
  async getUserEnrollments(userId) {
    try {
      const q = query(
        collection(db, 'enrollmentId'),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting user enrollments:', error);
      return [];
    }
  },

  // Actualizar progreso de lección
  async updateLessonProgress(
    enrollmentId,
    moduleIndex,
    lessonIndex,
    completed = true
  ) {
    try {
      const enrollmentRef = doc(db, 'enrollmentId', enrollmentId);
      const enrollmentDoc = await getDoc(enrollmentRef);

      if (!enrollmentDoc.exists()) {
        throw new Error('Inscripción no encontrada');
      }

      const enrollmentData = enrollmentDoc.data();
      const lessonKey = `${moduleIndex}-${lessonIndex}`;

      let updatedCompletedLessons = enrollmentData.completedLessons || [];

      if (completed && !updatedCompletedLessons.includes(lessonKey)) {
        updatedCompletedLessons.push(lessonKey);
      }

      // Calcular progreso general
      const courseDoc = await getDoc(
        doc(db, 'courses', enrollmentData.courseId)
      );
      const courseData = courseDoc.data();
      const totalLessons =
        courseData.modules?.reduce(
          (total, module) => total + (module.lessons?.length || 0),
          0
        ) || 0;

      const progress =
        totalLessons > 0
          ? (updatedCompletedLessons.length / totalLessons) * 100
          : 0;

      const updateData = {
        completedLessons: updatedCompletedLessons,
        progress: Math.round(progress),
        currentModule: moduleIndex,
        currentLesson: lessonIndex,
        updatedAt: new Date().toISOString(),
      };

      // Si completó el curso (100%)
      if (progress >= 100) {
        updateData.status = 'completed';
        updateData.completedAt = new Date().toISOString();
      }

      await updateDoc(enrollmentRef, updateData);

      return { ...enrollmentData, ...updateData };
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      throw error;
    }
  },
};
