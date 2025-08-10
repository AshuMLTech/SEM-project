import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Target, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const location = useLocation();

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SEM Plan Builder
            </span>
          </Link>

          <nav className="flex items-center space-x-4">
            <Button
              variant={location.pathname === '/' ? 'default' : 'ghost'}
              asChild
            >
              <Link to="/">
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button
              variant={location.pathname === '/create' ? 'default' : 'ghost'}
              asChild
            >
              <Link to="/create">
                <Search className="h-4 w-4 mr-2" />
                Create Plan
              </Link>
            </Button>
            <Button
              variant={location.pathname === '/plans' ? 'default' : 'ghost'}
              asChild
            >
              <Link to="/plans">
                View Plans
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
