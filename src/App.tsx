import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { UserPage } from "@/components/UserPage";
import { AdminPage } from "@/components/AdminPage";

const queryClient = new QueryClient();

const App = () => {
  const [currentPage, setCurrentPage] = useState('user');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication state
    const authState = sessionStorage.getItem('portfolioAuth');
    setIsAuthenticated(authState === 'true');

    // Handle hash routing
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'user';
      setCurrentPage(hash);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handlePageChange = (page: string) => {
    window.location.hash = page;
    setCurrentPage(page);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('admin');
    window.location.hash = 'admin';
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen">
          <Navigation 
            currentPage={currentPage} 
            onPageChange={handlePageChange}
          />
          
          {currentPage === 'user' && <UserPage />}
          {currentPage === 'admin' && (
            <AdminPage 
              isAuthenticated={isAuthenticated}
              onLogin={handleLogin}
            />
          )}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
