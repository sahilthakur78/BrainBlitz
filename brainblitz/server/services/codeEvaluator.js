/**
 * BrainBlitz Code Evaluator
 * - JavaScript: sandboxed execution via Function constructor
 * - Python/C++: Judge0 API (configure JUDGE0_API_KEY in .env)
 */

export const evaluateCode = async (code, language, testCases, timeLimit = 5000) => {
  if (language === 'javascript' || language === 'dsa') {
    return evaluateJS(code, testCases, timeLimit);
  }
  return evaluateViaJudge0(code, language, testCases, timeLimit);
};

const evaluateJS = (code, testCases, timeLimit) => {
  let testsPassed = 0;
  const results = [];
  let output = '';

  for (const tc of testCases) {
    try {
      const logs = [];
      const fakeConsole = { log: (...a) => logs.push(a.map(String).join(' ')) };
      const wrapped = `
        ${code}
        const __inp__ = ${tc.input};
        let __res__;
        if (Array.isArray(__inp__)) { __res__ = solution(...__inp__); }
        else { __res__ = solution(__inp__); }
        return JSON.stringify(__res__);
      `;
      // eslint-disable-next-line no-new-func
      const fn = new Function('console', wrapped);
      const actual = fn(fakeConsole);
      output += logs.join('\n');
      const expected = JSON.stringify(JSON.parse(tc.expectedOutput));
      const passed = actual === expected;
      if (passed) testsPassed++;
      results.push({ passed, input: tc.input, expected: tc.expectedOutput, actual });
    } catch (err) {
      results.push({ passed: false, error: err.message });
      return { passed: false, testsPassed, error: true, errorMessage: err.message, results, output };
    }
  }

  return {
    passed: testsPassed === testCases.length,
    testsPassed, testsTotal: testCases.length,
    results, output, errorMessage: null,
  };
};

const evaluateViaJudge0 = async (code, language, testCases, timeLimit) => {
  const LANG_IDS = { python: 71, cpp: 54, java: 62, c: 50 };
  const langId = LANG_IDS[language] || 71;
  const JUDGE0_URL = process.env.JUDGE0_URL || 'https://judge0-ce.p.rapidapi.com';
  let testsPassed = 0;
  const results = [];

  for (const tc of testCases) {
    try {
      const resp = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': process.env.JUDGE0_API_KEY || '',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
        body: JSON.stringify({ source_code: code, language_id: langId, stdin: tc.input, cpu_time_limit: (timeLimit || 5000) / 1000 }),
      });
      const data = await resp.json();
      const actual = (data.stdout || data.stderr || '').trim();
      const expected = tc.expectedOutput.trim();
      const passed = data.status?.id === 3 || actual === expected;
      if (passed) testsPassed++;
      results.push({ passed, input: tc.input, expected: tc.expectedOutput, actual });
    } catch (err) {
      results.push({ passed: false, error: err.message });
    }
  }

  return {
    passed: testsPassed === testCases.length,
    testsPassed, testsTotal: testCases.length,
    results, output: results.map(r => r.actual).filter(Boolean).join('\n'), errorMessage: null,
  };
};
