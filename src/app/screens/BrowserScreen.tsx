import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { 
  Home, 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Bookmark, 
  Menu,
  Search,
  X,
  Plus,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFocusManagement } from '../hooks/useFocusManagement';

interface Tab {
  id: string;
  url: string;
  title: string;
}

interface HistoryItem {
  url: string;
  title: string;
}

const DEFAULT_URL = 'https://www.google.com';

function normalizeUrl(input: string): string {
  let url = input.trim();
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  if (url.includes('.') && !url.includes(' ')) {
    return `https://${url}`;
  }
  
  return `https://www.google.com/search?q=${encodeURIComponent(url)}`;
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '') || url;
  } catch {
    return url;
  }
}

function isLikelyFrameBlocked(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.toLowerCase().replace(/^www\./, '');
    const blockedDomains = [
      'google.com',
      'reddit.com',
      'facebook.com',
      'instagram.com',
      'x.com',
      'twitter.com',
      'tiktok.com',
    ];
    return blockedDomains.some(domain => hostname === domain || hostname.endsWith(`.${domain}`));
  } catch {
    return false;
  }
}

export function BrowserScreen() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL and navigation state
  const [currentUrl, setCurrentUrl] = useState(searchParams.get('url') || DEFAULT_URL);
  const [urlInput, setUrlInput] = useState(currentUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [isFrameBlocked, setIsFrameBlocked] = useState(isLikelyFrameBlocked(currentUrl));
  
  // History management
  const [history, setHistory] = useState<HistoryItem[]>([{ url: DEFAULT_URL, title: 'Google' }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // Tab management
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', url: DEFAULT_URL, title: 'Google' }
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  
  // Bookmarks
  const [bookmarks, setBookmarks] = useState<{ url: string; title: string }[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showUrlBar, setShowUrlBar] = useState(true);
  
  const [urlBarFocused, setUrlBarFocused] = useState(false);

  // Get active tab
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  // Update URL when search params change
  useEffect(() => {
    const url = searchParams.get('url');
    if (url && url !== currentUrl) {
      setCurrentUrl(url);
      setUrlInput(url);
      setIsFrameBlocked(isLikelyFrameBlocked(url));
    }
  }, [searchParams]);

  // Handle page load state
  useEffect(() => {
    const handleLoad = () => setIsLoading(false);
    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  // Add to history
  const addToHistory = useCallback((url: string) => {
    const title = getDomain(url);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ url, title });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Navigate using React Router (full page navigation)
  const navigateToUrl = useCallback((url: string) => {
    const normalizedUrl = normalizeUrl(url);
    setCurrentUrl(normalizedUrl);
    setUrlInput(normalizedUrl);
    setIsLoading(true);
    setIsFrameBlocked(isLikelyFrameBlocked(normalizedUrl));
    addToHistory(normalizedUrl);
    
    // Update search params to trigger navigation
    setSearchParams({ url: normalizedUrl });
    
    // Update active tab
    setTabs(tabs.map(t => 
      t.id === activeTabId 
        ? { ...t, url: normalizedUrl, title: getDomain(normalizedUrl) }
        : t
    ));
  }, [activeTabId, tabs, addToHistory, setSearchParams]);

  // Navigation functions
  const handleBack = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setCurrentUrl(prev.url);
      setUrlInput(prev.url);
      setIsFrameBlocked(isLikelyFrameBlocked(prev.url));
      setSearchParams({ url: prev.url });
      
      setTabs(tabs.map(t => 
        t.id === activeTabId 
          ? { ...t, url: prev.url, title: prev.title }
          : t
      ));
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setCurrentUrl(next.url);
      setUrlInput(next.url);
      setIsFrameBlocked(isLikelyFrameBlocked(next.url));
      setSearchParams({ url: next.url });
      
      setTabs(tabs.map(t => 
        t.id === activeTabId 
          ? { ...t, url: next.url, title: next.title }
          : t
      ));
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    window.location.reload();
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleBookmark = () => {
    const isBookmarked = bookmarks.some(b => b.url === currentUrl);
    if (isBookmarked) {
      setBookmarks(bookmarks.filter(b => b.url !== currentUrl));
    } else {
      const title = getDomain(currentUrl);
      setBookmarks([...bookmarks, { url: currentUrl, title }]);
    }
  };

  const handleAddTab = () => {
    const newTab = {
      id: Date.now().toString(),
      url: DEFAULT_URL,
      title: 'New Tab'
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
    setCurrentUrl(DEFAULT_URL);
    setUrlInput(DEFAULT_URL);
    setIsFrameBlocked(isLikelyFrameBlocked(DEFAULT_URL));
    setHistory([{ url: DEFAULT_URL, title: 'Google' }]);
    setHistoryIndex(0);
    setSearchParams({ url: DEFAULT_URL });
  };

  const handleCloseTab = (tabId: string) => {
    if (tabs.length === 1) return;
    
    const tabIndex = tabs.findIndex(t => t.id === tabId);
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);
    
    if (activeTabId === tabId) {
      const newActiveTab = newTabs[Math.min(tabIndex, newTabs.length - 1)];
      setActiveTabId(newActiveTab.id);
      setCurrentUrl(newActiveTab.url);
      setUrlInput(newActiveTab.url);
      setIsFrameBlocked(isLikelyFrameBlocked(newActiveTab.url));
      setSearchParams({ url: newActiveTab.url });
    }
  };

  const handleTabClick = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setActiveTabId(tabId);
      setCurrentUrl(tab.url);
      setUrlInput(tab.url);
      setIsFrameBlocked(isLikelyFrameBlocked(tab.url));
      setSearchParams({ url: tab.url });
    }
  };

  const openCurrentUrlExternally = () => {
    window.open(currentUrl, '_blank', 'noopener,noreferrer');
  };

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;
  const isBookmarked = bookmarks.some(b => b.url === currentUrl);

  // Focus management for URL bar
  const { elementRef: urlBarRef } = useFocusManagement({
    focusKey: 'url-bar',
    onEnter: () => {
      if (urlInput.trim()) {
        navigateToUrl(urlInput);
      }
    },
    onFocus: () => {
      setUrlBarFocused(true);
      setShowUrlBar(true);
    },
    onBlur: () => setUrlBarFocused(false),
  });

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">
      {/* Top Navigation Bar - Sticky */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800">
        <div className="flex items-center gap-3">
          {/* Navigation Buttons */}
          <div className="flex gap-1">
            <button
              onClick={handleBack}
              disabled={!canGoBack}
              className={`p-2 rounded-lg transition-all ${
                canGoBack ? 'hover:bg-gray-700 text-white' : 'text-gray-600'
              }`}
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleForward}
              disabled={!canGoForward}
              className={`p-2 rounded-lg transition-all ${
                canGoForward ? 'hover:bg-gray-700 text-white' : 'text-gray-600'
              }`}
              title="Forward"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-gray-700 rounded-lg transition-all text-white"
              title="Refresh"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <RotateCw className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={handleHome}
              className="p-2 hover:bg-gray-700 rounded-lg transition-all text-white"
              title="Home"
            >
              <Home className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Bar */}
          <div className="flex-1 flex items-center gap-1 overflow-x-auto">
            {tabs.map(tab => (
              <div
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer text-sm ${
                  tab.id === activeTabId ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="max-w-[100px] truncate">{tab.title}</span>
                {tabs.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseTab(tab.id);
                    }}
                    className="p-0.5 hover:bg-gray-600 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={handleAddTab}
              className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg"
              title="New Tab"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* URL Bar */}
          <div className="flex-1 max-w-md">
            <motion.div
              ref={urlBarRef}
              tabIndex={0}
              className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2 outline-none"
              animate={{ scale: urlBarFocused ? 1.02 : 1 }}
              style={{
                border: urlBarFocused ? '2px solid #3b82f6' : '2px solid transparent',
              }}
            >
              {isLoading && (
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin flex-shrink-0" />
              )}
              <Search className={`w-4 h-4 text-gray-400 flex-shrink-0 ${isLoading ? 'hidden' : ''}`} />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && urlInput.trim()) {
                    navigateToUrl(urlInput);
                  }
                }}
                onFocus={() => setUrlBarFocused(true)}
                onBlur={() => setUrlBarFocused(false)}
                className="flex-1 bg-transparent text-white text-sm outline-none"
                placeholder="Enter URL or search..."
              />
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1">
            <button 
              onClick={handleBookmark}
              className={`p-2 rounded-lg transition-colors ${isBookmarked ? 'text-yellow-400' : 'hover:bg-gray-700 text-gray-300'}`}
              title="Bookmark"
            >
              <Bookmark className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={() => setShowBookmarks(!showBookmarks)}
              className="p-2 hover:bg-gray-700 rounded-lg text-gray-300"
              title="Bookmarks"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-14" />

      {/* Bookmarks Panel */}
      <AnimatePresence>
        {showBookmarks && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 right-4 w-80 bg-gray-900 rounded-xl p-4 z-50 border border-gray-700"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Bookmarks</h3>
              <button onClick={() => setShowBookmarks(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            {bookmarks.length === 0 ? (
              <p className="text-gray-400">No bookmarks yet</p>
            ) : (
              <div className="space-y-2">
                {bookmarks.map((bookmark, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      navigateToUrl(bookmark.url);
                      setShowBookmarks(false);
                    }}
                    className="p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700"
                  >
                    <p className="font-medium">{bookmark.title}</p>
                    <p className="text-sm text-gray-400 truncate">{bookmark.url}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading indicator */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 bg-blue-600 px-4 py-2 rounded-full text-sm z-40"
          >
            Loading...
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content - Full page */}
      <main className="flex-1">
        {isFrameBlocked ? (
          <div className="w-full h-[calc(100vh-3.5rem)] flex items-center justify-center bg-[#111827] px-6">
            <div className="max-w-xl text-center space-y-4">
              <h2 className="text-2xl font-bold">Page non disponible dans l&apos;application</h2>
              <p className="text-gray-300">
                Ce site bloque l&apos;affichage dans une iframe (erreur navigateur:
                {' '}<span className="font-mono">net::ERR_BLOCKED_BY_RESPONSE</span>).
              </p>
              <p className="text-gray-400 text-sm">
                URL: <span className="font-mono break-all">{currentUrl}</span>
              </p>
              <button
                onClick={openCurrentUrlExternally}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors"
              >
                Ouvrir dans un nouvel onglet
              </button>
            </div>
          </div>
        ) : (
          <iframe
            src={currentUrl}
            className="w-full h-[calc(100vh-3.5rem)] border-none bg-white"
            title={activeTab?.title || 'Browser'}
          />
        )}
      </main>
    </div>
  );
}
