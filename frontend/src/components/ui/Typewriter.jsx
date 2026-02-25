import { useState, useEffect } from 'react';


export default function Typewriter({ phrases, typingSpeed = 70, deletingSpeed = 40, pauseTime = 2000 }) {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    let timer;
    const currentPhrase = phrases[loopNum % phrases.length];

    if (isDeleting) {
      // Deleting state
      if (displayText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        timer = setTimeout(() => {}, pauseTime / 4); // small pause before typing next
      } else {
        timer = setTimeout(() => {
          setDisplayText(currentPhrase.substring(0, displayText.length - 1));
        }, deletingSpeed);
      }
    } else {
      // Typing state
      if (displayText === currentPhrase) {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      } else {
        timer = setTimeout(() => {
          setDisplayText(currentPhrase.substring(0, displayText.length + 1));
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, phrases, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className="inline-block min-w-[200px] text-left">
      {displayText}
      <span className="animate-pulse border-r-2 border-violet-500 ml-1 h-[1.1em] align-middle inline-block w-[2px]"></span>
    </span>
  );
}
