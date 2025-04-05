import React, { useState, useRef, useEffect } from 'react';

interface CircleNode {
  id: number;
  x: number;
  y: number;
  radius: number;
}

interface Connection {
  from: number;
  to: number;
}

interface CircleConnectorProps {
  width?: number;
  height?: number;
  gridSize?: number;
  circleRadius?: number;
}

const CircleConnector: React.FC<CircleConnectorProps> = ({
  width = 800,
  height = 600,
  gridSize = 100,
  circleRadius = 20,
}) => {
  // Generate grid-aligned circles
  const generateCircles = (): CircleNode[] => {
    const circles: CircleNode[] = [];
    const rows = Math.floor(height / gridSize);
    const cols = Math.floor(width / gridSize);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        circles.push({
          id: row * cols + col,
          x: col * gridSize + gridSize / 2,
          y: row * gridSize + gridSize / 2,
          radius: circleRadius,
        });
      }
    }
    return circles;
  };

  const [circles] = useState<CircleNode[]>(generateCircles());
  const [connections, setConnections] = useState<Connection[]>([]);
  const [dragging, setDragging] = useState<{ fromId: number | null; toPoint: { x: number; y: number } | null }>({
    fromId: null,
    toPoint: null,
  });
  
  const svgRef = useRef<SVGSVGElement>(null);

  // Check if two circles are adjacent (only one step in any direction)
  const areAdjacent = (circle1: CircleNode, circle2: CircleNode): boolean => {
    const rowSize = Math.floor(width / gridSize);
    const circle1Row = Math.floor(circle1.id / rowSize);
    const circle1Col = circle1.id % rowSize;
    const circle2Row = Math.floor(circle2.id / rowSize);
    const circle2Col = circle2.id % rowSize;

    // Check if they are one step away horizontally, vertically, or diagonally
    const rowDiff = Math.abs(circle1Row - circle2Row);
    const colDiff = Math.abs(circle1Col - circle2Col);

    return (rowDiff <= 1 && colDiff <= 1) && !(rowDiff === 0 && colDiff === 0);
  };

  // Check if a connection already exists
  const connectionExists = (fromId: number, toId: number): boolean => {
    return connections.some(
      (conn) => (conn.from === fromId && conn.to === toId) || (conn.from === toId && conn.to === fromId)
    );
  };

  const handleMouseDown = (circleId: number) => {
    setDragging({
      fromId: circleId,
      toPoint: {
        x: circles.find(c => c.id === circleId)?.x || 0,
        y: circles.find(c => c.id === circleId)?.y || 0,
      },
    });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (dragging.fromId !== null) {
      const svgRect = svgRef.current?.getBoundingClientRect();
      if (svgRect) {
        const x = e.clientX - svgRect.left;
        const y = e.clientY - svgRect.top;
        setDragging({
          ...dragging,
          toPoint: { x, y },
        });
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent<SVGSVGElement>) => {
    if (dragging.fromId !== null) {
      const svgRect = svgRef.current?.getBoundingClientRect();
      
      if (svgRect) {
        const mouseX = e.clientX - svgRect.left;
        const mouseY = e.clientY - svgRect.top;
        
        // Find if we're hovering over a circle
        const targetCircle = circles.find(circle => {
          const dx = circle.x - mouseX;
          const dy = circle.y - mouseY;
          return Math.sqrt(dx * dx + dy * dy) <= circle.radius;
        });
        
        if (targetCircle && targetCircle.id !== dragging.fromId) {
          const fromCircle = circles.find(c => c.id === dragging.fromId);
          
          if (fromCircle && areAdjacent(fromCircle, targetCircle) && !connectionExists(fromCircle.id, targetCircle.id)) {
            setConnections([...connections, { from: fromCircle.id, to: targetCircle.id }]);
          }
        }
      }
    }
    
    // Reset dragging state
    setDragging({ fromId: null, toPoint: null });
  };

  const handleMouseLeave = () => {
    setDragging({ fromId: null, toPoint: null });
  };

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{ border: '1px solid #ccc' }}
    >
     
      

      {/* Draw existing connections */}
      {connections.map((conn, idx) => {
        const fromCircle = circles.find(c => c.id === conn.from);
        const toCircle = circles.find(c => c.id === conn.to);
        
        if (fromCircle && toCircle) {
          return (
            <line
              key={`conn-${idx}`}
              x1={fromCircle.x}
              y1={fromCircle.y}
              x2={toCircle.x}
              y2={toCircle.y}
              stroke="#333"
              strokeWidth={2}
            />
          );
        }
        return null;
      })}

      {/* Draw temporary line while dragging */}
      {dragging.fromId !== null && dragging.toPoint !== null && (
        <line
          x1={circles.find(c => c.id === dragging.fromId)?.x || 0}
          y1={circles.find(c => c.id === dragging.fromId)?.y || 0}
          x2={dragging.toPoint.x}
          y2={dragging.toPoint.y}
          stroke="#999"
          strokeWidth={2}
          strokeDasharray="5,5"
        />
      )}

      {/* Draw circles */}
      {circles.map((circle) => (
        <g key={`circle-${circle.id}`}>
          <circle
            cx={circle.x}
            cy={circle.y}
            r={circle.radius}
            fill="#fff"
            stroke="#333"
            strokeWidth={2}
            onMouseDown={() => handleMouseDown(circle.id)}
            style={{ cursor: 'pointer' }}
          />
          
        </g>
      ))}
    </svg>
  );
};

export default CircleConnector;

// Sample usage in your app:
/*
import CircleConnector from './CircleConnector';

function App() {
  return (
    <div className="App">
      <h1>Circle Connector</h1>
      <CircleConnector width={800} height={600} gridSize={100} circleRadius={20} />
    </div>
  );
}
*/