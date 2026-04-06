import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Home, 
  Monitor, 
  Volume2, 
  Globe, 
  Shield, 
  Trash2,
  Info,
  ChevronRight
} from 'lucide-react';
import { FocusableCard } from '../components/FocusableCard';

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  focusKey: string;
}

function SettingItem({ icon, title, description, onClick, focusKey }: SettingItemProps) {
  return (
    <FocusableCard
      focusKey={focusKey}
      onClick={onClick}
      className="rounded-2xl bg-gray-800 p-8 mb-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <div>
            <h3 className="text-2xl mb-2">{title}</h3>
            <p className="text-xl text-gray-400">{description}</p>
          </div>
        </div>
        <ChevronRight className="w-10 h-10 text-gray-500" />
      </div>
    </FocusableCard>
  );
}

export function SettingsScreen() {
  const navigate = useNavigate();

  const settings = [
    {
      icon: <Monitor className="w-8 h-8 text-blue-400" />,
      title: 'Display Settings',
      description: 'Adjust brightness, zoom, and text size',
      action: () => console.log('Display settings'),
    },
    {
      icon: <Volume2 className="w-8 h-8 text-green-400" />,
      title: 'Sound & Voice',
      description: 'Configure voice search and audio feedback',
      action: () => console.log('Sound settings'),
    },
    {
      icon: <Globe className="w-8 h-8 text-purple-400" />,
      title: 'Default Search Engine',
      description: 'Choose your preferred search provider',
      action: () => console.log('Search engine'),
    },
    {
      icon: <Shield className="w-8 h-8 text-yellow-400" />,
      title: 'Privacy & Security',
      description: 'Manage cookies, tracking, and permissions',
      action: () => console.log('Privacy settings'),
    },
    {
      icon: <Trash2 className="w-8 h-8 text-red-400" />,
      title: 'Clear Browsing Data',
      description: 'Remove history, cache, and cookies',
      action: () => console.log('Clear data'),
    },
    {
      icon: <Info className="w-8 h-8 text-cyan-400" />,
      title: 'About',
      description: 'Version info and app details',
      action: () => console.log('About'),
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      {/* Header */}
      <header className="px-16 py-10 bg-gray-900/50 backdrop-blur-lg flex items-center justify-between">
        <div>
          <h1 className="text-5xl mb-2">Settings</h1>
          <p className="text-2xl text-gray-400">Customize your browsing experience</p>
        </div>
        <FocusableCard
          focusKey="back-home"
          onClick={() => navigate('/')}
          className="rounded-2xl bg-blue-600 px-10 py-5"
          autoFocus
        >
          <div className="flex items-center gap-4">
            <Home className="w-8 h-8" />
            <span className="text-2xl">Back to Home</span>
          </div>
        </FocusableCard>
      </header>

      {/* Settings List */}
      <main className="px-16 py-10 max-w-6xl">
        {settings.map((setting, index) => (
          <SettingItem
            key={index}
            icon={setting.icon}
            title={setting.title}
            description={setting.description}
            onClick={setting.action}
            focusKey={`setting-${index}`}
          />
        ))}
      </main>

      {/* Footer */}
      <footer className="px-16 py-8 text-gray-600 text-xl">
        <p>Use arrow keys to navigate • Press ENTER to select</p>
      </footer>
    </div>
  );
}
