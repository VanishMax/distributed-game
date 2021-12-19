import React from 'preact';
import './canvas.css';
import { useState, useRef, useEffect } from 'react';
import colors from './colors';

interface CanvasProps {
  canDraw: boolean,
}

function Canvas({ canDraw }: CanvasProps) {
  const [selectedColor, setSelectedColor] = useState('');

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [lines, setLines] = useState<{x: number, y: number, color: string}[]>([]);
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const  getMousePos =(canvas: HTMLCanvasElement, evt: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
  };

  useEffect(() => {
    if(canvasEl.current) {
      const ctx = canvasEl.current.getContext('2d');
      if(ctx) {
        for (var i = 1; i < lines.length; i++) {
          ctx.beginPath();
          ctx.moveTo(lines[i-1].x, lines[i-1].y);
          ctx.lineCap = "round";
          ctx.strokeStyle = lines[i].color;
          ctx.lineTo(lines[i].x, lines[i].y);
          ctx.stroke();
        }
      }
    }
  }, [lines]);

  const mousedown = () => {
    if (!canDraw) return;
    setIsMouseDown(true);
  }
  const mousemove = (evt: MouseEvent) =>  {
    if (!canDraw) return;
    if(isMouseDown && canvasEl.current){
      const currentPosition = getMousePos(canvasEl.current, evt);
      setLines((prev) => [...prev, {...currentPosition, color: colors[selectedColor]}]);
    }
  }
  const mouseup = () => {
    if (!canDraw) return;
    setIsMouseDown(false);
    setLines([]);
  }


  return (
    <div className="canvas_wrap">
      <canvas
        ref={canvasEl}
        className="canvas"
        onMouseDown={mousedown}
        onMouseMove={mousemove}
        onMouseUp={mouseup}
      />

      {canDraw && (
        <div className="colors">
          {Object.keys(colors).map((color) => (
            <label className="colors_color">
              <input type="radio" name="color" value={color} onClick={() => setSelectedColor(color)} />
              <span style={{backgroundColor: colors[color]}} />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default Canvas;
