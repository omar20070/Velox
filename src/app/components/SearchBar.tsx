import { useState } from 'react';
import { Search, Mic } from 'lucide-react';
import { motion } from 'motion/react';
import { useFocusManagement } from '../hooks/useFocusManagement';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  onSearch,
  placeholder = 'Search the web...',
  autoFocus = false,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');

  const { elementRef } = useFocusManagement({
    focusKey: 'search-bar',
    onEnter: () => {
      if (query.trim()) {
        onSearch?.(query);
      }
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto"
      animate={{ scale: isFocused ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <div
        ref={elementRef}
        tabIndex={0}
        className="relative bg-gray-800/80 rounded-2xl overflow-hidden outline-none"
        autoFocus={autoFocus}
        style={{
          boxShadow: isFocused
            ? '0 0 40px rgba(59, 130, 246, 0.6), 0 0 80px rgba(59, 130, 246, 0.3)'
            : '0 8px 16px rgba(0, 0, 0, 0.5)',
          border: isFocused ? '4px solid #3b82f6' : '4px solid transparent',
        }}
      >
        <div className="flex items-center gap-4 px-8 py-6">
          <Search className="w-10 h-10 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-white text-3xl outline-none placeholder:text-gray-500"
          />
          <button
            type="button"
            className="p-3 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Voice search"
          >
            <Mic className="w-10 h-10 text-blue-400" />
          </button>
        </div>
      </div>
    </motion.form>
  );
}
