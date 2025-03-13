"use client"
import { TodoList } from "@/components/TodoList";
import useUserStore from "@/store/userStore";

export default function Home() {
    const {todos} = useUserStore();
    console.log(todos);
    return(
      <main className="min-h-screen bg-gray-50 py-8">
        <TodoList />
      </main>
    )
}
