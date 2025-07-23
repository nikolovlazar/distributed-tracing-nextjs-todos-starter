'use client';

import { useState, useEffect, useCallback } from 'react';

import { Todo } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Trash2 } from 'lucide-react';

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchTodos = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5236/api/todo');
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }, [toast]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5236/api/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTodo, isDone: false }),
      });

      if (!response.ok) throw new Error('Failed to add todo');
      
      const todo = await response.json();
      setTodos([...todos, todo]);
      setNewTodo('');
      toast({
        title: 'Success',
        description: 'Todo added successfully',
      });
    } catch (error) {
      console.error('Error adding todo:', error);
      toast({
        title: 'Error',
        description: 'Failed to add todo',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (todo: Todo) => {
    try {
      const response = await fetch(`http://localhost:5236/api/todo/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...todo, isDone: !todo.isDone }),
      });

      if (!response.ok) throw new Error('Failed to update todo');

      setTodos(todos.map(t => 
        t.id === todo.id ? { ...t, isDone: !t.isDone } : t
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
      toast({
        title: 'Error',
        description: 'Failed to update todo',
        variant: 'destructive',
      });
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5236/api/todo/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete todo');

      setTodos(todos.filter(todo => todo.id !== id));
      toast({
        title: 'Success',
        description: 'Todo deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete todo',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <form onSubmit={addTodo} className="flex gap-2">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : 'Add'}
        </Button>
      </form>

      <div className="space-y-2">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
          >
            <div className="flex items-center gap-2">
              <Checkbox
                checked={todo.isDone}
                onCheckedChange={() => toggleTodo(todo)}
                id={`todo-${todo.id}`}
              />
              <label
                htmlFor={`todo-${todo.id}`}
                className={`${
                  todo.isDone ? 'line-through text-gray-500' : ''
                }`}
              >
                {todo.title}
              </label>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteTodo(todo.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 