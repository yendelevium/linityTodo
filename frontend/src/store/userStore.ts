import {create} from 'zustand';

interface Todo {
    todo_id: string;
    description: string;
    status: boolean;
    username: string;
}

interface UserState {
    user: { username: string } | null;
    todos: Todo[];
    login: (username: string, password: string) => Promise<void>;
    signup: (username: string, password: string) => Promise<void>;
    fetchTodos: (usernm: string) => Promise<void>;
    logout: () => void;
}

const useUserStore = create<UserState>((set) => ({
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
            throw error; // Re-throw the error to handle it in the calling function
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
    logout: () => {
        // Clear user and todos
        set({ user: null, todos: [] });
    },
}));

export default useUserStore;