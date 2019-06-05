import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.scss';

const CENTER = 1500;

function App() {
  const canvasContRef = useRef(null);
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [points, setPoints] = useState([]);
  const [rect, setRect] = useState([]);
  const [generateCount, setGenerateCount] = useState(null);

  useEffect(() => {
    setCtx(canvasRef.current.getContext('2d'));
    const cont = canvasContRef.current;
    cont.scrollTop = CENTER - cont.clientHeight / 2;
    cont.scrollLeft = CENTER - cont.clientWidth / 2;
  }, []);

  const fetchMBR = (values = points) => {
    fetch("http://localhost:8080/mbr", {
      method: 'POST',
      body: JSON.stringify(values),
      headers:{
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })
      .then(resp => resp.json())
      .then(rect => {
        setRect(rect);
        drawRect(rect);
      });
  };

  const setPoint = event => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.round(event.clientX - rect.left);
    const y = Math.round(event.clientY - rect.top);

    const newPoints = [
      ...points,
      { x, y },
    ];

    setPoints(newPoints);
    redraw(newPoints);
  };

  const redraw = (newPoints) => {
    clear();

    ctx.fillStyle = '#263238';
    newPoints.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, 2 * Math.PI, false);
      ctx.fill();
    });

    if (newPoints.length >= 3) {
      fetchMBR(newPoints);
    }
  };

  const clear = () => ctx.clearRect(0, 0, CENTER * 2, CENTER * 2);

  const drawRect = rect => {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = 'rgba(144, 202, 249, .3)';
    for(let i = 0; i < rect.length; i++) {
      const { x, y } = rect[i];
      if (i == 0) {
        ctx.moveTo(x, y);
      }

      ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#90CAF9';
    ctx.stroke();
    ctx.restore();
  }

  const clearPoints = () => {
    setPoints([]);
    setRect([]);
    redraw([]);
  };

  const randomnumber = (max, min) => Math.floor(Math.random() * (max - min + 1)) + min;

  const generate = () => {
    let count = generateCount;
    if (count < 3) {
      count = 3;
    }

    if (count > 10000) {
      count = 10000;
    }

    setGenerateCount(count);
    const newPoints = [];
    for (let i = 0; i < count; i++) {
      newPoints.push({
        x: randomnumber(1000, 2000),
        y: randomnumber(1150, 1850),
      });
    }

    setPoints(newPoints);
    redraw(newPoints);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.controls}>
        <h1 className={styles.heading}>Прямокутник найменшої площі</h1>
        <hr />
        <div className={styles.pointsCount}>
          <p>Кількість точок: <b>{points.length}</b></p>
          <button className={styles.clearButton} onClick={clearPoints}>Очистити</button>
        </div>
        <div className={styles.generation}>
          <h2>Генерація випадкових точок</h2>
          <input
            value={generateCount}
            type="number"
            className={styles.countInput}
            placeholder="Кількість точок (< 10000)"
            onChange={({ target: { value : v }}) => {
              setGenerateCount(v);
            }}
            min="3"
            max="10000"
          />
          <button
            className={styles.generateButton}
            onClick={generate}
          >
            Згенерувати
          </button>
        </div>
      </div>
      <div ref={canvasContRef} className={styles.canvasContainer}>
        <canvas
          ref={canvasRef}
          id="canvas"
          width={CENTER * 2}
          height={CENTER * 2}
          onClick={setPoint}
        >
        </canvas>
      </div>
    </div>
  );
}

export default App;
