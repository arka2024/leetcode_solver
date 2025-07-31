import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Code, Trophy, Users, Zap, ArrowRight, CheckCircle } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Master Competitive Programming
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Practice coding problems, compete with others, and improve your problem-solving skills
              with our comprehensive online judge platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  to="/problems"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Solve Problems</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/problems"
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors duration-200"
                  >
                    Browse Problems
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose CodeJudge?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to excel in competitive programming and technical interviews
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40 transition-colors duration-200">
                <Code className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Multiple Languages
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Support for C++, Java, Python, JavaScript, and more programming languages
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-green-200 dark:group-hover:bg-green-900/40 transition-colors duration-200">
                <Zap className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Real-time Execution
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Fast and secure code execution with instant feedback on your submissions
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/40 transition-colors duration-200">
                <Trophy className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Competitive Environment
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Leaderboards, contests, and ranking system to motivate your progress
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-orange-100 dark:bg-orange-900/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/40 transition-colors duration-200">
                <Users className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Community Driven
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Learn from others and share your solutions with the programming community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                500+
              </div>
              <div className="text-xl text-gray-600 dark:text-gray-400">
                Programming Problems
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                10K+
              </div>
              <div className="text-xl text-gray-600 dark:text-gray-400">
                Code Submissions
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                1K+
              </div>
              <div className="text-xl text-gray-600 dark:text-gray-400">
                Active Users
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Start Coding?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Join thousands of programmers improving their skills every day
            </p>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 inline-flex items-center space-x-2"
            >
              <span>Create Free Account</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}