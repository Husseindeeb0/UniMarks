import { useState } from "react";
import { useGetCoursesQuery, useDeleteCourseMutation, useUpdateCourseMutation } from "../../state/services/courseAPI";
import { Library, Trash2, Shield, Loader2, BookOpen, Edit2, Check, X } from "lucide-react";

const CoursesList = () => {
  const { data: courses, isLoading, error } = useGetCoursesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteCourse] = useDeleteCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();

  // Editing state
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm">
        Failed to load courses. Please refresh the page.
      </div>
    );
  }

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete course "${name}"?`)) {
      try {
        await deleteCourse(id).unwrap();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const startEdit = (course: any) => {
    setEditingCourseId(course.id);
    setEditName(course.name);
    setEditCode(course.code);
  };

  const cancelEdit = () => {
    setEditingCourseId(null);
  };

  const handleUpdate = async (id: number) => {
    if (!editName || !editCode) return;
    try {
      await updateCourse({ id, name: editName, code: editCode }).unwrap();
      setEditingCourseId(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
          <Library className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Available Courses</h3>
          <p className="text-xs text-gray-500">View and manage courses offered by the university</p>
        </div>
      </div>

      {courses?.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center shadow-sm">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-500">No courses created yet.</p>
          <p className="text-xs text-gray-400 mt-1">Use the Create Course panel to add the first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course) => {
            const teachers = course.teacherCourses?.map((tc: any) => tc.teacher?.name) || [];
            const isEditing = editingCourseId === course.id;

            return (
              <div
                key={course.id}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 flex flex-col justify-between"
              >
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editCode}
                      onChange={(e) => setEditCode(e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 uppercase"
                      placeholder="Course Code (e.g. CS-101)"
                    />
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="Course Name"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleUpdate(course.id)}
                        disabled={isUpdating}
                        className="p-1 text-green-600 bg-green-50 hover:bg-green-100 rounded-md cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1 text-red-600 bg-red-50 hover:bg-red-100 rounded-md cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider mb-2">
                          {course.code}
                        </span>
                        <h4 className="text-base font-bold text-gray-900 leading-tight">
                          {course.name}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                        <button
                          onClick={() => startEdit(course)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(course.id, course.name)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Assigned Instructors
                      </p>
                      {teachers.length === 0 ? (
                        <span className="text-xs italic text-gray-400">No teachers assigned yet</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {teachers.map((name: string, idx: number) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700"
                            >
                              <Shield className="w-3 h-3 mr-1 text-gray-500" />
                              {name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CoursesList;

