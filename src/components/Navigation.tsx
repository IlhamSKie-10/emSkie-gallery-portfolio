import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Navigation = ({ currentPage, onPageChange }: NavigationProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authState = sessionStorage.getItem('portfolioAuth');
    setIsAuthenticated(authState === 'true');
  }, [currentPage]);

  const handleLogout = () => {
    sessionStorage.removeItem('portfolioAuth');
    setIsAuthenticated(false);
    onPageChange('user');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border-glass">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Portfolio
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant={currentPage === 'user' ? 'default' : 'ghost'}
              onClick={() => onPageChange('user')}
              className={currentPage === 'user' ? 'luxury-button' : 'hover:bg-secondary/50'}
            >
              Gallery
            </Button>
            
            {isAuthenticated ? (
              <>
                <Button
                  variant={currentPage === 'admin' ? 'default' : 'ghost'}
                  onClick={() => onPageChange('admin')}
                  className={currentPage === 'admin' ? 'luxury-button' : 'hover:bg-secondary/50'}
                >
                  Admin
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="hover:bg-destructive/20 hover:text-destructive"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                onClick={() => onPageChange('admin')}
                className="hover:bg-secondary/50"
              >
                Admin
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};