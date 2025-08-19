
"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if(!isVisible) setIsVisible(true);
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target as Element;
      if (
        target && (
        window.getComputedStyle(target).getPropertyValue('cursor') === 'pointer' ||
        target.closest('a, button'))
      ) {
        setIsPointer(true);
      } else {
        setIsPointer(false);
      }
    };
    
    const onMouseLeave = () => {
        setIsVisible(false);
    }

    const onMouseDown = () => {
        setIsClicked(true);
    };

    const onMouseUp = () => {
        setIsClicked(false);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.body.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isVisible]);

  return (
    <div className={cn("hidden md:block", { 'opacity-0': !isVisible })}>
      <div
        className={cn('cursor__dot', { 'opacity-0': isPointer, 'clicked': isClicked })}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      <div
        className={cn('cursor__ring', { 'clicked': isClicked })}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      >
        <div className="inner">
            <svg width="30" height="30" viewBox="0 0 30 30"><circle r="14" cx="15" cy="15" strokeWidth="1px"></circle></svg>
        </div>
        <div className="moveable">
            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><path fill="#fff" d="m81.9 60-6 6H75v-.9l5.1-5.1-5.1-5.1V54h.9l6 6zM38 60l6-6h.9v.9L39.7 60l5.2 5.1v.9H44l-6-6zM59.95 38.05l6 6v.9h-.9l-5.1-5.1-5.1 5.1h-.9v-.9l6-6zm0 43.9-6-6v-.9h.9l5.1 5.2 5.1-5.2h.9v.9l-6 6z"></path></svg>
        </div>
        <div className="draggable">
            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><path fill="#fff" d="m81.9 60-6 6H75v-.9l5.1-5.1-5.1-5.1V54h.9zM38 60l6-6h.9v.9L39.7 60l5.2 5.1v.9H44z"></path></svg>
        </div>
        <span className="playable">Play</span>
        <div className="prev">
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14"><path stroke="currentColor" fill="currentColor" strokeWidth="0.5" d="M.4 7 6.7.5h.9v.9L2.2 7l5.4 5.6v.9h-.9z"></path></svg>
        </div>
        <div className="next">
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14"><path stroke="currentColor" fill="currentColor" strokeWidth="0.5" d="m7.6 7-6.3 6.5H.4v-.9L5.8 7 .4 1.4V.5h.9z"></path></svg>
        </div>
      </div>
    </div>
  );
};

export default CustomCursor;
