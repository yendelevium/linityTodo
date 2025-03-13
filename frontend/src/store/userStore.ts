import {create} from 'zustand';
import { UserState } from '@/types/todo';

const useUserStore = create<UserState>((set, get) => ({
    user: null,
    todos: [],
    login: async (username: string, password: string) => {
        try {
            const response = await fetch('http://127.0.0.1:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            console.log(username);
            await useUserStore.getState().fetchTodos(username);
            set({ user: { username } });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    },
    signup: async (username: string, password: string) => {
        try {
            const response = await fetch('http://127.0.0.1:8080/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Signup failed');
            }
            console.log(username);
            await useUserStore.getState().fetchTodos(username);
            set({ user: { username } });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    },
    fetchTodos: async (usernm) => {
        const response = await fetch(`http://127.0.0.1:8080/todo?username=${usernm}`,{
            credentials: "include"
        });
        const todos = await response.json();
        console.log(todos);
        set({ todos: todos.data });
    },
    addTodo: async (description: string) => {
        const { user } = get();
        if (!description.trim() || !user) return;

        try {
            const response = await fetch('http://127.0.0.1:8080/todo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    description,
                    username: user.username,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add todo');
            }

            await useUserStore.getState().fetchTodos(user.username);
        } catch (error) {
            console.error('Error adding todo:', error);
            throw error;
        }
    },
    toggleTodo: async (todoId: string) => {
        const { user, todos } = get();
        if (!user) return;

        try {
            const todo = todos.find(t => t.todo_id === todoId);
            if (!todo) return;

            const response = await fetch(`http://127.0.0.1:8080/todo/${todoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    status: !todo.status,
                    username: user.username,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update todo');
            }

            await useUserStore.getState().fetchTodos(user.username);
        } catch (error) {
            console.error('Error updating todo:', error);
            throw error;
        }
    },
    deleteTodo: async (todoId: string) => {
        const { user } = get();
        if (!user) return;

        try {
            const response = await fetch(`http://127.0.0.1:8080/todo/${todoId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }

            await useUserStore.getState().fetchTodos(user.username);
        } catch (error) {
            console.error('Error deleting todo:', error);
            throw error;
        }
    },
    logout: () => {
        set({ user: null, todos: [] });
    },
    checkAuth: async () => {
        try {
            const response = await fetch('http://127.0.0.1:8080/check_auth', {
                credentials: "include"
            });
            if (!response.ok) {
                throw new Error('Not authenticated');
            }
            const data = await response.json();
            if (data.username) {
                set({ user: { username: data.username } });
                await useUserStore.getState().fetchTodos(data.username);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            set({ user: null, todos: [] });
        }
    }
}));

export default useUserStore;