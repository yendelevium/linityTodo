'use client';

import { Todo } from '@/types/todo';
import { Trash2 } from 'lucide-react';

interface TodoCardProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TodoCard({ todo, onToggleComplete, onDelete }: TodoCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md ${todo.status ? 'opacity-75' : ''}`}>
      <div className="p-4">
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={todo.status}
              onChange={() => onToggleComplete(todo.todo_id)}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <p className={`font-medium ${todo.status ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {todo.description}
            </p>
          </div>
          {onDelete && (
            <button
              onClick={() => onDelete(todo.todo_id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}