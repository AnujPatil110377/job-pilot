const quotes = [
  {
    text: "Your career path is a journey of continuous growth and learning. Let JobPilot be your trusted companion.",
    author: "Career Success Team"
  },
  {
    text: "Take the first step towards your dream career. Join thousands of professionals who trust JobPilot.",
    author: "JobPilot Community"
  },
  {
    text: "Navigate your career journey with confidence. We're here to guide you every step of the way.",
    author: "Career Experts"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  }
];

export const getRandomQuote = () => {
  return quotes[Math.floor(Math.random() * quotes.length)];
}; 