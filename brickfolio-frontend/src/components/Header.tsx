import { Search, User, Menu, LogOut, Map } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import type { RootState } from '../store';
import { getCurrentUser } from '../features/auth/authSlice';
import { useAppDispatch } from '../hooks/redux';
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
import { useAppSelector } from '../hooks/redux';


interface HeaderProps {
  onSignUpClick: () => void;
  onDevelopersClick?: () => void;
  onMapViewClick?: () => void;
  isAuthenticated: boolean;
}

export function Header({ onSignUpClick, onDevelopersClick, onMapViewClick, isAuthenticated }: HeaderProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  // Fetch user data if authenticated but user data is not loaded
  // useEffect(() => {
  //   if (isAuthenticated && !user && !loading) {
  //     dispatch(getCurrentUser());
  //   }
  // }, [isAuthenticated, user, loading, dispatch]);

  const handleLogout = () => {
    // Remove authToken from localStorage
    localStorage.removeItem('authToken');
    
    // Refresh the page and redirect to homepage
    window.location.href = '/';
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-32 h-12  rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="522" height="168" viewBox="0 0 522 168" fill="none">
<path d="M158 67.2804V167.743H145.196V73.2194L78.879 16.8369L12.8039 73.2119V155.172H37.6434V168H0V67.2874L78.8645 0L158 67.2804Z" fill="#001A28"/>
<path d="M48.9109 123.615H68.3728V167.743H48.9109V123.615Z" fill="#2662F3"/>
<path d="M80.6645 101.55H100.126V167.743H80.6645V101.55Z" fill="#2662F3"/>
<path d="M113.442 78.4599H132.904V167.743H113.442V78.4599Z" fill="#2662F3"/>
<path d="M192.961 122V70.6711H214.595C217.994 70.6711 220.887 71.2683 223.276 72.4625C225.71 73.6108 227.57 75.2643 228.856 77.4231C230.188 79.536 230.854 82.1082 230.854 85.1397C230.854 87.4822 230.211 89.6869 228.925 91.7539C227.685 93.7749 225.687 95.4514 222.931 96.7834V92.4429C225.457 93.4074 227.455 94.6016 228.925 96.0255C230.395 97.4494 231.429 99.0341 232.026 100.779C232.623 102.525 232.921 104.362 232.921 106.291C232.921 111.206 231.291 115.064 228.03 117.866C224.814 120.622 220.336 122 214.595 122H192.961ZM202.331 113.732H215.559C217.994 113.732 219.923 113.066 221.347 111.734C222.816 110.356 223.551 108.542 223.551 106.291C223.551 104.041 222.816 102.226 221.347 100.848C219.923 99.4704 217.994 98.7814 215.559 98.7814H202.331V113.732ZM202.331 90.5826H215.077C217.006 90.5826 218.545 90.0314 219.693 88.9291C220.841 87.7808 221.415 86.3109 221.415 84.5196C221.415 82.7283 220.841 81.3044 219.693 80.2479C218.545 79.1915 217.006 78.6633 215.077 78.6633H202.331V90.5826ZM239.839 122V84.5196H248.314V92.8562L247.625 91.6161C248.497 88.8142 249.852 86.8621 251.69 85.7598C253.573 84.6574 255.823 84.1062 258.442 84.1062H260.646V92.0984H257.408C254.836 92.0984 252.769 92.9022 251.207 94.5098C249.646 96.0715 248.865 98.2762 248.865 101.124V122H239.839ZM265.609 122V84.5196H274.634V122H265.609ZM265.609 80.3168V70.6711H274.634V80.3168H265.609ZM301.019 122.827C297.298 122.827 293.945 121.977 290.96 120.278C288.02 118.532 285.7 116.19 284.001 113.25C282.302 110.264 281.452 106.911 281.452 103.191C281.452 99.4704 282.302 96.1404 284.001 93.2007C285.7 90.2611 288.02 87.9415 290.96 86.242C293.945 84.5426 297.298 83.6928 301.019 83.6928C303.683 83.6928 306.163 84.1751 308.46 85.1397C310.756 86.0583 312.731 87.3444 314.385 88.998C316.084 90.6056 317.302 92.5347 318.036 94.7854L310.113 98.2303C309.424 96.3471 308.253 94.8313 306.599 93.683C304.992 92.5347 303.132 91.9606 301.019 91.9606C299.044 91.9606 297.275 92.4429 295.714 93.4074C294.198 94.372 293.004 95.704 292.131 97.4035C291.258 99.103 290.822 101.055 290.822 103.26C290.822 105.465 291.258 107.417 292.131 109.116C293.004 110.816 294.198 112.148 295.714 113.112C297.275 114.077 299.044 114.559 301.019 114.559C303.178 114.559 305.061 113.985 306.668 112.837C308.276 111.688 309.424 110.15 310.113 108.22L318.036 111.803C317.302 113.916 316.107 115.822 314.454 117.522C312.8 119.175 310.825 120.484 308.529 121.449C306.232 122.367 303.729 122.827 301.019 122.827ZM324.885 122V69.8444H333.91V104.018L330.466 102.984L348.103 84.5196H359.334L345.485 99.6082L359.609 122H349.275L337.011 102.571L342.385 101.468L331.086 113.594L333.91 108.083V122H324.885ZM365.407 122V70.6711H399.649V78.9389H374.777V93.1318H396.549V101.4H374.777V122H365.407ZM422.538 122.827C418.864 122.827 415.511 121.977 412.479 120.278C409.494 118.578 407.105 116.259 405.314 113.319C403.568 110.379 402.696 107.026 402.696 103.26C402.696 99.4934 403.568 96.1404 405.314 93.2007C407.105 90.2611 409.494 87.9415 412.479 86.242C415.465 84.5426 418.818 83.6928 422.538 83.6928C426.213 83.6928 429.543 84.5426 432.528 86.242C435.514 87.9415 437.88 90.2611 439.625 93.2007C441.416 96.0944 442.312 99.4475 442.312 103.26C442.312 107.026 441.416 110.379 439.625 113.319C437.834 116.259 435.445 118.578 432.46 120.278C429.474 121.977 426.167 122.827 422.538 122.827ZM422.538 114.559C424.559 114.559 426.328 114.077 427.843 113.112C429.405 112.148 430.622 110.816 431.495 109.116C432.414 107.371 432.873 105.419 432.873 103.26C432.873 101.055 432.414 99.1259 431.495 97.4724C430.622 95.7729 429.405 94.4409 427.843 93.4763C426.328 92.4658 424.559 91.9606 422.538 91.9606C420.471 91.9606 418.657 92.4658 417.095 93.4763C415.534 94.4409 414.294 95.7729 413.375 97.4724C412.502 99.1259 412.066 101.055 412.066 103.26C412.066 105.419 412.502 107.371 413.375 109.116C414.294 110.816 415.534 112.148 417.095 113.112C418.657 114.077 420.471 114.559 422.538 114.559ZM449.157 122V69.8444H458.182V122H449.157ZM466.516 122V84.5196H475.541V122H466.516ZM466.516 80.3168V70.6711H475.541V80.3168H466.516ZM502.201 122.827C498.527 122.827 495.174 121.977 492.142 120.278C489.157 118.578 486.768 116.259 484.977 113.319C483.231 110.379 482.359 107.026 482.359 103.26C482.359 99.4934 483.231 96.1404 484.977 93.2007C486.768 90.2611 489.157 87.9415 492.142 86.242C495.128 84.5426 498.481 83.6928 502.201 83.6928C505.876 83.6928 509.206 84.5426 512.192 86.242C515.177 87.9415 517.543 90.2611 519.288 93.2007C521.079 96.0944 521.975 99.4475 521.975 103.26C521.975 107.026 521.079 110.379 519.288 113.319C517.497 116.259 515.108 118.578 512.123 120.278C509.137 121.977 505.83 122.827 502.201 122.827ZM502.201 114.559C504.222 114.559 505.991 114.077 507.506 113.112C509.068 112.148 510.285 110.816 511.158 109.116C512.077 107.371 512.536 105.419 512.536 103.26C512.536 101.055 512.077 99.1259 511.158 97.4724C510.285 95.7729 509.068 94.4409 507.506 93.4763C505.991 92.4658 504.222 91.9606 502.201 91.9606C500.134 91.9606 498.32 92.4658 496.758 93.4763C495.197 94.4409 493.957 95.7729 493.038 97.4724C492.165 99.1259 491.729 101.055 491.729 103.26C491.729 105.419 492.165 107.371 493.038 109.116C493.957 110.816 495.197 112.148 496.758 113.112C498.32 114.077 500.134 114.559 502.201 114.559Z" fill="black"/>
</svg>
                </div>
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
            <button 
              onClick={onDevelopersClick}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Developers
            </button>
            <Link to="/market-analytics" className="text-gray-700 hover:text-blue-600 transition-colors">
              Market Insights
            </Link>
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
          
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name || 'User Account'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onMapViewClick}>
                    <Map className="mr-2 h-4 w-4" />
                    <span>Map View</span>
                  </DropdownMenuItem>
                                     <DropdownMenuItem onClick={handleProfileClick}>
                     <User className="mr-2 h-4 w-4" />
                     <span>Profile</span>
                   </DropdownMenuItem>
                   <DropdownMenuItem>
                     <span>Preferences</span>
                   </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
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