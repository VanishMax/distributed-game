import React  from 'preact';
import './canvas.css';
import colors from './colors';

function Canvas() {
  return (
    <div className="canvas_wrap">
      <canvas className="canvas" />

      <div className="colors">
        {Object.values(colors).map((color) => (
          <label className="colors_color">
            <input type="radio" name="color" value={color} />
            <span style={{backgroundColor: color}} />
          </label>
        ))}
      </div>
    </div>
  );
}

export default Canvas;
