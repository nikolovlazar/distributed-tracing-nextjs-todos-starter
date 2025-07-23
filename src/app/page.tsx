import { TodoList } from "@/components/TodoList"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Todo App</h1>
        <TodoList />
        <Toaster />
      </div>
    </main>
  )
}
