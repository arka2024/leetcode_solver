import React, { useState, useEffect } from 'react';
import { submissionsAPI } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { Trophy, Medal, Award, User } from 'lucide-react';

interface LeaderboardUser {
  rank: number;
  username: string;
  profile: {
    firstName?: string;
    lastName?: string;
    institution?: string;
    country?: string;
  };
  stats: {
    problemsSolved: number;
    totalSubmissions: number;
    acceptedSubmissions: number;
    rating: number;
  };
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchLeaderboard();
  }, [currentPage]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await submissionsAPI.getLeaderboard({
        page: currentPage,
        limit: 50
      });

      if (response.data.success) {
        setLeaderboard(response.data.leaderboard);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch leaderboard'
      });
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return (
          <div className="w-6 h-6 flex items-center justify-center text-gray-600 dark:text-gray-400 font-bold">
            {rank}
          </div>
        );
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
      default:
        return 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700';
    }
  };

  const calculateSuccessRate = (accepted: number, total: number) => {
    return total > 0 ? ((accepted / total) * 100).toFixed(1) : '0.0';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Leaderboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Top performers in competitive programming
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No data available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Be the first to solve problems and appear on the leaderboard!
          </p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {leaderboard.length >= 3 && currentPage === 1 && (
            <div className="mb-12">
              <div className="flex justify-center items-end space-x-4 max-w-4xl mx-auto">
                {/* Second Place */}
                <div className="text-center">
                  <div className={`p-6 rounded-lg shadow-lg ${getRankColor(2)} mb-4`}>
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl font-bold">
                        {leaderboard[1].username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-lg font-bold mb-1">{leaderboard[1].username}</div>
                    <div className="text-sm opacity-90">
                      {leaderboard[1].stats.problemsSolved} problems
                    </div>
                  </div>
                  <div className="h-20 bg-gray-300 rounded-t-lg flex items-center justify-center">
                    <Medal className="h-8 w-8 text-gray-600" />
                  </div>
                </div>

                {/* First Place */}
                <div className="text-center">
                  <div className={`p-6 rounded-lg shadow-lg ${getRankColor(1)} mb-4`}>
                    <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl font-bold">
                        {leaderboard[0].username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xl font-bold mb-1">{leaderboard[0].username}</div>
                    <div className="text-sm opacity-90">
                      {leaderboard[0].stats.problemsSolved} problems
                    </div>
                  </div>
                  <div className="h-32 bg-yellow-400 rounded-t-lg flex items-center justify-center">
                    <Trophy className="h-10 w-10 text-yellow-700" />
                  </div>
                </div>

                {/* Third Place */}
                <div className="text-center">
                  <div className={`p-6 rounded-lg shadow-lg ${getRankColor(3)} mb-4`}>
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl font-bold">
                        {leaderboard[2].username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-lg font-bold mb-1">{leaderboard[2].username}</div>
                    <div className="text-sm opacity-90">
                      {leaderboard[2].stats.problemsSolved} problems
                    </div>
                  </div>
                  <div className="h-16 bg-amber-500 rounded-t-lg flex items-center justify-center">
                    <Award className="h-6 w-6 text-amber-700" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Full Leaderboard Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Problems Solved
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {leaderboard.map((user) => (
                    <tr
                      key={user.username}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                        user.rank <= 3 ? 'bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/10' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getRankIcon(user.rank)}
                          <span className="font-medium text-gray-900 dark:text-white">
                            #{user.rank}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {user.username}
                            </div>
                            {user.profile.institution && (
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {user.profile.institution}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {user.stats.problemsSolved}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {user.stats.acceptedSubmissions} accepted
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  parseFloat(
                                    calculateSuccessRate(
                                      user.stats.acceptedSubmissions,
                                      user.stats.totalSubmissions
                                    )
                                  )
                                )}%`
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {calculateSuccessRate(
                              user.stats.acceptedSubmissions,
                              user.stats.totalSubmissions
                            )}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {user.stats.rating}
                        </div>
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