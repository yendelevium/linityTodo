'use client';

import { useState, useEffect } from 'react';
import { TodoCard } from './TodoCard';
import { PlusCircle } from 'lucide-react';
import useUserStore from '@/store/userStore';
import Link from 'next/link';
export function TodoList() {
  const { todos, user, addTodo, checkAuth, logout } = useUserStore();
  const [newTodoDescription, setNewTodoDescription] = useState('');

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleAddTodo = async () => {
    try {
      await addTodo(newTodoDescription);
      setNewTodoDescription('');
    } catch (error) {
      console.error('Error in handleAddTodo:', error);
    }
  };

  if (!user) {
    return (
        <div className="max-w-2xl mx-auto p-4 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 text-center">
              To do, or not to do, that is the question
          </h1>
          <p className="text-gray-600 text-center">Please log in to view your todos: <Link href={"/signup"}>Login/Signup</Link></p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 text-center">
            To do, or not to do, that is the question
        </h1>
        <h2 className="text-xl font-bold tracking-tight text-gray-900 text-center">
          {user.username} &apos; s Todo List (<span onClick={logout} className="cursor-pointer">Logout?</span>)
        </h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Add a new todo..."
            value={newTodoDescription}
            onChange={(e) => setNewTodoDescription(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
          />
          <button
            onClick={handleAddTodo}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {todos.map((todo) => (
          <TodoCard
            key={todo.todo_id}
            todo={todo}
            onToggleComplete={useUserStore.getState().toggleTodo}
            onDelete={useUserStore.getState().deleteTodo}
          />
        ))}
      </div>
    </div>
  );
}