import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const audioRef = useRef(null);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleStartStop = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsSession(true);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const incrementBreak = () => {
    setBreakLength((prevBreakLength) => (prevBreakLength < 60 ? prevBreakLength + 1 : prevBreakLength));
  };

  const decrementBreak = () => {
    setBreakLength((prevBreakLength) => (prevBreakLength > 1 ? prevBreakLength - 1 : prevBreakLength));
  };

  const incrementSession = () => {
    setSessionLength((prevSessionLength) => {
      if (prevSessionLength < 60) {
        const newSessionLength = prevSessionLength + 1;
        if (!isRunning) {
          setTimeLeft(newSessionLength * 60);
        }
        return newSessionLength;
      }
      return prevSessionLength;
    });
  };

  const decrementSession = () => {
    setSessionLength((prevSessionLength) => {
      if (prevSessionLength > 1) {
        const newSessionLength = prevSessionLength - 1;
        if (!isRunning) {
          setTimeLeft(newSessionLength * 60);
        }
        return newSessionLength;
      }
      return prevSessionLength;
    });
  };

  useEffect(() => {
    if (!isRunning) return;
  
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 0) {
          if (audioRef.current) {
            audioRef.current.play();
          }
          if (isSession) {
            setIsSession(false);
            return breakLength * 60;
          } else {
            setIsSession(true);
            return sessionLength * 60;
          }
        }
        return prevTime - 1;
      });
    }, 1000);
  
    return () => clearInterval(interval);
  }, [isRunning, isSession, breakLength, sessionLength]);
  

  return (
    <div className="App">
      <h1>25 + 5 Clock</h1>
      <div className="settings">
        <div id="break-label">
          Break Length
          <button id="break-decrement" onClick={decrementBreak}>-</button>
          <span id="break-length">{breakLength}</span>
          <button id="break-increment" onClick={incrementBreak}>+</button>
        </div>
        <div id="session-label">
          Session Length
          <button id="session-decrement" onClick={decrementSession}>-</button>
          <span id="session-length">{sessionLength}</span>
          <button id="session-increment" onClick={incrementSession}>+</button>
        </div>
      </div>
      <div className="timer">
        <div id="timer-label">{isSession ? 'Session' : 'Break'}</div>
        <div id="time-left">{formatTime(timeLeft)}</div>
        <button id="start_stop" onClick={handleStartStop}>{isRunning ? 'Pause' : 'Start'}</button>
        <button id="reset" onClick={handleReset}>Reset</button>
      </div>
      <audio id="beep" preload="auto" src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav" ref={audioRef}></audio>

    </div>
  );
}

export default App;
