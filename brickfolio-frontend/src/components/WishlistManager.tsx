import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { 
  getWishlistByUserId, 
  addToWishlist, 
  removeFromWishlist 
} from '../features/wishlist/wishlistSlice';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Trash2, Heart } from 'lucide-react';

export function WishlistManager() {
  const dispatch = useAppDispatch();
  const { wishlist, loading, error } = useAppSelector((state) => state.wishlist);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user?._id) {
      dispatch(getWishlistByUserId(user._id));
    }
  }, [dispatch, user?._id]);

  const handleRemoveFromWishlist = (wishlistId: string) => {
    dispatch(removeFromWishlist(wishlistId));
  };

  const handleAddToWishlist = (targetId: string, targetModel: 'Project' | 'Developer') => {
    if (user?._id) {
      dispatch(addToWishlist({
        investor: user._id,
        targetId,
        targetModel
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading wishlist...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Please log in to view your wishlist</p>
          <Button>Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Wishlist</h2>
        <Badge variant="secondary">{wishlist.length} items</Badge>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-4">
            Start adding projects and developers to your wishlist to track your favorites.
          </p>
          <Button>Browse Projects</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <Card key={item._id} className="hover:shadow-lg transition-shadow">
              {item.target?.images && item.target.images.length > 0 && (
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={item.target.images[0]}
                    alt={item.targetModel === 'Project' ? item.target.projectName : item.target.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant="outline">
                    {item.targetModel}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFromWishlist(item._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-lg">
                  {item.targetModel === 'Project' 
                    ? item.target?.projectName 
                    : item.target?.name || 'Unknown'
                  }
                </CardTitle>
                {item.targetModel === 'Project' && item.target && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">ROI:</span>
                      <span className="font-medium">{item.target.roi}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Rental Yield:</span>
                      <span className="font-medium">{item.target.rentalYield}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">{item.target.price?.formatted}</span>
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {item.targetModel === 'Project' && item.target && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.target.description}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {item.target.category?.slice(0, 3).map((cat: string) => (
                        <Badge key={cat} variant="secondary" className="text-xs">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{item.target.location}</span>
                      <span>Added {new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
                {item.targetModel === 'Developer' && item.target && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.target.description || 'Developer profile'}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{item.target.location || 'Location not specified'}</span>
                      <span>Added {new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
                <Button className="w-full mt-4">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

