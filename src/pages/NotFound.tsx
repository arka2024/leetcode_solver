import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        {/* Large 404 */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600 dark:text-blue-400">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            <Home className="h-5 w-5" />
            <span>Go Home</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Popular Pages
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <Link
              to="/problems"
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
            >
              <div className="text-blue-600 dark:text-blue-400 mb-2">
                <Search className="h-6 w-6 mx-auto" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white">Problems</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Browse coding problems</p>
            </Link>

            <Link
              to="/leaderboard"
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
            >
              <div className="text-green-600 dark:text-green-400 mb-2">
                <Search className="h-6 w-6 mx-auto" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white">Leaderboard</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">View top performers</p>
            </Link>

            <Link
              to="/register"
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
            >
              <div className="text-purple-600 dark:text-purple-400 mb-2">
                <Search className="h-6 w-6 mx-auto" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white">Join Us</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Create an account</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}