import { Flashcard } from '../types/flashcard';

export const initialFlashcards: Flashcard[] = [
  {
    id: '1',
    question: 'What is React Native?',
    answer:
      'React Native is an open-source framework for building native mobile apps using React. It lets developers write JavaScript that compiles to native components on iOS and Android.',
  },
  {
    id: '2',
    question: 'What is the difference between React and React Native?',
    answer:
      'React is a library for building web UIs with the DOM; React Native uses the same component model but renders to native iOS and Android components instead of the DOM.',
  },
  {
    id: '3',
    question: 'What is a "hook" in React?',
    answer:
      'A hook is a function, introduced in React 16.8, that lets you use state and lifecycle features in functional components (e.g., useState, useEffect, useContext).',
  },
  {
    id: '4',
    question: 'How does the Virtual DOM work?',
    answer:
      'React keeps a lightweight copy of the DOM. On state change, it computes the minimal set of updates (diffing) and applies only those to the real DOM, which improves performance.',
  },
  {
    id: '5',
    question: 'What is Redux used for?',
    answer:
      'Redux is a state management library that provides a single, predictable store for application state, making state changes explicit and traceable via actions.',
  },
  {
    id: '6',
    question: 'What is the purpose of package.json?',
    answer:
      'package.json describes a project: its name, version, scripts, dependencies, and other metadata used by npm and other package managers.',
  },
  {
    id: '7',
    question: 'What does CSS stand for?',
    answer: 'Cascading Style Sheets — the styling language used to control the presentation of web pages.',
  },
  {
    id: '8',
    question: 'What is an API?',
    answer:
      'An Application Programming Interface (API) is a set of rules that lets one software application communicate with and use the functionality of another.',
  },
  {
    id: '9',
    question: 'What is the difference between == and === in JavaScript?',
    answer:
      '== performs type coercion before comparing; === is the strict equality operator that returns true only when both operands are of the same type and value.',
  },
  {
    id: '10',
    question: 'What is asynchronous programming?',
    answer:
      'A paradigm where operations that take time (like network requests) run without blocking the rest of the program, using callbacks, promises, or async/await.',
  },
];
