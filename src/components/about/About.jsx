import React from 'react';
import { Shield, Zap, BarChart3, Award, Heart, Globe2, Users, Target, Clock, HandHeart, Lightbulb, Trophy } from 'lucide-react';
import MissionImage from '../../assets/about/logo.png'; // Import the local image
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function About() {
  const campaigns = useSelector((state) => state.campaigns.campaigns);
  const navigate = useNavigate();
  console.log(campaigns);

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
      icon: <Globe2 className="w-8 h-8 text-emerald-500" />,
      number: "Base",
      label: "Blockchain Network",
      description: "Powering secure, transparent transactions for disaster relief"
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-emerald-500" />,
      number: "Grok",
      label: "AI Assistant",
      description: "Enhancing aid coordination with intelligent insights"
    }
  ];

  const milestones = [
    {
      year: "Step 1",
      title: "Proposal",
      description: "Community members propose targeted relief initiatives, leveraging blockchain to ensure transparent aid delivery."
    },
    {
      year: "Step 2",
      title: "DAO Voting",
      description: "Community votes on the proposal."
    },
    {
      year: "Step 3",
      title: "Event Contract Deployment",
      description: "Deploy the event contract and move funds from main escrow to event escrow."
    },
    {
      year: "Step 4 (Active Period)",
      title: "Accepting Donations & Victim Registration",
      description: "Accept donations and register victims using (Address & PIN)."
    },
    {
      year: "Step 5 (Claiming Period)",
      title: "Registered Victims Can Claim",
      description: "Registered victims can claim the fund."
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
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">KarunyaSetu</span>
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
                  src={MissionImage} 
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
                At KarunyaSetu, we believe that technology can bridge the gap between generosity and impact. Our mission is to create a world where aid reaches those in need swiftly and transparently, powered by blockchain technology.
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
            <h2 className="text-3xl font-bold mb-4">Our Technologies</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Through the power of blockchain technology and community support, we've made a real difference in people's lives.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
            <h2 className="text-3xl font-bold mb-4">Work flow</h2>
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

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Together, we can make a real difference in the lives of those affected by disasters.
            Join our community of changemakers today.
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => navigate('/donation')}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-1"
            >
              Get Involved
            </button>
            <button 
              onClick={() => navigate('/about')}
              className="px-8 py-4 bg-white text-emerald-600 font-semibold rounded-full border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;