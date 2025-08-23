import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  Building2,
  MessageSquare,
  CheckCircle
} from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Layout>
      <div className="bg-gradient-to-br pt-6  pb-6 from-gray-50 to-gray-100">
        {/* Hero Section */}
        {/* <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Get in Touch
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Ready to start your real estate investment journey? Our expert team is here to help you make informed decisions and achieve your investment goals.
              </p>
            </div>
          </div>
        </section> */}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Contact Form */}
            <div className="space-y-6">
              <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center text-2xl font-semibold text-gray-900">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                    </div>
                    Send us a Message
                  </CardTitle>
                  <p className="text-gray-600 mt-2">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-green-600 mb-3">Message Sent Successfully!</h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Thank you for contacting us. We'll review your message and get back to you within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                            Full Name *
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="h-12 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="h-12 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                            Phone Number
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="h-12 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="+971 50 123 4567"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                            Subject *
                          </Label>
                          <Input
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                            className="h-12 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="What's this about?"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                          Message *
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={6}
                          className="px-4 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                          placeholder="Tell us about your investment goals, questions, or how we can help you..."
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Office Location */}
              <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl font-semibold text-gray-900">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    Our Office
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-gray-900">Dubai Investment Pro</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Sheikh Zayed Road<br />
                        Dubai, United Arab Emirates<br />
                        PO Box 12345
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-gray-900">Business Hours</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Sunday - Thursday: 8:00 AM - 6:00 PM<br />
                        Friday: 9:00 AM - 1:00 PM<br />
                        Saturday: Closed
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Methods */}
              <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Contact Methods
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Phone</h4>
                      <p className="text-gray-600">+971 4 123 4567</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Email</h4>
                      <p className="text-gray-600">info@dubaiinvestpro.ae</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">WhatsApp</h4>
                      <p className="text-gray-600">+971 50 123 4567</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-orange-100">
                <CardContent className="pt-8 pb-8">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                      <Phone className="h-8 w-8 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-800 text-lg mb-2">Emergency Contact</h4>
                      <p className="text-orange-700 text-sm mb-4">
                        For urgent matters outside business hours
                      </p>
                      <Button 
                        variant="outline" 
                        className="border-orange-300 text-orange-700 hover:bg-orange-200 hover:border-orange-400 font-medium"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20 mb-20">
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                  Frequently Asked Questions
                </CardTitle>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Find answers to common questions about our services and how we can help with your real estate investments.
                </p>
              </CardHeader>
              <CardContent className="space-y-8 px-8 pb-8">
                <div className="border-b border-gray-200 pb-6">
                  <h4 className="font-semibold text-lg text-gray-900 mb-3">What services do you offer?</h4>
                  <p className="text-gray-600 leading-relaxed">
                    We provide comprehensive real estate investment services including property analysis, 
                    market insights, investment calculators, personalized consultation, and portfolio management.
                  </p>
                </div>
                <div className="border-b border-gray-200 pb-6">
                  <h4 className="font-semibold text-lg text-gray-900 mb-3">How quickly do you respond to inquiries?</h4>
                  <p className="text-gray-600 leading-relaxed">
                    We typically respond to all inquiries within 24 hours during business days. 
                    For urgent matters, we have emergency contact options available.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-900 mb-3">Do you offer virtual consultations?</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Yes, we offer video consultations for clients who prefer remote meetings or are located outside Dubai. 
                    Our virtual consultations provide the same level of expertise and personalized service.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
