import React, { useRef, useEffect, useState } from 'react';

const MiniGame = () => {
  const gameAreaRef = useRef(null);
  const characterRef = useRef(null);
  const obstacleRef = useRef(null);
  const [isJumping, setIsJumping] = useState(false);
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState(0);

  const jump = () => {
    if (!isJumping) {
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 300);
    }
  };

  const moveCharacter = (direction) => {
    const newPosition = position + direction;
    const gameArea = gameAreaRef.current;
    if (gameArea) {
      const gameAreaWidth = gameArea.offsetWidth;
      if (newPosition >= 0 && newPosition <= gameAreaWidth - 50) {
        setPosition(newPosition);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        moveCharacter(-10);
      } else if (e.key === 'ArrowRight') {
        moveCharacter(10);
      } else if (e.key === ' ') {
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [position]);

  useEffect(() => {
    let animationFrameId;
    const gameLoop = () => {
      const character = characterRef.current;
      const obstacle = obstacleRef.current;
      const gameArea = gameAreaRef.current;

      if (!character || !obstacle || !gameArea) return;

      const characterRect = character.getBoundingClientRect();
      const obstacleRect = obstacle.getBoundingClientRect();

      if (
        characterRect.right > obstacleRect.left &&
        characterRect.left < obstacleRect.right &&
        characterRect.bottom > obstacleRect.top &&
        characterRect.top < obstacleRect.bottom
      ) {
        cancelAnimationFrame(animationFrameId);
        alert(`Game Over! Your score: ${score}`);
        return;
      } else {
        setScore((prevScore) => prevScore + 1);
      }

      obstacle.style.left = `${obstacle.offsetLeft - 5}px`;

      if (obstacle.offsetLeft <= 0) {
        obstacle.style.left = `${gameArea.offsetWidth}px`;
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [score]);

  return (
    <div
      ref={gameAreaRef}
      onClick={jump}
      style={{
        width: '100%',
        height: '300px',
        border: '2px solid black',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        ref={characterRef}
        style={{
          width: '50px',
          height: '50px',
          backgroundColor: 'blue',
          position: 'absolute',
          bottom: isJumping ? '150px' : '0',
          left: `${position}px`,
          transition: isJumping ? 'bottom 0.3s' : 'left 0.1s',
        }}
      />
      <div
        ref={obstacleRef}
        style={{
          width: '50px',
          height: '50px',
          backgroundColor: 'red',
          position: 'absolute',
          bottom: '0',
          right: '0',
        }}
      />
    </div>
  );
};

export default MiniGame;
