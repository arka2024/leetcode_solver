import React, { useState, useEffect } from 'react';
import { submissionsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { CheckCircle, XCircle, Clock, AlertTriangle, Code } from 'lucide-react';

interface Submission {
  _id: string;
  problem: {
    title: string;
    slug: string;
    difficulty: string;
  };
  language: string;
  status: string;
  performance: {
    executionTime: number;
    memoryUsed: number;
    score: number;
  };
  createdAt: string;
}

export default function Submissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchSubmissions();
  }, [currentPage]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await submissionsAPI.getUserSubmissions({
        page: currentPage,
        limit: 20
      });

      if (response.data.success) {
        setSubmissions(response.data.submissions);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch submissions'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'Wrong Answer':
      case 'Runtime Error':
      case 'Compilation Error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'Time Limit Exceeded':
      case 'Memory Limit Exceeded':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'Pending':
      case 'Running':
        return <Clock className="h-5 w-5 text-blue-600 animate-spin" />;
      default:
        return <Code className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'text-green-600 dark:text-green-400';
      case 'Wrong Answer':
      case 'Runtime Error':
      case 'Compilation Error':
        return 'text-red-600 dark:text-red-400';
      case 'Time Limit Exceeded':
      case 'Memory Limit Exceeded':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'Pending':
      case 'Running':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Please login to view your submissions
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Submissions
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your submission history and performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Code className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.stats.totalSubmissions}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Submissions
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.stats.acceptedSubmissions}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Accepted
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Code className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.stats.problemsSolved}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Problems Solved
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.stats.totalSubmissions > 0 
                  ? ((user.stats.acceptedSubmissions / user.stats.totalSubmissions) * 100).toFixed(1)
                  : 0}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Success Rate
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No submissions yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start solving problems to see your submissions here
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Problem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Language
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Time/Memory
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Submitted
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {submissions.map((submission) => (
                    <tr
                      key={submission._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-blue-600 dark:text-blue-400 font-medium">
                            {submission.problem.title}
                          </div>
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getDifficultyColor(
                              submission.problem.difficulty
                            )}`}
                          >
                            {submission.problem.difficulty}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400 uppercase">
                        {submission.language}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(submission.status)}
                          <span className={`font-medium ${getStatusColor(submission.status)}`}>
                            {submission.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        <div className="text-sm">
                          <div>{submission.performance.executionTime}ms</div>
                          <div>{submission.performance.memoryUsed}MB</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                        {formatDate(submission.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}