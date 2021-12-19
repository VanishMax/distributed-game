import React from 'preact';
import './canvas.css';
import { useState, useRef, useEffect } from 'react';
import colors from './colors';

interface CanvasProps {
  canDraw: boolean,
  update: (moves: Line[]) => void,
  lines: Line[][],
}

export interface Line {
  x: number,
  y: number,
  color: string,
}

function Canvas({ canDraw, update, lines }: CanvasProps) {
  const [selectedColor, setSelectedColor] = useState('');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [moves, setMoves] = useState<Line[]>([]);

  const canvasEl = useRef<HTMLCanvasElement>(null);
  const  getMousePos =(canvas: HTMLCanvasElement, evt: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
  };

  const drawLine = (ctx: CanvasRenderingContext2D, line: Line[]) => {
    for (let i = 1; i < line.length; i++) {
      ctx.beginPath();
      ctx.moveTo(line[i-1].x, line[i-1].y);
      ctx.lineCap = 'round';
      ctx.strokeStyle = line[i].color;
      ctx.lineTo(line[i].x, line[i].y);
      ctx.stroke();
    }
  };

  useEffect(() => {
    if(canvasEl.current) {
      const ctx = canvasEl.current.getContext('2d');
      if(ctx) drawLine(ctx, moves);
    }
  }, [moves]);

  useEffect(() => {
    if(canvasEl.current && !canDraw) {
      const ctx = canvasEl.current.getContext('2d');
      if(ctx) {
        ctx.clearRect(0, 0, canvasEl.current.width, canvasEl.current.height);
        lines.forEach(line => drawLine(ctx, line));
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
      setMoves((prev) => [...prev, {...currentPosition, color: colors[selectedColor]}]);
    }
  }
  const mouseup = () => {
    if (!canDraw) return;
    setIsMouseDown(false);
    update(moves);
    setMoves([]);
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
