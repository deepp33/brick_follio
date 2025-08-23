import { Search, User, Menu, LogOut, Map } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface HeaderProps {
  onSignUpClick: () => void;
  onDevelopersClick?: () => void;
  onMapViewClick?: () => void;
  isAuthenticated: boolean;
}

export function Header({ onSignUpClick, onDevelopersClick, onMapViewClick, isAuthenticated }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DI</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">DubaiInvest Pro</span>
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-900 hover:text-blue-600 transition-colors">
              Home
            </Link>
            {isAuthenticated && (
              <button 
                onClick={onMapViewClick}
                className="text-gray-700 hover:text-blue-600 transition-colors flex items-center"
              >
                <Map className="h-4 w-4 mr-1" />
                Map View
              </button>
            )}
            <Link to="/properties" className="text-gray-700 hover:text-blue-600 transition-colors">
              Properties
            </Link>
            <button 
              onClick={onDevelopersClick}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Developers
            </button>
            <Link to="/market-analytics" className="text-gray-700 hover:text-blue-600 transition-colors">
              Market Insights
            </Link>
            <a href="#resources" className="text-gray-700 hover:text-blue-600 transition-colors">
              Resources
            </a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contact
            </a>
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search properties..."
                  className="pl-10 w-64"
                />
              </div>
            </div>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>UI</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">User Account</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        user@example.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onMapViewClick}>
                    <Map className="mr-2 h-4 w-4" />
                    <span>Map View</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Preferences</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={onSignUpClick}>
                  Log In
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={onSignUpClick}>
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}