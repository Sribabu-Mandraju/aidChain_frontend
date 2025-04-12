import React from 'react';
import { Shield, Zap, BarChart3, Award, Heart, Globe2, Users, Target, Clock, HandHeart, Lightbulb, Trophy } from 'lucide-react';

function About() {
  const features = [
    {
      icon: <Shield className="w-6 h-6 text-white" />,
      title: "Easy Onboarding",
      description: "Victims can onboard easily using a smart wallet that requires no gas fees."
    },
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      title: "Transparent Donations",
      description: "Donors can contribute to specific disaster events and see exactly where their funds go."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      title: "Complete Traceability",
      description: "Every donation is traceable, and every transaction is recorded on-chain for complete accountability."
    },
    {
      icon: <Award className="w-6 h-6 text-white" />,
      title: "NFT Recognition",
      description: "As a small token of appreciation, donors receive a custom NFT badge recognizing their contribution."
    }
  ];

  const impactStats = [
    {
      icon: <Heart className="w-8 h-8 text-emerald-500" />,
      number: "50,000+",
      label: "Lives Touched",
      description: "Direct impact through our initiatives"
    },
    {
      icon: <Globe2 className="w-8 h-8 text-emerald-500" />,
      number: "25+",
      label: "Countries",
      description: "Global reach and presence"
    },
    {
      icon: <Users className="w-8 h-8 text-emerald-500" />,
      number: "10,000+",
      label: "Active Donors",
      description: "Growing community of supporters"
    }
  ];

  const milestones = [
    {
      year: "2021",
      title: "Project Inception",
      description: "AidChain was born from a vision to revolutionize disaster relief."
    },
    {
      year: "2022",
      title: "First Deployment",
      description: "Successfully deployed our first aid distribution system."
    },
    {
      year: "2023",
      title: "Global Expansion",
      description: "Extended our reach to 25+ countries worldwide."
    },
    {
      year: "2024",
      title: "Blockchain Integration",
      description: "Implemented full blockchain-based transparency."
    }
  ];

  const values = [
    {
      icon: <Target className="w-6 h-6 text-emerald-500" />,
      title: "Transparency",
      description: "We believe in complete openness in all our operations."
    },
    {
      icon: <Clock className="w-6 h-6 text-emerald-500" />,
      title: "Speed",
      description: "Quick response when every minute counts."
    },
    {
      icon: <HandHeart className="w-6 h-6 text-emerald-500" />,
      title: "Compassion",
      description: "Empathy drives every decision we make."
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-emerald-500" />,
      title: "Innovation",
      description: "Using technology to maximize impact."
    }
  ];

  const team = [
    {
      name: "Nandeesh",
      role: "Team Lead",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Sri Babu",
      role: "Blockchain Developer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Umesh Chandra",
      role: "Frontend Engineer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Bhanu Teja",
      role: "Smart Contract Specialist",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    }
  ];

  const recognitions = [
    {
      icon: <Trophy className="w-8 h-8 text-emerald-500" />,
      title: "Best Social Impact Project 2023",
      organization: "Global Blockchain Summit"
    },
    {
      icon: <Award className="w-8 h-8 text-emerald-500" />,
      title: "Innovation in Aid Distribution",
      organization: "Tech for Good Awards"
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 to-white"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-8">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">AidChain</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Revolutionizing disaster relief through blockchain technology, ensuring every donation reaches those who need it most.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1593113598332-cd59a0c3a9a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Our Mission" 
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="text-white text-2xl font-bold">Building a Better Tomorrow</div>
                </div>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center px-4 py-1.5 bg-emerald-100 rounded-full mb-6">
                <span className="text-emerald-600 font-medium text-sm">Our Mission</span>
              </div>
              <h2 className="text-3xl font-bold mb-6">Empowering Communities Through Technology</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                At AidChain, we believe that technology can bridge the gap between generosity and impact. Our mission is to create a world where aid reaches those in need swiftly and transparently, powered by blockchain technology.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Secure & Transparent</h3>
                    <p className="text-gray-600">Every transaction is recorded and traceable</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Instant Impact</h3>
                    <p className="text-gray-600">Aid reaches beneficiaries without delays</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Globe2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Global Reach</h3>
                    <p className="text-gray-600">Supporting communities worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Through the power of blockchain technology and community support, we've made a real difference in people's lives.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {impactStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  {stat.icon}
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-lg font-semibold text-emerald-600 mb-2">{stat.label}</div>
                  <div className="text-gray-600">{stat.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From inception to impact, follow our path of innovation and growth.
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-emerald-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div className="inline-flex items-center px-3 py-1 bg-emerald-100 rounded-full mb-2">
                      <span className="text-emerald-600 font-medium text-sm">{milestone.year}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full border-4 border-emerald-200 bg-white"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The principles that guide our mission and shape our impact.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="bg-emerald-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our innovative approach to disaster relief combines blockchain technology with humanitarian aid.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="h-2 bg-gradient-to-r from-emerald-500 to-green-500"></div>
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Passionate individuals working together to make a difference.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group">
                <div className="relative mb-4 overflow-hidden rounded-xl">
                  <div className="aspect-w-1 aspect-h-1">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex space-x-3 justify-center">
                      <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm hover:bg-white/40 transition-colors">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                        </svg>
                      </a>
                      <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm hover:bg-white/40 transition-colors">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                        </svg>
                      </a>
                      <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm hover:bg-white/40 transition-colors">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                  <p className="text-emerald-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recognition Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Recognition</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our efforts in revolutionizing disaster relief have been recognized globally.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {recognitions.map((recognition, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
                    {recognition.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{recognition.title}</h3>
                  <p className="text-gray-600">{recognition.organization}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Together, we can make a real difference in the lives of those affected by disasters.
            Join our community of changemakers today.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-1">
              Get Involved
            </button>
            <button className="px-8 py-4 bg-white text-emerald-600 font-semibold rounded-full border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;