import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { World } from '../models/World.js';
import Challenge from '../models/Challenge.js';
import User from '../models/User.js';

dotenv.config();

const worlds = [
  {
    name: 'Speed Logic Arena', slug: 'js-speed-arena', language: 'javascript', gameType: 'speed',
    description: 'Fast-paced JavaScript challenges under time pressure. Fix bugs. Beat the clock.',
    theme: { primaryColor: '#F59E0B', secondaryColor: '#FDE68A', icon: 'JS', bgClass: 'from-amber-900 to-yellow-900' },
    totalLevels: 12, requiredLevel: 1, order: 1,
  },
  {
    name: 'Python Puzzle Quest', slug: 'python-puzzle', language: 'python', gameType: 'puzzle',
    description: 'Story-based Python missions. Solve logic puzzles to progress through the adventure.',
    theme: { primaryColor: '#3B82F6', secondaryColor: '#BFDBFE', icon: 'Py', bgClass: 'from-blue-900 to-indigo-900' },
    totalLevels: 10, requiredLevel: 1, order: 2,
  },
  {
    name: 'C++ Battle Arena', slug: 'cpp-battle', language: 'cpp', gameType: 'battle',
    description: 'Fight enemies using correct C++ algorithms. Every solution is an attack move.',
    theme: { primaryColor: '#EF4444', secondaryColor: '#FECACA', icon: 'C++', bgClass: 'from-red-900 to-rose-900' },
    totalLevels: 10, requiredLevel: 3, order: 3,
  },
  {
    name: 'Design Studio', slug: 'html-design', language: 'html', gameType: 'design',
    description: 'Match pixel-perfect designs with HTML & CSS. Score based on accuracy.',
    theme: { primaryColor: '#10B981', secondaryColor: '#A7F3D0', icon: 'UI', bgClass: 'from-emerald-900 to-teal-900' },
    totalLevels: 8, requiredLevel: 1, order: 4,
  },
  {
    name: 'Data Structure Strategy', slug: 'dsa-strategy', language: 'dsa', gameType: 'strategy',
    description: 'Conquer missions using stacks, queues, trees, and graphs.',
    theme: { primaryColor: '#8B5CF6', secondaryColor: '#DDD6FE', icon: 'DS', bgClass: 'from-violet-900 to-purple-900' },
    totalLevels: 15, requiredLevel: 5, order: 5,
  },
];

const getChallenges = (jsId, pyId, dsaId, htmlId, cppId) => [

  // ── JavaScript ──────────────────────────────────────────────
  {
    title: 'Sum Two Numbers', slug: 'sum-two-numbers',
    description: 'Write a function `solution(a, b)` that returns the sum of two numbers.',
    worldId: jsId, language: 'javascript', gameType: 'speed', difficulty: 'easy',
    xpReward: 50, timeLimit: 60000, order: 1,
    starterCode: new Map([['javascript', 'function solution(a, b) {\n  // Your code here\n}']]),
    testCases: [
      { input: '[2, 3]',     expectedOutput: '5',   isHidden: false },
      { input: '[0, 0]',     expectedOutput: '0',   isHidden: false },
      { input: '[-1, 1]',    expectedOutput: '0',   isHidden: true  },
      { input: '[100, 200]', expectedOutput: '300', isHidden: true  },
    ],
    hints: [
      { cost: 5,  text: 'Think about the + operator.' },
      { cost: 10, text: 'return a + b does the trick.' },
    ],
    tags: ['arithmetic', 'basics'],
  },
  {
    title: 'Reverse a String', slug: 'reverse-string',
    description: 'Write `solution(str)` that returns the string reversed.',
    worldId: jsId, language: 'javascript', gameType: 'speed', difficulty: 'easy',
    xpReward: 60, timeLimit: 90000, order: 2,
    starterCode: new Map([['javascript', 'function solution(str) {\n  // Your code here\n}']]),
    testCases: [
      { input: '"hello"', expectedOutput: '"olleh"', isHidden: false },
      { input: '"world"', expectedOutput: '"dlrow"', isHidden: false },
      { input: '""',      expectedOutput: '""',      isHidden: true  },
      { input: '"a"',     expectedOutput: '"a"',      isHidden: true  },
    ],
    hints: [{ cost: 5, text: 'Try split(""), reverse(), then join("").' }],
    tags: ['strings'],
  },
  {
    title: 'FizzBuzz', slug: 'fizzbuzz',
    description: 'Write `solution(n)` — return "Fizz" if divisible by 3, "Buzz" by 5, "FizzBuzz" by both, else the number as string.',
    worldId: jsId, language: 'javascript', gameType: 'speed', difficulty: 'easy',
    xpReward: 70, order: 3,
    starterCode: new Map([['javascript', 'function solution(n) {\n  // Your code here\n}']]),
    testCases: [
      { input: '3',  expectedOutput: '"Fizz"',     isHidden: false },
      { input: '5',  expectedOutput: '"Buzz"',     isHidden: false },
      { input: '15', expectedOutput: '"FizzBuzz"', isHidden: false },
      { input: '7',  expectedOutput: '"7"',        isHidden: true  },
      { input: '1',  expectedOutput: '"1"',        isHidden: true  },
    ],
    hints: [{ cost: 5, text: 'Check divisibility by 15 first, then 3, then 5.' }],
    tags: ['conditionals', 'math'],
  },
  {
    title: 'Two Sum', slug: 'two-sum',
    description: 'Write `solution(nums, target)` — return indices of the two numbers that add up to target.',
    worldId: jsId, language: 'javascript', gameType: 'speed', difficulty: 'medium',
    xpReward: 120, order: 4,
    starterCode: new Map([['javascript', 'function solution(nums, target) {\n  // Return [index1, index2]\n}']]),
    testCases: [
      { input: '[[2,7,11,15], 9]', expectedOutput: '[0,1]', isHidden: false },
      { input: '[[3,2,4], 6]',     expectedOutput: '[1,2]', isHidden: false },
      { input: '[[3,3], 6]',       expectedOutput: '[0,1]', isHidden: true  },
    ],
    hints: [
      { cost: 10, text: 'Use a Map to store each number and its index.' },
      { cost: 20, text: 'For each number, check if (target - num) exists in the map.' },
    ],
    tags: ['arrays', 'hashmap'],
  },
  {
    title: 'Count Vowels', slug: 'count-vowels',
    description: 'Write `solution(str)` that counts the number of vowels (a,e,i,o,u) in a string. Case insensitive.',
    worldId: jsId, language: 'javascript', gameType: 'speed', difficulty: 'easy',
    xpReward: 55, timeLimit: 60000, order: 5,
    starterCode: new Map([['javascript', 'function solution(str) {\n  // Count vowels: a, e, i, o, u\n}']]),
    testCases: [
      { input: '"hello"',   expectedOutput: '2', isHidden: false },
      { input: '"world"',   expectedOutput: '1', isHidden: false },
      { input: '"aeiou"',   expectedOutput: '5', isHidden: false },
      { input: '"rhythm"',  expectedOutput: '0', isHidden: true  },
      { input: '"HELLO"',   expectedOutput: '2', isHidden: true  },
    ],
    hints: [{ cost: 5, text: 'Use includes() or a regex to check each character.' }],
    tags: ['strings', 'basics'],
  },
  {
    title: 'Find Maximum', slug: 'find-maximum',
    description: 'Write `solution(arr)` that returns the largest number in an array.',
    worldId: jsId, language: 'javascript', gameType: 'speed', difficulty: 'easy',
    xpReward: 55, timeLimit: 60000, order: 6,
    starterCode: new Map([['javascript', 'function solution(arr) {\n  // Return the maximum value\n}']]),
    testCases: [
      { input: '[[1,2,3,4,5]]',   expectedOutput: '5',  isHidden: false },
      { input: '[[-1,-5,-3]]',     expectedOutput: '-1', isHidden: false },
      { input: '[[100,50,200]]',   expectedOutput: '200',isHidden: true  },
    ],
    hints: [{ cost: 5, text: 'Try Math.max(...arr) or use reduce.' }],
    tags: ['arrays', 'math'],
  },
  {
    title: 'Factorial', slug: 'factorial',
    description: 'Write `solution(n)` that returns the factorial of n. factorial(5) = 5×4×3×2×1 = 120.',
    worldId: jsId, language: 'javascript', gameType: 'speed', difficulty: 'easy',
    xpReward: 65, order: 7,
    starterCode: new Map([['javascript', 'function solution(n) {\n  // Return n!\n}']]),
    testCases: [
      { input: '5', expectedOutput: '120', isHidden: false },
      { input: '0', expectedOutput: '1',   isHidden: false },
      { input: '1', expectedOutput: '1',   isHidden: false },
      { input: '6', expectedOutput: '720', isHidden: true  },
    ],
    hints: [{ cost: 5, text: 'Use a loop or recursion. Base case: 0! = 1.' }],
    tags: ['math', 'recursion'],
  },
  {
    title: 'Debounce Function', slug: 'debounce',
    description: 'Implement `solution(fn, delay)` that returns a debounced version delaying fn until after delay ms of inactivity.',
    worldId: jsId, language: 'javascript', gameType: 'speed', difficulty: 'hard',
    xpReward: 200, order: 8,
    starterCode: new Map([['javascript', 'function solution(fn, delay) {\n  // Return the debounced function\n}']]),
    testCases: [
      { input: '["test", 100]', expectedOutput: '"function"', isHidden: false },
    ],
    hints: [{ cost: 10, text: 'Use setTimeout and clearTimeout inside a closure.' }],
    tags: ['closures', 'timing'],
  },

  // ── HTML / CSS ──────────────────────────────────────────────
  {
    title: 'Build a Button', slug: 'build-a-button',
    description: 'Create an HTML button with the text "Click Me" and a class of "btn". Style it with a blue background (#3B82F6), white text, padding of 10px 20px, and border-radius of 8px.',
    worldId: htmlId, language: 'html', gameType: 'design', difficulty: 'easy',
    xpReward: 60, order: 1,
    starterCode: new Map([['html', '<!-- Create your button here -->\n<style>\n  /* Add your styles here */\n</style>\n\n<button class="btn">Click Me</button>']]),
    testCases: [
      { input: '"has-button"',     expectedOutput: '"true"', isHidden: false, description: 'Page contains a button element' },
      { input: '"has-btn-class"',  expectedOutput: '"true"', isHidden: false, description: 'Button has class "btn"' },
      { input: '"has-text"',       expectedOutput: '"true"', isHidden: false, description: 'Button says "Click Me"' },
    ],
    hints: [
      { cost: 5,  text: 'Use <button class="btn"> for the element.' },
      { cost: 10, text: 'In CSS: background-color: #3B82F6; color: white; padding: 10px 20px; border-radius: 8px;' },
    ],
    tags: ['html', 'css', 'basics'],
  },
  {
    title: 'Card Component', slug: 'card-component',
    description: 'Build a card component with a title "Hello World", a paragraph with any text, and a white background with a subtle box-shadow. Wrap it in a div with class "card".',
    worldId: htmlId, language: 'html', gameType: 'design', difficulty: 'easy',
    xpReward: 70, order: 2,
    starterCode: new Map([['html', '<!-- Build your card -->\n<style>\n  .card {\n    /* Style the card */\n  }\n</style>\n\n<div class="card">\n  <!-- Add title and paragraph -->\n</div>']]),
    testCases: [
      { input: '"has-card-class"', expectedOutput: '"true"', isHidden: false, description: 'Has a div with class "card"' },
      { input: '"has-heading"',    expectedOutput: '"true"', isHidden: false, description: 'Has an h1/h2/h3 with text' },
      { input: '"has-paragraph"',  expectedOutput: '"true"', isHidden: false, description: 'Has a paragraph element' },
    ],
    hints: [
      { cost: 5,  text: 'Use <h2> for the title and <p> for the paragraph.' },
      { cost: 10, text: 'box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 20px; border-radius: 12px;' },
    ],
    tags: ['html', 'css', 'components'],
  },
  {
    title: 'Flexbox Navigation', slug: 'flexbox-nav',
    description: 'Create a navigation bar with a logo on the left and 3 links (Home, About, Contact) on the right using Flexbox. Use a dark background (#1e293b) and white text.',
    worldId: htmlId, language: 'html', gameType: 'design', difficulty: 'medium',
    xpReward: 100, order: 3,
    starterCode: new Map([['html', '<style>\n  nav {\n    /* Use flexbox */\n  }\n  .logo { }\n  .nav-links { }\n  .nav-links a {\n    color: white;\n    text-decoration: none;\n    margin-left: 20px;\n  }\n</style>\n\n<nav>\n  <div class="logo">BrainBlitz</div>\n  <div class="nav-links">\n    <a href="#">Home</a>\n    <a href="#">About</a>\n    <a href="#">Contact</a>\n  </div>\n</nav>']]),
    testCases: [
      { input: '"has-nav"',        expectedOutput: '"true"', isHidden: false, description: 'Has a nav element' },
      { input: '"has-3-links"',    expectedOutput: '"true"', isHidden: false, description: 'Has 3 anchor tags' },
      { input: '"has-logo"',       expectedOutput: '"true"', isHidden: false, description: 'Has a logo div' },
    ],
    hints: [
      { cost: 10, text: 'Use display: flex; justify-content: space-between; align-items: center; on the nav.' },
      { cost: 20, text: 'Add padding: 16px 24px; to the nav and display: flex; to .nav-links.' },
    ],
    tags: ['flexbox', 'navigation', 'layout'],
  },
  {
    title: 'CSS Grid Layout', slug: 'css-grid-layout',
    description: 'Create a 3-column photo grid using CSS Grid. Each cell should have a colored background and be 150px tall. Use class "grid-container" on the wrapper.',
    worldId: htmlId, language: 'html', gameType: 'design', difficulty: 'medium',
    xpReward: 110, order: 4,
    starterCode: new Map([['html', '<style>\n  .grid-container {\n    /* Create 3-column grid */\n  }\n  .grid-item {\n    height: 150px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    color: white;\n    font-weight: bold;\n    border-radius: 8px;\n  }\n</style>\n\n<div class="grid-container">\n  <div class="grid-item" style="background:#6366f1">1</div>\n  <div class="grid-item" style="background:#8b5cf6">2</div>\n  <div class="grid-item" style="background:#a78bfa">3</div>\n  <div class="grid-item" style="background:#7c3aed">4</div>\n  <div class="grid-item" style="background:#6d28d9">5</div>\n  <div class="grid-item" style="background:#5b21b6">6</div>\n</div>']]),
    testCases: [
      { input: '"has-grid-container"', expectedOutput: '"true"', isHidden: false, description: 'Has grid-container class' },
      { input: '"has-6-items"',        expectedOutput: '"true"', isHidden: false, description: 'Has 6 grid items' },
    ],
    hints: [
      { cost: 10, text: 'Use display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;' },
    ],
    tags: ['css grid', 'layout'],
  },
  {
    title: 'Animated Button', slug: 'animated-button',
    description: 'Create a button that smoothly changes background color on hover using CSS transitions. Normal: purple (#8b5cf6). Hover: darker purple (#6d28d9). Transition should be 0.3s ease.',
    worldId: htmlId, language: 'html', gameType: 'design', difficulty: 'medium',
    xpReward: 90, order: 5,
    starterCode: new Map([['html', '<style>\n  .btn-animated {\n    /* Add hover animation */\n    background: #8b5cf6;\n    color: white;\n    padding: 12px 28px;\n    border: none;\n    border-radius: 8px;\n    cursor: pointer;\n    font-size: 16px;\n  }\n  .btn-animated:hover {\n    /* Hover state */\n  }\n</style>\n\n<button class="btn-animated">Hover Me!</button>']]),
    testCases: [
      { input: '"has-btn-animated"', expectedOutput: '"true"', isHidden: false, description: 'Has btn-animated class' },
      { input: '"has-transition"',   expectedOutput: '"true"', isHidden: false, description: 'Has CSS transition' },
    ],
    hints: [
      { cost: 5,  text: 'Add transition: background 0.3s ease; to the button.' },
      { cost: 10, text: 'In :hover add background: #6d28d9;' },
    ],
    tags: ['css', 'animation', 'hover'],
  },
  {
    title: 'Profile Card', slug: 'profile-card',
    description: 'Build a profile card with an avatar circle (initials "AB"), a name, a job title, and a "Follow" button. Center everything vertically.',
    worldId: htmlId, language: 'html', gameType: 'design', difficulty: 'medium',
    xpReward: 120, order: 6,
    starterCode: new Map([['html', '<style>\n  .profile-card {\n    /* Style the card */\n    text-align: center;\n    padding: 32px;\n    max-width: 280px;\n    margin: 40px auto;\n  }\n  .avatar {\n    /* Circle with initials */\n    width: 80px;\n    height: 80px;\n    border-radius: 50%;\n    background: #8b5cf6;\n    color: white;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 24px;\n    font-weight: bold;\n    margin: 0 auto 16px;\n  }\n</style>\n\n<div class="profile-card">\n  <div class="avatar">AB</div>\n  <!-- Add name, job title, and follow button -->\n</div>']]),
    testCases: [
      { input: '"has-profile-card"', expectedOutput: '"true"', isHidden: false, description: 'Has profile-card class' },
      { input: '"has-avatar"',       expectedOutput: '"true"', isHidden: false, description: 'Has avatar element' },
      { input: '"has-button"',       expectedOutput: '"true"', isHidden: false, description: 'Has a Follow button' },
    ],
    hints: [
      { cost: 10, text: 'Add <h3>Name</h3>, <p>Job Title</p>, and <button>Follow</button> inside the card.' },
    ],
    tags: ['html', 'css', 'components'],
  },
  {
    title: 'Responsive Hero Section', slug: 'responsive-hero',
    description: 'Build a full-width hero section with a large heading, subtitle text, and a CTA button. Use a dark gradient background and center all content.',
    worldId: htmlId, language: 'html', gameType: 'design', difficulty: 'hard',
    xpReward: 180, order: 7,
    starterCode: new Map([['html', '<style>\n  .hero {\n    /* Full-width dark gradient, min-height: 400px */\n    /* Center content with flexbox */\n    color: white;\n    text-align: center;\n  }\n  .hero h1 { font-size: 48px; margin-bottom: 16px; }\n  .hero p  { font-size: 18px; margin-bottom: 32px; opacity: 0.8; }\n  .cta-btn {\n    /* Style the CTA button */\n    padding: 14px 36px;\n    border: none;\n    border-radius: 8px;\n    font-size: 16px;\n    cursor: pointer;\n  }\n</style>\n\n<section class="hero">\n  <div>\n    <h1>Welcome to BrainBlitz</h1>\n    <p>Learn programming through epic games</p>\n    <button class="cta-btn">Start Playing</button>\n  </div>\n</section>']]),
    testCases: [
      { input: '"has-hero"',   expectedOutput: '"true"', isHidden: false, description: 'Has hero section' },
      { input: '"has-h1"',     expectedOutput: '"true"', isHidden: false, description: 'Has h1 heading' },
      { input: '"has-cta"',    expectedOutput: '"true"', isHidden: false, description: 'Has CTA button' },
    ],
    hints: [
      { cost: 10, text: 'background: linear-gradient(135deg, #1e1e3f, #0f0f1a); min-height: 400px; display: flex; align-items: center; justify-content: center;' },
      { cost: 20, text: 'For the button: background: #8b5cf6; color: white;' },
    ],
    tags: ['html', 'css', 'responsive', 'layout'],
  },
  {
    title: 'CSS Boss — Dark Dashboard', slug: 'css-dark-dashboard',
    description: '⚔️ BOSS FIGHT: Build a mini dark-mode dashboard with a sidebar (200px wide) and main content area side by side. Add a header inside the main area. Use class "dashboard", "sidebar", and "main-content".',
    worldId: htmlId, language: 'html', gameType: 'design', difficulty: 'boss',
    xpReward: 500, isBoss: true, order: 99,
    starterCode: new Map([['html', '<style>\n  * { margin: 0; padding: 0; box-sizing: border-box; }\n  body { background: #0f0f1a; color: white; font-family: sans-serif; }\n  .dashboard {\n    /* Flexbox side by side */\n    height: 100vh;\n  }\n  .sidebar {\n    /* 200px wide, dark bg */\n    width: 200px;\n    padding: 24px 16px;\n  }\n  .main-content {\n    /* Takes remaining space */\n    flex: 1;\n    padding: 24px;\n  }\n  .header {\n    /* Header bar inside main */\n    padding: 16px 24px;\n    border-radius: 12px;\n    margin-bottom: 24px;\n  }\n</style>\n\n<div class="dashboard">\n  <div class="sidebar">\n    <h3>BrainBlitz</h3>\n    <nav>\n      <p>Dashboard</p>\n      <p>Worlds</p>\n      <p>Battle</p>\n    </nav>\n  </div>\n  <div class="main-content">\n    <div class="header">\n      <h2>Welcome back!</h2>\n    </div>\n    <p>Main content goes here</p>\n  </div>\n</div>']]),
    testCases: [
      { input: '"has-dashboard"',    expectedOutput: '"true"', isHidden: false, description: 'Has dashboard class' },
      { input: '"has-sidebar"',      expectedOutput: '"true"', isHidden: false, description: 'Has sidebar' },
      { input: '"has-main-content"', expectedOutput: '"true"', isHidden: false, description: 'Has main-content area' },
    ],
    hints: [
      { cost: 20, text: 'Add display: flex; to .dashboard so sidebar and main sit side by side.' },
      { cost: 40, text: 'Give .sidebar background: #13132a; and .header background: #1e1e35;' },
    ],
    tags: ['css', 'layout', 'dashboard', 'flexbox'],
  },

  // ── Python ──────────────────────────────────────────────────
  {
    title: 'Palindrome Check', slug: 'palindrome-check',
    description: 'Write `solution(s)` — return True if the string is a palindrome, False otherwise.',
    worldId: pyId, language: 'python', gameType: 'puzzle', difficulty: 'easy',
    xpReward: 60, order: 1,
    starterCode: new Map([['python', 'def solution(s):\n    # Your code here\n    pass']]),
    testCases: [
      { input: '"racecar"', expectedOutput: 'true',  isHidden: false },
      { input: '"hello"',   expectedOutput: 'false', isHidden: false },
      { input: '"a"',       expectedOutput: 'true',  isHidden: true  },
      { input: '""',        expectedOutput: 'true',  isHidden: true  },
    ],
    hints: [{ cost: 5, text: 'Compare the string to its reverse (s[::-1]).' }],
    tags: ['strings', 'logic'],
  },
  {
    title: 'Fibonacci Sequence', slug: 'fibonacci',
    description: 'Write `solution(n)` — return the nth Fibonacci number (0-indexed). F(0)=0, F(1)=1.',
    worldId: pyId, language: 'python', gameType: 'puzzle', difficulty: 'medium',
    xpReward: 100, order: 2,
    starterCode: new Map([['python', 'def solution(n):\n    # Your code here\n    pass']]),
    testCases: [
      { input: '0',  expectedOutput: '0',  isHidden: false },
      { input: '1',  expectedOutput: '1',  isHidden: false },
      { input: '6',  expectedOutput: '8',  isHidden: false },
      { input: '10', expectedOutput: '55', isHidden: true  },
    ],
    hints: [{ cost: 10, text: 'Handle base cases n=0 and n=1, then iterate with two variables.' }],
    tags: ['recursion', 'dynamic programming'],
  },
  {
    title: 'Count Words', slug: 'count-words',
    description: 'Write `solution(sentence)` that returns the number of words in a sentence.',
    worldId: pyId, language: 'python', gameType: 'puzzle', difficulty: 'easy',
    xpReward: 55, order: 3,
    starterCode: new Map([['python', 'def solution(sentence):\n    # Count the words\n    pass']]),
    testCases: [
      { input: '"hello world"',         expectedOutput: '2', isHidden: false },
      { input: '"the quick brown fox"', expectedOutput: '4', isHidden: false },
      { input: '"one"',                 expectedOutput: '1', isHidden: true  },
    ],
    hints: [{ cost: 5, text: 'Use the split() method.' }],
    tags: ['strings', 'basics'],
  },
  {
    title: 'List Sum', slug: 'list-sum',
    description: 'Write `solution(lst)` that returns the sum of all numbers in a list.',
    worldId: pyId, language: 'python', gameType: 'puzzle', difficulty: 'easy',
    xpReward: 55, order: 4,
    starterCode: new Map([['python', 'def solution(lst):\n    # Return the sum\n    pass']]),
    testCases: [
      { input: '[[1,2,3,4,5]]', expectedOutput: '15', isHidden: false },
      { input: '[[10,20,30]]',  expectedOutput: '60', isHidden: false },
      { input: '[[]]',          expectedOutput: '0',  isHidden: true  },
    ],
    hints: [{ cost: 5, text: 'Python has a built-in sum() function.' }],
    tags: ['lists', 'math'],
  },
  {
    title: 'Remove Duplicates', slug: 'remove-duplicates',
    description: 'Write `solution(lst)` that removes duplicate values from a list and returns the unique items sorted.',
    worldId: pyId, language: 'python', gameType: 'puzzle', difficulty: 'medium',
    xpReward: 90, order: 5,
    starterCode: new Map([['python', 'def solution(lst):\n    # Remove duplicates and sort\n    pass']]),
    testCases: [
      { input: '[[1,2,2,3,3,4]]', expectedOutput: '[1,2,3,4]',   isHidden: false },
      { input: '[[5,5,5]]',       expectedOutput: '[5]',          isHidden: false },
      { input: '[[3,1,2,1,3]]',   expectedOutput: '[1,2,3]',      isHidden: true  },
    ],
    hints: [{ cost: 10, text: 'Convert to a set to remove duplicates, then sort.' }],
    tags: ['lists', 'sets'],
  },

  // ── C++ ─────────────────────────────────────────────────────
  {
    title: 'Hello Battle', slug: 'hello-battle',
    description: 'Write a C++ program that prints "BrainBlitz" to the console. Use cout.',
    worldId: cppId, language: 'cpp', gameType: 'battle', difficulty: 'easy',
    xpReward: 50, order: 1,
    starterCode: new Map([['cpp', '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Print BrainBlitz\n    \n    return 0;\n}']]),
    testCases: [
      { input: '""', expectedOutput: '"BrainBlitz"', isHidden: false },
    ],
    hints: [{ cost: 5, text: 'Use cout << "BrainBlitz" << endl;' }],
    tags: ['cpp', 'basics', 'output'],
  },
  {
    title: 'Sum Array C++', slug: 'sum-array-cpp',
    description: 'Write a C++ function that takes an array and its size, returns the sum of all elements.',
    worldId: cppId, language: 'cpp', gameType: 'battle', difficulty: 'easy',
    xpReward: 70, order: 2,
    starterCode: new Map([['cpp', '#include <iostream>\nusing namespace std;\n\nint sumArray(int arr[], int n) {\n    // Return sum of all elements\n    \n}\n\nint main() {\n    int arr[] = {1, 2, 3, 4, 5};\n    cout << sumArray(arr, 5);\n    return 0;\n}']]),
    testCases: [
      { input: '"1 2 3 4 5"', expectedOutput: '"15"', isHidden: false },
      { input: '"10 20 30"',  expectedOutput: '"60"', isHidden: false },
    ],
    hints: [{ cost: 5, text: 'Use a for loop: for(int i=0; i<n; i++) sum += arr[i];' }],
    tags: ['cpp', 'arrays', 'loops'],
  },
  {
    title: 'Reverse Array Boss', slug: 'reverse-array-cpp-boss',
    description: '⚔️ BOSS FIGHT: Write a C++ program that reverses an array in-place using two pointers.',
    worldId: cppId, language: 'cpp', gameType: 'battle', difficulty: 'boss',
    xpReward: 500, isBoss: true, order: 99,
    starterCode: new Map([['cpp', '#include <iostream>\nusing namespace std;\n\nvoid reverseArray(int arr[], int n) {\n    // Reverse in-place using two pointers\n    \n}\n\nint main() {\n    int arr[] = {1, 2, 3, 4, 5};\n    reverseArray(arr, 5);\n    for(int i=0; i<5; i++) cout << arr[i] << " ";\n    return 0;\n}']]),
    testCases: [
      { input: '"1 2 3 4 5"', expectedOutput: '"5 4 3 2 1"', isHidden: false },
      { input: '"10 20 30"',  expectedOutput: '"30 20 10"',  isHidden: false },
    ],
    hints: [
      { cost: 20, text: 'Use two pointers: left=0, right=n-1. Swap and move them toward the center.' },
      { cost: 40, text: 'while(left < right) { swap(arr[left], arr[right]); left++; right--; }' },
    ],
    tags: ['cpp', 'arrays', 'two pointers'],
  },

  // ── DSA ─────────────────────────────────────────────────────
  {
    title: 'Valid Parentheses', slug: 'valid-parentheses',
    description: 'Write `solution(s)` — return true if the brackets string is valid using a stack.',
    worldId: dsaId, language: 'dsa', gameType: 'strategy', difficulty: 'medium',
    xpReward: 130, order: 1,
    starterCode: new Map([['javascript', 'function solution(s) {\n  // Use a stack!\n}']]),
    testCases: [
      { input: '"()"',     expectedOutput: 'true',  isHidden: false },
      { input: '"()[]{}"', expectedOutput: 'true',  isHidden: false },
      { input: '"(]"',     expectedOutput: 'false', isHidden: false },
      { input: '"{[]}"',   expectedOutput: 'true',  isHidden: true  },
      { input: '"([)]"',   expectedOutput: 'false', isHidden: true  },
    ],
    hints: [
      { cost: 10, text: 'Push opening brackets on a stack, pop and match when you see a closing bracket.' },
      { cost: 20, text: 'Use a Map: ) maps to (, ] to [, } to {.' },
    ],
    tags: ['stack', 'strings'],
  },
  {
    title: 'Find Duplicate', slug: 'find-duplicate',
    description: 'Write `solution(nums)` — find the duplicate number in an array containing n+1 integers where each integer is between 1 and n.',
    worldId: dsaId, language: 'dsa', gameType: 'strategy', difficulty: 'medium',
    xpReward: 140, order: 2,
    starterCode: new Map([['javascript', 'function solution(nums) {\n  // Find the one duplicate number\n}']]),
    testCases: [
      { input: '[[1,3,4,2,2]]', expectedOutput: '2', isHidden: false },
      { input: '[[3,1,3,4,2]]', expectedOutput: '3', isHidden: false },
      { input: '[[1,1]]',       expectedOutput: '1', isHidden: true  },
    ],
    hints: [
      { cost: 10, text: 'Use a Set to track seen numbers.' },
      { cost: 20, text: 'For each number, check if the Set already has it.' },
    ],
    tags: ['arrays', 'hashset'],
  },
  {
    title: 'Binary Search — Boss Fight', slug: 'binary-search-boss',
    description: '⚔️ BOSS FIGHT: Implement binary search. Write `solution(nums, target)` on a sorted array. Return index or -1.',
    worldId: dsaId, language: 'dsa', gameType: 'strategy', difficulty: 'boss',
    xpReward: 500, isBoss: true, order: 99,
    starterCode: new Map([['javascript', 'function solution(nums, target) {\n  // Binary search — O(log n)\n  // left pointer, right pointer, find mid\n}']]),
    testCases: [
      { input: '[[-1,0,3,5,9,12], 9]',        expectedOutput: '4',  isHidden: false },
      { input: '[[-1,0,3,5,9,12], 2]',        expectedOutput: '-1', isHidden: false },
      { input: '[[1], 1]',                    expectedOutput: '0',  isHidden: true  },
      { input: '[[1,2,3,4,5,6,7,8,9,10], 7]', expectedOutput: '6', isHidden: true  },
    ],
    hints: [
      { cost: 20, text: 'Use two pointers: left = 0, right = nums.length - 1.' },
      { cost: 40, text: 'Calculate mid = Math.floor((left + right) / 2). If nums[mid] < target, move left up; else move right down.' },
    ],
    tags: ['binary search', 'arrays'],
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/brainblitz');
    console.log('✅ Connected to MongoDB');

    await World.deleteMany({});
    await Challenge.deleteMany({});

    const createdWorlds = await World.insertMany(worlds);
    console.log(`✅ Created ${createdWorlds.length} worlds`);

    const jsWorld   = createdWorlds.find(w => w.language === 'javascript');
    const pyWorld   = createdWorlds.find(w => w.language === 'python');
    const dsaWorld  = createdWorlds.find(w => w.language === 'dsa');
    const htmlWorld = createdWorlds.find(w => w.language === 'html');
    const cppWorld  = createdWorlds.find(w => w.language === 'cpp');

    const createdChallenges = await Challenge.insertMany(
      getChallenges(jsWorld._id, pyWorld._id, dsaWorld._id, htmlWorld._id, cppWorld._id)
    );
    console.log(`✅ Created ${createdChallenges.length} challenges`);

    // Demo users (only if not existing)
    const demoUsers = [
      { username: 'demo',    email: 'demo@brainblitz.dev', password: 'demo1234', xp: 1500,  level: 8,  streak: 5  },
      { username: 'priya_s', email: 'priya@example.com',   password: 'pass1234', xp: 14200, level: 18, streak: 28 },
      { username: 'rahul_m', email: 'rahul@example.com',   password: 'pass1234', xp: 13800, level: 17, streak: 21 },
      { username: 'zara_k',  email: 'zara@example.com',    password: 'pass1234', xp: 12100, level: 16, streak: 19 },
    ];
    for (const u of demoUsers) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) await User.create(u);
    }
    console.log('✅ Demo users ready');

    console.log('\n🧠 BrainBlitz seed complete!');
    console.log('   Demo login → demo@brainblitz.dev / demo1234\n');
    console.log('   Challenges added per world:');
    console.log('   JS → 8  |  HTML/CSS → 8  |  Python → 5  |  C++ → 3  |  DSA → 3\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seed();