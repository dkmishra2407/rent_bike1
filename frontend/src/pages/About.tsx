import React, { useState } from 'react';
import { Users, Target, Globe, Github, Linkedin, Twitter, Award, Briefcase, Code, Coffee, Database, Server, Cloud, Brain, Link2 } from 'lucide-react';
import devansh from "../../assets/devansh.jpg"
import hitesh from "../../assets/hitesh.jpg"
function App() {
  const [activeTab, setActiveTab] = useState('team');
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  const stats = [
    { number: "50K+", label: "Active Users", icon: <Users className="h-6 w-6" /> },
    { number: "24/7", label: "Market Coverage", icon: <Globe className="h-6 w-6" /> },
    { number: "99.9%", label: "Uptime", icon: <Server className="h-6 w-6" /> },
    { number: "500M+", label: "Daily Transactions", icon: <Database className="h-6 w-6" /> }
  ];

  const achievements = [
    { year: "2023", title: "Forbes Fintech 50", description: "Recognized as one of the most innovative fintech companies" },
    { year: "2022", title: "Best Trading Platform", description: "Awarded by International Trading Awards" },
    { year: "2021", title: "Series B Funding", description: "$150M raised to expand global operations" },
    { year: "2020", title: "Company Launch", description: "Successfully launched with 10,000 beta users" }
  ];

  const team = [
    {
      name: "Devansh Mishra",
      role: "Founder & CEO",
      image: devansh,
      bio: "Student of pune institute of computer technologoy and a passionate developer. Worked on various projects in AI/ML and High-Frequency Trading.",
      expertise: [  "AI/ML","High-Frequency Trading", "Cloud Infrastructure"],
      social: {
        linkedin: "https://www.linkedin.com/in/devansh-mishra-903357295/",
        twitter: "#",
        github: "https://github.com/dkmishra2407"
      }
    },
    {
      name: "Hitesh Pawar",
      role: "CTO & Co-founder",
      image: hitesh,
      bio: "Ex-Google engineer specialized in algorithmic trading systems. Built scalable systems processing millions of transactions per second.",
      expertise: ["System Architecture", "High-Frequency Trading", "Cloud Infrastructure"],
      social:{
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    },
    {
      name: "David Park",
      role: "Lead Developer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      bio: "Full-stack developer with expertise in real-time trading platforms. Previously led development at Robinhood.",
      expertise: ["React/Node.js", "WebSocket", "Trading Systems"],
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    },
    {
      name: "Emily Watson",
      role: "Senior Developer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
      bio: "Security specialist focusing on blockchain and cryptocurrency. Built secure trading systems for major crypto exchanges.",
      expertise: ["Blockchain", "Cryptography", "Security"],
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    }
  ];

  const technologies = [
    { name: "Real-time Processing", icon: <Code className="h-6 w-6" />, description: "Sub-millisecond trade execution" },
    { name: "AI Trading Algorithms", icon: <Brain className="h-6 w-6" />, description: "Advanced predictive analytics" },
    { name: "Cloud Infrastructure", icon: <Cloud className="h-6 w-6" />, description: "Global distributed systems" },
    { name: "Blockchain Integration", icon: <Link2 className="h-6 w-6" />, description: "Secure transaction ledger" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              About GrowUp
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Empowering investors with cutting-edge technology and real-time market insights.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 ${
                hoveredStat === index ? 'scale-105 shadow-lg' : ''
              }`}
              onMouseEnter={() => setHoveredStat(index)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div className="flex items-center justify-center mb-4">
                <div className={`p-3 rounded-full ${
                  hoveredStat === index ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-500'
                }`}>
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-center text-gray-900">{stat.number}</h3>
              <p className="text-sm text-center text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Cards */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="bg-white rounded-xl shadow-md p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-blue-500 to-blue-600 text-white mb-4">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Our Mission</h3>
            <p className="mt-4 text-gray-600">
              To democratize stock trading by providing professional-grade tools and insights to investors of all levels.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-green-500 to-green-600 text-white mb-4">
              <Globe className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Global Reach</h3>
            <p className="mt-4 text-gray-600">
              Connected to major exchanges worldwide, offering diverse investment opportunities across global markets.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-purple-500 to-purple-600 text-white mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Our Team</h3>
            <p className="mt-4 text-gray-600">
              A dedicated team of financial experts, developers, and customer support professionals working to ensure your success.
            </p>
          </div>
        </div>
      </div>

      {/* Technologies Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 bg-white shadow-sm rounded-xl">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Technology Stack</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {technologies.map((tech, index) => (
            <div key={index} className="p-6 rounded-lg border-2 border-gray-100 hover:border-blue-500 transition-colors duration-300">
              <div className="flex items-center justify-center mb-4 text-blue-500">
                {tech.icon}
              </div>
              <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">{tech.name}</h3>
              <p className="text-sm text-center text-gray-600">{tech.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section with Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-4 mb-12">
          <button
            onClick={() => setActiveTab('team')}
            className={`px-6 py-2 rounded-full ${
              activeTab === 'team'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Our Team
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-6 py-2 rounded-full ${
              activeTab === 'achievements'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Achievements
          </button>
        </div>

        {activeTab === 'team' && (
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <div className="relative h-48">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-blue-600 mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Achievements</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.achievements.map((achievement, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                          {achievement}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <a href={member.social.linkedin} className="text-gray-600 hover:text-blue-600">
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a href={member.social.twitter} className="text-gray-600 hover:text-blue-400">
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a href={member.social.github} className="text-gray-600 hover:text-gray-900">
                      <Github className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 transform hover:scale-102 transition-transform duration-300">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <Award className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-blue-600">{achievement.year}</p>
                    <h3 className="text-lg font-semibold text-gray-900">{achievement.title}</h3>
                    <p className="mt-1 text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;