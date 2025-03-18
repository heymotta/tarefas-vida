
import React, { useState } from 'react';
import { PlusCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AddTaskFormProps {
  onAddTask: (text: string, important?: boolean) => void;
  owner: 'matheus' | 'ana';
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask, owner }) => {
  const [text, setText] = useState('');
  const [important, setImportant] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTask(text, important);
      setText('');
      setImportant(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2 flex-col sm:flex-row">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Nova tarefa para ${owner === 'matheus' ? 'Matheus' : 'Ana'}...`}
          className="flex-grow bg-white/60 dark:bg-black/10 rounded-xl border border-border/40 px-4 py-3
                    shadow-sm focus:border-primary/30 focus:ring-0 focus-ring
                    placeholder:text-muted-foreground/60 text-sm sm:text-base
                    transition-all duration-200"
        />
        
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className={cn(
              "px-3 h-11 dark:bg-black/10",
              important && "text-primary border-primary/50"
            )}
            onClick={() => setImportant(!important)}
          >
            <Star className={cn("h-4 w-4 mr-2", important && "fill-primary")} />
            {important ? "Importante" : "Normal"}
          </Button>
          
          <button
            type="submit"
            disabled={!text.trim()}
            className="bg-primary text-primary-foreground rounded-xl px-4 py-2 
                      flex items-center justify-center gap-2 shadow-sm
                      hover:bg-primary/90 focus-ring disabled:opacity-50
                      disabled:pointer-events-none transition-all duration-200"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Adicionar</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddTaskForm;
