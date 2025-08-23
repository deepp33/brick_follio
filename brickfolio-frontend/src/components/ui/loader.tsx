import React from 'react';
import { cn } from './utils';
import { Loader2, Building, Home, TrendingUp, MapPin, FileText, Users, BarChart3 } from 'lucide-react';

interface LoaderProps {
  variant?: 'default' | 'page' | 'card' | 'button' | 'inline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  icon?: 'default' | 'building' | 'home' | 'trending' | 'map' | 'file' | 'users' | 'chart';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
};

const iconMap = {
  default: Loader2,
  building: Building,
  home: Home,
  trending: TrendingUp,
  map: MapPin,
  file: FileText,
  users: Users,
  chart: BarChart3
};

export function Loader({ 
  variant = 'default', 
  size = 'md', 
  text, 
  icon = 'default',
  className 
}: LoaderProps) {
  const IconComponent = iconMap[icon];
  const isSpinning = icon === 'default';

  const variants = {
    default: (
      <div className={cn("flex items-center justify-center", className)}>
        <IconComponent className={cn(
          sizeClasses[size], 
          "text-blue-600",
          isSpinning && "animate-spin"
        )} />
        {text && <span className="ml-2 text-gray-600">{text}</span>}
      </div>
    ),
    
    page: (
      <div className={cn("min-h-screen bg-gray-50 flex items-center justify-center", className)}>
        <div className="text-center">
          <div className="relative">
            <IconComponent className={cn(
              sizeClasses.xl, 
              "text-blue-600 mx-auto mb-4",
              isSpinning && "animate-spin"
            )} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {text || 'Loading...'}
          </h3>
          <p className="text-gray-500">Please wait while we fetch your data</p>
        </div>
      </div>
    ),
    
    card: (
      <div className={cn("flex flex-col items-center justify-center p-8 bg-white rounded-lg border", className)}>
        <IconComponent className={cn(
          sizeClasses.lg, 
          "text-blue-600 mb-3",
          isSpinning && "animate-spin"
        )} />
        <p className="text-sm text-gray-600">{text || 'Loading...'}</p>
      </div>
    ),
    
    button: (
      <div className={cn("flex items-center", className)}>
        <IconComponent className={cn(
          sizeClasses.sm, 
          "animate-spin text-current"
        )} />
        {text && <span className="ml-2">{text}</span>}
      </div>
    ),
    
    inline: (
      <div className={cn("flex items-center space-x-2", className)}>
        <IconComponent className={cn(
          sizeClasses[size], 
          "text-blue-600",
          isSpinning && "animate-spin"
        )} />
        {text && <span className="text-gray-600">{text}</span>}
      </div>
    )
  };

  return variants[variant];
}

// Specialized loaders for different contexts
export function PageLoader({ text, icon, className }: Omit<LoaderProps, 'variant'>) {
  return <Loader variant="page" text={text} icon={icon} className={className} />;
}

export function CardLoader({ text, icon, className }: Omit<LoaderProps, 'variant'>) {
  return <Loader variant="card" text={text} icon={icon} className={className} />;
}

export function ButtonLoader({ text, className }: Omit<LoaderProps, 'variant' | 'icon'>) {
  return <Loader variant="button" text={text} className={className} />;
}

export function InlineLoader({ text, icon, size, className }: Omit<LoaderProps, 'variant'>) {
  return <Loader variant="inline" text={text} icon={icon} size={size} className={className} />;
}

// Skeleton loaders for content
export function SkeletonLoader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("bg-gray-200 animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <SkeletonLoader className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <SkeletonLoader className="h-4 w-3/4" />
        <SkeletonLoader className="h-3 w-1/2" />
        <div className="flex space-x-2">
          <SkeletonLoader className="h-6 w-16 rounded-full" />
          <SkeletonLoader className="h-6 w-20 rounded-full" />
        </div>
        <div className="flex justify-between items-center">
          <SkeletonLoader className="h-4 w-20" />
          <SkeletonLoader className="h-8 w-24 rounded" />
        </div>
      </div>
    </div>
  );
}

export function NewsCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <SkeletonLoader className="h-32 w-full" />
      <div className="p-4 space-y-3">
        <SkeletonLoader className="h-4 w-full" />
        <SkeletonLoader className="h-3 w-3/4" />
        <div className="flex justify-between items-center">
          <SkeletonLoader className="h-3 w-20" />
          <SkeletonLoader className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function DeveloperCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4 mb-4">
        <SkeletonLoader className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <SkeletonLoader className="h-4 w-3/4" />
          <SkeletonLoader className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <SkeletonLoader className="h-3 w-full" />
        <SkeletonLoader className="h-3 w-2/3" />
      </div>
      <div className="flex justify-between items-center mt-4">
        <SkeletonLoader className="h-6 w-20 rounded-full" />
        <SkeletonLoader className="h-8 w-24 rounded" />
      </div>
    </div>
  );
}
