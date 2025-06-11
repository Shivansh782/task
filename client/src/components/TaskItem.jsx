"use client";

import { useState } from "react";

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(
    task.description || ""
  );
  const [loading, setLoading] = useState(false);

  const handleToggleComplete = async () => {
    setLoading(true);
    await onUpdate(task._id, { completed: !task.completed });
    setLoading(false);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    setLoading(true);
    await onUpdate(task._id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
    });
    setIsEditing(false);
    setLoading(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setLoading(true);
      await onDelete(task._id);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <form onSubmit={handleEdit} className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            maxLength={100}
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Task description..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            maxLength={500}
          />
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={loading || !editTitle.trim()}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all duration-200 ${
        task.completed ? "opacity-75" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={loading}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <div className="flex-1 min-w-0">
            <h3
              className={`text-lg font-medium ${
                task.completed ? "line-through text-gray-500" : "text-gray-900"
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p
                className={`mt-1 text-sm ${
                  task.completed
                    ? "line-through text-gray-400"
                    : "text-gray-600"
                }`}
              >
                {task.description}
              </p>
            )}
            <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
              <span>Created: {formatDate(task.createdAt)}</span>
              {task.updatedAt !== task.createdAt && (
                <span>Updated: {formatDate(task.updatedAt)}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => setIsEditing(true)}
            disabled={loading}
            className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none focus:text-blue-600 transition-colors duration-200"
            title="Edit task"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="p-1 text-gray-400 hover:text-red-600 focus:outline-none focus:text-red-600 transition-colors duration-200"
            title="Delete task"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
