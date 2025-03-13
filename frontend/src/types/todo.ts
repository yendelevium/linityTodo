export interface Todo {
    todo_id: string;
    description: string;
    status: boolean;
    username: string;
}

export interface UserState {
    user: { username: string } | null;
    todos: Todo[];
    login: (username: string, password: string) => Promise<void>;
    signup: (username: string, password: string) => Promise<void>;
    fetchTodos: (usernm: string) => Promise<void>;
    addTodo: (description: string) => Promise<void>;
    toggleTodo: (todoId: string) => Promise<void>;
    deleteTodo: (todoId: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}