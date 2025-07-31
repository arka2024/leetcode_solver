const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const TIMEOUT = 10000; // 10 seconds
const TEMP_DIR = path.join(__dirname, '../temp');

// Language configurations
const LANGUAGE_CONFIG = {
  cpp: {
    extension: '.cpp',
    compile: (filename) => `g++ -o ${filename.replace('.cpp', '')} ${filename} -std=c++17`,
    execute: (filename) => `./${filename.replace('.cpp', '')}`,
    cleanup: (filename) => [filename, filename.replace('.cpp', '')]
  },
  java: {
    extension: '.java',
    compile: (filename) => `javac ${filename}`,
    execute: (filename) => `java ${filename.replace('.java', '')}`,
    cleanup: (filename) => [filename, filename.replace('.java', '.class')]
  },
  python: {
    extension: '.py',
    compile: null,
    execute: (filename) => `python3 ${filename}`,
    cleanup: (filename) => [filename]
  },
  javascript: {
    extension: '.js',
    compile: null,
    execute: (filename) => `node ${filename}`,
    cleanup: (filename) => [filename]
  },
  c: {
    extension: '.c',
    compile: (filename) => `gcc -o ${filename.replace('.c', '')} ${filename}`,
    execute: (filename) => `./${filename.replace('.c', '')}`,
    cleanup: (filename) => [filename, filename.replace('.c', '')]
  }
};

// Ensure temp directory exists
async function ensureTempDir() {
  try {
    await fs.access(TEMP_DIR);
  } catch {
    await fs.mkdir(TEMP_DIR, { recursive: true });
  }
}

// Execute shell command with timeout
function executeCommand(command, input = '', cwd = TEMP_DIR) {
  return new Promise((resolve, reject) => {
    const process = exec(command, { cwd, timeout: TIMEOUT }, (error, stdout, stderr) => {
      if (error) {
        if (error.killed && error.signal === 'SIGTERM') {
          reject(new Error('Time Limit Exceeded'));
        } else {
          reject(new Error(stderr || error.message));
        }
      } else {
        resolve({ stdout: stdout.trim(), stderr: stderr.trim() });
      }
    });

    if (input) {
      process.stdin.write(input);
      process.stdin.end();
    }
  });
}

// Clean up temporary files
async function cleanup(filenames, workDir) {
  for (const filename of filenames) {
    try {
      await fs.unlink(path.join(workDir, filename));
    } catch (error) {
      // Ignore cleanup errors
    }
  }
}

// Execute code against test cases
async function executeCode(submissionId, problem, code, language) {
  await ensureTempDir();
  
  const config = LANGUAGE_CONFIG[language];
  if (!config) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const workDir = path.join(TEMP_DIR, submissionId.toString());
  await fs.mkdir(workDir, { recursive: true });

  const filename = `solution${config.extension}`;
  const filepath = path.join(workDir, filename);

  try {
    // Write code to file
    await fs.writeFile(filepath, code);

    // Compile if necessary
    if (config.compile) {
      try {
        await executeCommand(config.compile(filename), '', workDir);
      } catch (error) {
        return {
          status: 'Compilation Error',
          verdict: {
            message: 'Compilation failed',
            details: error.message
          },
          testResults: [],
          performance: { executionTime: 0, memoryUsed: 0, score: 0 }
        };
      }
    }

    // Run test cases
    const testResults = [];
    let totalScore = 0;
    let maxTime = 0;
    let maxMemory = 0;
    let allPassed = true;

    for (let i = 0; i < problem.testCases.length; i++) {
      const testCase = problem.testCases[i];
      const startTime = Date.now();

      try {
        const result = await executeCommand(
          config.execute(filename),
          testCase.input,
          workDir
        );

        const executionTime = Date.now() - startTime;
        const actualOutput = result.stdout.trim();
        const expectedOutput = testCase.expectedOutput.trim();
        
        const passed = actualOutput === expectedOutput;
        const status = passed ? 'Passed' : 'Wrong Answer';
        
        if (passed) {
          totalScore += testCase.points || 1;
        } else {
          allPassed = false;
        }

        maxTime = Math.max(maxTime, executionTime);
        // Memory usage estimation (simplified)
        maxMemory = Math.max(maxMemory, 10); // MB

        testResults.push({
          testCase: i + 1,
          status,
          executionTime,
          memoryUsed: 10, // Simplified
          input: testCase.isHidden ? '[Hidden]' : testCase.input,
          expectedOutput: testCase.isHidden ? '[Hidden]' : expectedOutput,
          actualOutput: testCase.isHidden ? '[Hidden]' : actualOutput,
          error: passed ? null : 'Output mismatch'
        });

        // Check time limit
        if (executionTime > problem.constraints.timeLimit) {
          allPassed = false;
          testResults[testResults.length - 1].status = 'Time Limit Exceeded';
          break;
        }

        // Check memory limit (simplified check)
        if (maxMemory > problem.constraints.memoryLimit) {
          allPassed = false;
          testResults[testResults.length - 1].status = 'Memory Limit Exceeded';
          break;
        }

      } catch (error) {
        allPassed = false;
        const executionTime = Date.now() - startTime;
        
        let status = 'Runtime Error';
        if (error.message.includes('Time Limit Exceeded')) {
          status = 'Time Limit Exceeded';
        }

        testResults.push({
          testCase: i + 1,
          status,
          executionTime,
          memoryUsed: 0,
          input: testCase.isHidden ? '[Hidden]' : testCase.input,
          expectedOutput: testCase.isHidden ? '[Hidden]' : testCase.expectedOutput,
          actualOutput: '',
          error: error.message
        });
        break;
      }
    }

    // Determine final status
    let finalStatus = 'Wrong Answer';
    if (allPassed && testResults.length === problem.testCases.length) {
      finalStatus = 'Accepted';
    } else if (testResults.some(r => r.status === 'Time Limit Exceeded')) {
      finalStatus = 'Time Limit Exceeded';
    } else if (testResults.some(r => r.status === 'Memory Limit Exceeded')) {
      finalStatus = 'Memory Limit Exceeded';
    } else if (testResults.some(r => r.status === 'Runtime Error')) {
      finalStatus = 'Runtime Error';
    }

    const totalPossibleScore = problem.testCases.reduce((sum, tc) => sum + (tc.points || 1), 0);
    const scorePercentage = totalPossibleScore > 0 ? (totalScore / totalPossibleScore) * 100 : 0;

    return {
      status: finalStatus,
      verdict: {
        message: finalStatus,
        details: `Passed ${testResults.filter(r => r.status === 'Passed').length}/${problem.testCases.length} test cases`
      },
      testResults,
      performance: {
        executionTime: maxTime,
        memoryUsed: maxMemory,
        score: scorePercentage
      }
    };

  } catch (error) {
    return {
      status: 'Runtime Error',
      verdict: {
        message: 'Execution failed',
        details: error.message
      },
      testResults: [],
      performance: { executionTime: 0, memoryUsed: 0, score: 0 }
    };
  } finally {
    // Cleanup
    try {
      await cleanup(config.cleanup(filename), workDir);
      await fs.rmdir(workDir);
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}

module.exports = { executeCode };