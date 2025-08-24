import { Button } from './ui/button';
import { ArrowRight, TrendingUp, Shield, MapPin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  onGetStartedClick: () => void;
}

export function HeroSection({ onGetStartedClick }: HeroSectionProps) {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Invest Smarter in</span>{' '}
                <span className="block text-blue-600 xl:inline">Dubai's Real Estate</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Make informed investment decisions with AI-powered insights, comprehensive market data, and transparent developer ratings. Your gateway to Dubai's most promising properties.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Button size="lg" className="w-full flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700" onClick={onGetStartedClick}>
                    Start Your Investment Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                {/* <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link to="/properties">
                  <Button variant="outline" size="lg" className="w-full flex items-center justify-center px-8 py-3">
                    Explore Properties
                  </Button>
                  </Link>
                </div> */}
              </div>

              {/* Trust indicators */}
              <div className="mt-8 lg:mt-12">
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-green-500 mr-2" />
                    RERA Verified
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                    AI-Powered Insights
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-purple-500 mr-2" />
                    Interactive Maps
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <ImageWithFallback
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://images.unsplash.com/photo-1609764465693-a2dc6c6f7dbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEdWJhaSUyMHNreWxpbmUlMjBtb2Rlcm4lMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzU1OTQxOTAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Dubai skyline showcasing modern architecture and investment opportunities"
        />
      </div>
    </div>
  );
}