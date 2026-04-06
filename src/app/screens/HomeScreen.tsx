import { useState } from 'react';
import { useNavigate } from 'react-router';
import { SearchBar } from '../components/SearchBar';
import { FocusableCard } from '../components/FocusableCard';
import { Chrome, Clock } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const quickAccessSites = [
  {
    name: 'Wikipedia',
    url: 'https://www.wikipedia.org',
    image: 'https://images.unsplash.com/photo-1775439330392-84d3ce50f1be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aWtpcGVkaWElMjBsb2dvJTIwaWNvbnxlbnwxfHx8fDE3NzU0NzMyMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    color: 'from-gray-600 to-gray-800',
  },
  {
    name: 'Reddit',
    url: 'https://www.reddit.com',
    image: 'https://images.unsplash.com/photo-1661077150377-26922fb352bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXRmbGl4JTIwbG9nbyUyMGljb258ZW58MXx8fHwxNzc1NDczMjIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    color: 'from-orange-600 to-red-700',
  },
  {
    name: 'BBC News',
    url: 'https://www.bbc.com/news',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHBiYmMlMjBuZXdzJTIwaWNvbnxlbnwxfHx8fDE3NzU0NzMyMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    color: 'from-red-600 to-red-800',
  },
  {
    name: 'GitHub',
    url: 'https://github.com',
    image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHNoYXJnaHViJTIwbG9nbyUyMGljb258ZW58MXx8fHwxNzc1NDczMjIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    color: 'from-gray-800 to-gray-900',
  },
  {
    name: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHN0YWNrIG92ZXJmbG93JTIwaWNvbnxlbnwxfHx8fDE3NzU0NzMyMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    color: 'from-orange-500 to-orange-700',
  },
  {
    name: 'Medium',
    url: 'https://medium.com',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfG1lZGl1bSUyMGxvZ28lMjBpY29uZW58ZW58MXx8fHwxNzc1NDczMjIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    color: 'from-green-600 to-green-800',
  },
];

const recentSites = [
  { name: 'Wikipedia', url: 'https://www.wikipedia.org', image: 'https://via.placeholder.com/400x225/1a1a2e/ffffff?text=Wikipedia' },
  { name: 'Reddit', url: 'https://www.reddit.com', image: 'https://via.placeholder.com/400x225/ff4500/ffffff?text=Reddit' },
  { name: 'BBC News', url: 'https://www.bbc.com/news', image: 'https://via.placeholder.com/400x225/1a1a2e/ffffff?text=BBC+News' },
  { name: 'GitHub', url: 'https://github.com', image: 'https://via.placeholder.com/400x225/24292e/ffffff?text=GitHub' },
  { name: 'Stack Overflow', url: 'https://stackoverflow.com', image: 'https://via.placeholder.com/400x225/f48024/ffffff?text=Stack+Overflow' },
  { name: 'Medium', url: 'https://medium.com', image: 'https://via.placeholder.com/400x225/00ab6c/ffffff?text=Medium' },
];

export function HomeScreen() {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    const url = query.includes('http') 
      ? query 
      : `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    navigate(`/browser?url=${encodeURIComponent(url)}`);
  };

  const handleSiteClick = (url: string) => {
    navigate(`/browser?url=${encodeURIComponent(url)}`);
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white overflow-hidden">
      {/* Header */}
      <header className="px-16 py-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Chrome className="w-16 h-16 text-blue-500" />
          <h1 className="text-4xl">TV Browser</h1>
        </div>
        <button
          onClick={() => navigate('/settings')}
          className="px-8 py-4 text-2xl text-gray-400 hover:text-white transition-colors"
        >
          Settings
        </button>
      </header>

      {/* Search Bar Section */}
      <section className="px-16 py-12">
        <SearchBar onSearch={handleSearch} autoFocus />
      </section>

      {/* Quick Access Section */}
      <section className="px-16 py-8">
        <h2 className="text-3xl mb-8 text-gray-300">Quick Access</h2>
        <div className="grid grid-cols-6 gap-6">
          {quickAccessSites.map((site, index) => (
            <FocusableCard
              key={site.url}
              focusKey={`quick-${index}`}
              onClick={() => handleSiteClick(site.url)}
              className="rounded-2xl overflow-hidden bg-gray-800"
            >
              <div className={`bg-gradient-to-br ${site.color} p-8 aspect-square flex items-center justify-center`}>
                <ImageWithFallback
                  src={site.image}
                  alt={site.name}
                  className="w-24 h-24 object-contain"
                />
              </div>
              <div className="p-6">
                <p className="text-2xl text-center">{site.name}</p>
              </div>
            </FocusableCard>
          ))}
        </div>
      </section>

      {/* Recently Visited Section */}
      <section className="px-16 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Clock className="w-8 h-8 text-gray-400" />
          <h2 className="text-3xl text-gray-300">Recently Visited</h2>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {recentSites.map((site, index) => (
            <FocusableCard
              key={site.url}
              focusKey={`recent-${index}`}
              onClick={() => handleSiteClick(site.url)}
              className="flex-shrink-0 w-[400px] rounded-2xl overflow-hidden bg-gray-800"
            >
              <div className="aspect-video bg-gray-700 flex items-center justify-center">
                <Chrome className="w-20 h-20 text-gray-600" />
              </div>
              <div className="p-6">
                <p className="text-2xl">{site.name}</p>
                <p className="text-lg text-gray-500 truncate">{site.url}</p>
              </div>
            </FocusableCard>
          ))}
        </div>
      </section>

      {/* Footer Hint */}
      <footer className="px-16 py-8 text-gray-600 text-xl">
        <p>Use arrow keys to navigate • Press ENTER to select</p>
      </footer>
    </div>
  );
}
