import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { getCurrentUser } from '../features/auth/authSlice';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { User, Mail, MapPin, Building, Calendar, Edit, Save, X, Heart, Home, Settings, Star, TrendingUp } from 'lucide-react';

export default function UserProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'favourites'>('profile');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('default');
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    country: '',
    city: ''
  });

  // Dummy properties data for favourites - matching ProjectsList structure
  const dummyProperties = [
    {
      _id: '1',
      projectName: "Luxury Downtown Apartment",
      location: "Downtown, City Center",
      price: { formatted: "AED 3.2M" },
      category: ["Luxury"],
      images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop"],
      developer: "Premium Developers Ltd",
      roi: 8.5,
      rentalYield: 6.8,
      rating: 4.5,
      constructionProgress: 75,
      handoverDate: "2025-06-15",
      completion: { quarter: "Q2", year: "2025" },
      unitsAvailable: "30/120"
    },
    {
      _id: '2',
      projectName: "Modern Waterfront Condo",
      location: "Harbor District",
      price: { formatted: "AED 4.5M" },
      category: ["Luxury"],
      images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"],
      developer: "Ocean View Properties",
      roi: 9.2,
      rentalYield: 7.1,
      rating: 4.8,
      constructionProgress: 60,
      handoverDate: "2025-09-20",
      completion: { quarter: "Q3", year: "2025" },
      unitsAvailable: "45/200"
    },
    {
      _id: '3',
      projectName: "Family Townhouse",
      location: "Suburban Heights",
      price: { formatted: "AED 2.4M" },
      category: ["Residential"],
      images: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop"],
      developer: "Family Homes Inc",
      roi: 7.8,
      rentalYield: 5.9,
      rating: 4.3,
      constructionProgress: 90,
      handoverDate: "2025-03-10",
      completion: { quarter: "Q1", year: "2025" },
      unitsAvailable: "15/80"
    },
    {
      _id: '4',
      projectName: "Penthouse Suite",
      location: "Skyline Tower",
      price: { formatted: "AED 9.2M" },
      category: ["Luxury"],
      images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"],
      developer: "Luxury Estates",
      roi: 10.5,
      rentalYield: 8.2,
      rating: 4.9,
      constructionProgress: 45,
      handoverDate: "2025-12-05",
      completion: { quarter: "Q4", year: "2025" },
      unitsAvailable: "8/50"
    },
    {
      _id: '5',
      projectName: "Commercial Plaza",
      location: "Business District",
      price: { formatted: "AED 6.8M" },
      category: ["Commercial"],
      images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop"],
      developer: "Commercial Developers",
      roi: 12.1,
      rentalYield: 9.5,
      rating: 4.6,
      constructionProgress: 30,
      handoverDate: "2026-02-15",
      completion: { quarter: "Q1", year: "2026" },
      unitsAvailable: "12/40"
    },
    {
      _id: '6',
      projectName: "Garden Apartments",
      location: "Green Valley",
      price: { formatted: "AED 1.8M" },
      category: ["Residential"],
      images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop"],
      developer: "Green Valley Properties",
      roi: 6.9,
      rentalYield: 5.2,
      rating: 4.2,
      constructionProgress: 85,
      handoverDate: "2025-05-20",
      completion: { quarter: "Q2", year: "2025" },
      unitsAvailable: "60/150"
    }
  ];

  // Check authentication
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/');
      return;
    }

    // Fetch current user data if not already loaded
    // if (!user) {
    //   dispatch(getCurrentUser());
    // }
  }, [dispatch, navigate]);

  // Initialize edit form when user data is loaded
  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        country: user.country || '',
        city: user.city || ''
      });
    }
  }, [user]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving profile:', editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form to original values
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        country: user.country || '',
        city: user.city || ''
      });
    }
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Filter functions for favourites
  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  const handleLocationFilter = (location: string) => {
    setLocationFilter(location);
  };

  const handleSort = (sortType: string) => {
    setSortBy(sortType);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setLocationFilter('');
    setSortBy('default');
  };

  // Filter and sort properties
  const filteredProperties = dummyProperties.filter(property => {
    const matchesCategory = selectedCategory === 'all' || 
      property.category?.some(cat => cat.toLowerCase() === selectedCategory.toLowerCase());
    const matchesLocation = !locationFilter || 
      property.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesCategory && matchesLocation;
  });

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'roi-desc':
        return (b.roi || 0) - (a.roi || 0);
      case 'roi-asc':
        return (a.roi || 0) - (b.roi || 0);
      case 'price-desc':
        return parseFloat(b.price?.formatted?.replace(/[^\d.]/g, '') || '0') - 
               parseFloat(a.price?.formatted?.replace(/[^\d.]/g, '') || '0');
      case 'price-asc':
        return parseFloat(a.price?.formatted?.replace(/[^\d.]/g, '') || '0') - 
               parseFloat(b.price?.formatted?.replace(/[^\d.]/g, '') || '0');
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <Layout isAuthenticated={true}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout isAuthenticated={true}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600">Error: {error}</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Go Home
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout isAuthenticated={true}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-gray-600">No user data found</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Go Home
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isAuthenticated={true}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Navigation</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <nav className="space-y-1">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                        activeTab === 'profile'
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <User className="h-5 w-5 mr-3" />
                      <span className="font-medium">User Profile</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('favourites')}
                      className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                        activeTab === 'favourites'
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Heart className="h-5 w-5 mr-3" />
                      <span className="font-medium">Favourites</span>
                    </button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'profile' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Profile Card */}
                  <div className="lg:col-span-1">
                    <Card>
                      <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                          <Avatar className="h-24 w-24">
                            <AvatarFallback className="text-2xl">
                              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <CardTitle className="text-xl">{user.name}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                        <div className="mt-4">
                          <Badge variant={user.role === 'Developer' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="h-4 w-4 mr-2" />
                            <span>{user.name}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            <span>{user.email}</span>
                          </div>
                          {user.country && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{user.country}</span>
                            </div>
                          )}
                          {user.city && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Building className="h-4 w-4 mr-2" />
                              <span>{user.city}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Edit Profile Form */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                              Update your personal information and preferences
                            </CardDescription>
                          </div>
                          {!isEditing ? (
                            <Button onClick={handleEditToggle} variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Profile
                            </Button>
                          ) : (
                            <div className="flex space-x-2">
                              <Button onClick={handleSave} size="sm">
                                <Save className="h-4 w-4 mr-2" />
                                Save
                              </Button>
                              <Button onClick={handleCancel} variant="outline" size="sm">
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Full Name</Label>
                              <Input
                                id="name"
                                value={editForm.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                disabled={!isEditing}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                value={editForm.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                disabled={!isEditing}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="country">Country</Label>
                              <Input
                                id="country"
                                value={editForm.country}
                                onChange={(e) => handleInputChange('country', e.target.value)}
                                disabled={!isEditing}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="city">City</Label>
                              <Input
                                id="city"
                                value={editForm.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                disabled={!isEditing}
                              />
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Account Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Account Type</Label>
                                <div className="flex items-center space-x-2">
                                  <Badge variant={user.role === 'Developer' ? 'default' : 'secondary'}>
                                    {user.role}
                                  </Badge>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Member Since</Label>
                                <div className="flex items-center text-sm text-gray-600">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  <span>Recently joined</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                             ) : (
                 /* Favourites Section */
                 <div className="space-y-6">
                   <div className="flex items-center justify-between">
                     <div>
                       <h2 className="text-2xl font-bold text-gray-900">Favourites</h2>
                       <p className="text-gray-600 mt-1">Your saved properties</p>
                     </div>
                     <Badge variant="outline" className="text-sm">
                       {sortedProperties.length} properties
                     </Badge>
                   </div>

                   {/* Filters */}
                   <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
                     <div className="flex flex-col space-y-2">
                       <label className="text-sm font-medium">Category</label>
                       <Select value={selectedCategory} onValueChange={handleCategoryFilter}>
                         <SelectTrigger className="w-[180px]">
                           <SelectValue placeholder="Select category" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="all">All Categories</SelectItem>
                           <SelectItem value="Luxury">Luxury</SelectItem>
                           <SelectItem value="Residential">Residential</SelectItem>
                           <SelectItem value="Commercial">Commercial</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>

                     <div className="flex flex-col space-y-2">
                       <label className="text-sm font-medium">Location</label>
                       <Input
                         placeholder="Filter by location..."
                         value={locationFilter}
                         onChange={(e) => handleLocationFilter(e.target.value)}
                         className="w-[200px]"
                       />
                     </div>

                     <div className="flex flex-col space-y-2">
                       <label className="text-sm font-medium">Sort By</label>
                       <Select value={sortBy} onValueChange={handleSort}>
                         <SelectTrigger className="w-[180px]">
                           <SelectValue placeholder="Sort by..." />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="default">Default</SelectItem>
                           <SelectItem value="roi-desc">ROI (High to Low)</SelectItem>
                           <SelectItem value="roi-asc">ROI (Low to High)</SelectItem>
                           <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                           <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>

                     <div className="flex flex-col space-y-2">
                       <label className="text-sm font-medium">Actions</label>
                       <Button 
                         variant="outline" 
                         onClick={handleResetFilters}
                         className="w-[180px]"
                       >
                         Clear Filters
                       </Button>
                     </div>
                   </div>

                   {/* Projects Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                     {sortedProperties.map((project) => (
                       <Card key={project._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                         <div className="relative">
                           <img
                             src={project.images?.[0] || '/placeholder-project.jpg'}
                             alt={project.projectName}
                             className="w-full h-48 object-cover"
                             onError={(e) => {
                               // Fallback to a placeholder if image fails to load
                               const target = e.target as HTMLImageElement;
                               target.src = 'https://via.placeholder.com/400x300?text=Project+Image';
                             }}
                           />
                           <div className="absolute top-4 left-4">
                             <Badge variant="secondary" className="bg-white/90 text-gray-900">
                               {project.category?.[0] || 'Premium'}
                             </Badge>
                           </div>
                           <div className="absolute top-4 right-4">
                             <div className="flex items-center bg-white/90 rounded-full px-2 py-1">
                               <Star className="h-4 w-4 text-yellow-500 fill-current" />
                               <span className="ml-1 text-sm font-medium">{project.rating || 4.5}</span>
                             </div>
                           </div>
                           <div className="absolute bottom-4 right-4">
                             <Badge variant="secondary" className="bg-black/70 text-white">
                               {project.constructionProgress}% Complete
                             </Badge>
                           </div>
                           {/* <div className="absolute top-3 left-3">
                             <Button size="sm" variant="destructive" className="h-8 w-8 p-0">
                               <Heart className="h-4 w-4" />
                             </Button>
                           </div> */}
                         </div>

                         <CardContent className="p-6">
                           <div className="flex items-start justify-between mb-3">
                             <div className="flex-1">
                               <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                 {project.projectName}
                               </h3>
                               <div className="flex items-center text-gray-600 mb-2">
                                 <MapPin className="h-4 w-4 mr-1" />
                                 <span className="text-sm">{project.location}</span>
                               </div>
                             </div>
                           </div>

                           <div className="grid grid-cols-2 gap-4 mb-4">
                             <div className="text-center p-3 bg-blue-50 rounded-lg">
                               <div className="text-lg font-bold text-blue-600">{project.roi || 8.5}%</div>
                               <div className="text-xs text-gray-600">ROI</div>
                             </div>
                             <div className="text-center p-3 bg-green-50 rounded-lg">
                               <div className="text-lg font-bold text-green-600">{project.rentalYield || 6.8}%</div>
                               <div className="text-xs text-gray-600">Rental Yield</div>
                             </div>
                           </div>

                           <div className="flex items-center justify-between mb-4">
                             <div className="text-2xl font-bold text-gray-900">
                               {project.price?.formatted || 'AED 2.2M'}
                             </div>
                             <div className="flex items-center text-green-600">
                               <TrendingUp className="h-4 w-4 mr-1" />
                               <span className="text-sm font-medium">+12.5%</span>
                             </div>
                           </div>

                           <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                             <div className="flex items-center">
                               <Calendar className="h-4 w-4 mr-1" />
                               <span>Handover: {project.handoverDate ? new Date(project.handoverDate).toLocaleDateString() : `${project.completion?.quarter || 'Q4'} ${project.completion?.year || '2025'}`}</span>
                             </div>
                             <div>
                               <span className="font-medium">{project.unitsAvailable || '30/120'}</span> units
                             </div>
                           </div>

                           <Button 
                             className="w-full" 
                             onClick={() => navigate(`/developer/${project.developer}`)}
                           >
                             View Details
                           </Button>
                         </CardContent>
                       </Card>
                     ))}
                   </div>

                   {sortedProperties.length === 0 && (
                     <div className="text-center py-8">
                       <p className="text-gray-500">No favourite properties found.</p>
                     </div>
                   )}
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
