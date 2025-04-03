import React from 'react';
import { Users, Target, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About GrowUp</h1>
        <p className="text-xl text-gray-600">
          Empowering investors with cutting-edge technology and real-time market insights.
        </p>
      </div>

      <div className="grid gap-8 mb-12">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Target className="h-8 w-8 text-blue-600" />
            <h2 className="text-2xl font-semibold ml-3">Our Mission</h2>
          </div>
          <p className="text-gray-600">
            To democratize stock trading by providing professional-grade tools and insights to investors of all levels.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Globe className="h-8 w-8 text-blue-600" />
            <h2 className="text-2xl font-semibold ml-3">Global Reach</h2>
          </div>
          <p className="text-gray-600">
            Connected to major exchanges worldwide, offering diverse investment opportunities across global markets.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Users className="h-8 w-8 text-blue-600" />
            <h2 className="text-2xl font-semibold ml-3">Our Team</h2>
          </div>
          <p className="text-gray-600">
            A dedicated team of financial experts, developers, and customer support professionals working to ensure your success.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;