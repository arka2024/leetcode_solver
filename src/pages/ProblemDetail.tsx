import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { problemsAPI, submissionsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import CodeEditor from '../components/Code/CodeEditor';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { Clock, MemoryStick, Code, Play, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  tags: string[];
  constraints: {
    timeLimit: number;
    memoryLimit: number;
    languages: string[];
  };
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  hints: string[];
}

const languageTemplates: { [key: string]: string } = {
  cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main() {
    // Your code here
    return 0;
}`,
  java: `import java.util.*;
import java.io.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Your code here
    }
}`,
  python: `# Your code here
def solve():
    pass

if __name__ == "__main__":
    solve()`,
  javascript: `// Your code here
function solve() {
    
}

solve();`,
};

export default function ProblemDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  useEffect(() => {
    if (slug) {
      fetchProblem();
    }
  }, [slug]);

  useEffect(() => {
    // Update code template when language changes
    setCode(languageTemplates[selectedLanguage] || '');
  }, [selectedLanguage]);

  const fetchProblem = async () => {
    try {
      setLoading(true);
      const response = await problemsAPI.getProblem(slug!);
      if (response.data.success) {
        setProblem(response.data.problem);
        setCode(languageTemplates[selectedLanguage] || '');
      }
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch problem details'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      addNotification({
        type: 'warning',
        title: 'Login Required',
        message: 'Please login to submit your solution'
      });
      return;
    }

    if (!code.trim()) {
      addNotification({
        type: 'warning',
        title: 'Empty Code',
        message: 'Please write your solution before submitting'
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await submissionsAPI.submitCode({
        problemId: problem!._id,
        code,
        language: selectedLanguage
      });

      if (response.data.success) {
        const submissionId = response.data.submissionId;
        addNotification({
          type: 'success',
          title: 'Code Submitted',
          message: 'Your solution has been submitted for evaluation'
        });

        // Poll for submission result
        pollSubmissionResult(submissionId);
      }
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Submission Failed',
        message: error.response?.data?.message || 'Failed to submit code'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const pollSubmissionResult = async (submissionId: string) => {
    const maxAttempts = 30;
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await submissionsAPI.getSubmissionStatus(submissionId);
        if (response.data.success) {
          const submission = response.data.submission;
          
          if (submission.status !== 'Pending' && submission.status !== 'Running') {
            setSubmissionResult(submission);
            return;
          }

          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(poll, 2000);
          }
        }
      } catch (error) {
        console.error('Error polling submission result:', error);
      }
    };

    poll();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-600 dark:text-green-400';
      case 'Medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'Hard':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
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
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Problem not found
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Problem Description */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {problem.title}
              </h1>
              <span className={`text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {problem.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: problem.description }} />
            </div>
          </div>

          {/* Examples */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Examples
            </h3>
            {problem.examples.map((example, index) => (
              <div key={index} className="mb-6 last:mb-0">
                <div className="font-medium text-gray-900 dark:text-white mb-2">
                  Example {index + 1}:
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Input:
                    </div>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                      {example.input}
                    </pre>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Output:
                    </div>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                      {example.output}
                    </pre>
                  </div>
                  {example.explanation && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Explanation:
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {example.explanation}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Constraints */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Constraints
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  Time Limit: {problem.constraints.timeLimit}ms
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MemoryStick className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  Memory Limit: {problem.constraints.memoryLimit}MB
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Code Editor and Submission */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Solution
              </h3>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {problem.constraints.languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <CodeEditor
              value={code}
              onChange={setCode}
              language={selectedLanguage}
              height="500px"
            />

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={submitting || !user}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {submitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                <span>{submitting ? 'Submitting...' : 'Submit'}</span>
              </button>
            </div>
          </div>

          {/* Submission Result */}
          {submissionResult && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                {getStatusIcon(submissionResult.status)}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Submission Result
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
                  <div className={`font-medium ${
                    submissionResult.status === 'Accepted' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {submissionResult.status}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Time</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {submissionResult.performance.executionTime}ms
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Memory</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {submissionResult.performance.memoryUsed}MB
                  </div>
                </div>
              </div>

              {submissionResult.verdict && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {submissionResult.verdict.message}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {submissionResult.verdict.details}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}