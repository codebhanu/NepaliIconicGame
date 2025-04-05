"use client";
import Circle from "./circle";
import "../style/Game.module.css";
import ConnectionLine from "./Connection";
import { circle_radius, grid_spacing } from "../constants/GameConstants";
import { useRef, useState, useEffect } from "react";

interface GameBoardProps {
  width: number;
  height: number;
}

interface CircleData {
  id: string;
  x: number;
  y: number;
}

interface Connection {
  from: string;
  to: string;
}

interface Square {
  id: string;
  text: string;
}

export default function GameBoard({ width, height }: GameBoardProps) {
  const svgWidth: number = width * grid_spacing + grid_spacing;
  const svgHeight: number = height * grid_spacing + grid_spacing;
  const svgRef = useRef<SVGSVGElement>(null);
  
  // State for circles, connections, dragging, and completed squares
  const [circles, setCircles] = useState<CircleData[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [dragging, setDragging] = useState<{
    fromId: string | null;
    fromPoint: { x: number; y: number } | null;
    toPoint: { x: number; y: number } | null;
  }>({
    fromId: null,
    fromPoint: null,
    toPoint: null,
  });
  const [squares, setSquares] = useState<Square[]>([]);
  
  // Generate random text for completed squares
  const generateRandomText = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return chars.charAt(Math.floor(Math.random() * chars.length));
  };
  
  // Initialize circles based on grid dimensions
  useEffect(() => {
    const circlesData: CircleData[] = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const cx = x * grid_spacing + grid_spacing;
        const cy = y * grid_spacing + grid_spacing;
        circlesData.push({
          id: `${x}-${y}`,
          x: cx,
          y: cy,
        });
      }
    }
    setCircles(circlesData);
  }, [width, height]);

  // Parse grid coordinates from circle ID
  const parseCoordinates = (id: string) => {
    const [x, y] = id.split('-').map(Number);
    return { x, y };
  };

  // Check if two circles are adjacent (one step apart, no diagonals)
  const areAdjacent = (id1: string, id2: string) => {
    const coord1 = parseCoordinates(id1);
    const coord2 = parseCoordinates(id2);
    
    const xDiff = Math.abs(coord1.x - coord2.x);
    const yDiff = Math.abs(coord1.y - coord2.y);
    
    // Adjacent means exactly one step in either x or y direction, but not both
    return (xDiff === 1 && yDiff === 0) || (xDiff === 0 && yDiff === 1);
  };

  // Helper function to check if a connection exists
  const checkConnectionExists = (from: string, to: string) => {
    return connections.some(
      conn => (conn.from === from && conn.to === to) || (conn.from === to && conn.to === from)
    );
  };

  // Handle starting a drag operation
  const handleMouseDown = (circleId: string, x: number, y: number) => {
    setDragging({
      fromId: circleId,
      fromPoint: { x, y },
      toPoint: { x, y }
    });
  };

  // Handle mouse movement during drag
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

  // Handle completing a drag operation
  const handleMouseUp = (e: React.MouseEvent<SVGSVGElement>) => {
    if (dragging.fromId !== null) {
      const svgRect = svgRef.current?.getBoundingClientRect();
      if (svgRect) {
        const mouseX = e.clientX - svgRect.left;
        const mouseY = e.clientY - svgRect.top;
        
        // Find the closest circle to the mouse position
        const targetCircle = findClosestCircle(mouseX, mouseY);
        
        if (targetCircle && targetCircle.id !== dragging.fromId && areAdjacent(dragging.fromId, targetCircle.id)) {
          // Check if this connection already exists
          if (!checkConnectionExists(dragging.fromId, targetCircle.id)) {
            const newConnection: Connection = {
              from: dragging.fromId,
              to: targetCircle.id,
            };
            
            // Add the new connection
            const updatedConnections = [...connections, newConnection];
            setConnections(updatedConnections);
            
            // Check if any squares have been completed
            checkForCompletedSquares(updatedConnections);
          }
        }
      }
    }
    
    // Reset dragging state
    setDragging({
      fromId: null,
      fromPoint: null,
      toPoint: null,
    });
  };

  // Find the closest circle to a point
  const findClosestCircle = (x: number, y: number) => {
    let minDistance = Infinity;
    let closestCircle = null;
    
    for (const circle of circles) {
      const distance = Math.sqrt(
        Math.pow(circle.x - x, 2) + Math.pow(circle.y - y, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestCircle = circle;
      }
    }
    
    // Only accept if the distance is within a reasonable range
    return minDistance <= circle_radius * 2 ? closestCircle : null;
  };

  // Check for completed squares after adding a new connection
  const checkForCompletedSquares = (connList: Connection[]) => {
    const newSquares: Square[] = [];
    
    // For each circle, check if it forms the top-left corner of a square
    for (let y = 0; y < height - 1; y++) {
      for (let x = 0; x < width - 1; x++) {
        const topLeft = `${x}-${y}`;
        const topRight = `${x+1}-${y}`;
        const bottomLeft = `${x}-${y+1}`;
        const bottomRight = `${x+1}-${y+1}`;
        
        // Check if all four sides of the square are connected
        const hasTopEdge = connectionExists(topLeft, topRight, connList);
        const hasRightEdge = connectionExists(topRight, bottomRight, connList);
        const hasBottomEdge = connectionExists(bottomLeft, bottomRight, connList);
        const hasLeftEdge = connectionExists(topLeft, bottomLeft, connList);
        
        // If all edges exist, it's a complete square
        if (hasTopEdge && hasRightEdge && hasBottomEdge && hasLeftEdge) {
          const squareId = `square-${x}-${y}`;
          
          // Check if this square is already registered
          if (!squares.some(sq => sq.id === squareId) && 
              !newSquares.some(sq => sq.id === squareId)) {
            newSquares.push({
              id: squareId,
              text: generateRandomText()
            });
          }
        }
      }
    }
    
    // Add any new squares found
    if (newSquares.length > 0) {
      setSquares([...squares, ...newSquares]);
    }
  };

  // Helper to check connection existence in a provided list
  const connectionExists = (from: string, to: string, connList: Connection[] = connections) => {
    return connList.some(
      conn => (conn.from === from && conn.to === to) || (conn.from === to && conn.to === from)
    );
  };

  // Render the circles
  const renderCircles = () => {
    return circles.map((circle) => (
      <Circle
        key={`circle-${circle.id}`}
        cx={circle.x}
        cy={circle.y}
        id={circle.id}
        radius={circle_radius}
        onMouseDown={(e) => handleMouseDown(circle.id, circle.x, circle.y)}
      />
    ));
  };

  // Render the connections
  const renderConnections = () => {
    return connections.map((conn, idx) => {
      const fromCircle = circles.find(c => c.id === conn.from);
      const toCircle = circles.find(c => c.id === conn.to);
      
      if (fromCircle && toCircle) {
        return (
          <ConnectionLine
            key={`conn-${idx}`}
            startX={fromCircle.x}
            startY={fromCircle.y}
            endX={toCircle.x}
            endY={toCircle.y}
          />
        );
      }
      return null;
    });
  };

  // Render the dragging line
  const renderDraggingLine = () => {
    if (dragging.fromId && dragging.fromPoint && dragging.toPoint) {
      return (
        <line
          x1={dragging.fromPoint.x}
          y1={dragging.fromPoint.y}
          x2={dragging.toPoint.x}
          y2={dragging.toPoint.y}
          stroke="black"
          strokeWidth="3"
          strokeDasharray="5,5"
        />
      );
    }
    return null;
  };

  // Render completed squares with text
  const renderSquares = () => {
    return squares.map(square => {
      const [_, x, y] = square.id.split('-').map(Number);
      const centerX = (x + 0.5) * grid_spacing + grid_spacing;
      const centerY = (y + 0.5) * grid_spacing + grid_spacing;
      
      return (
        <g key={square.id}>
          <rect
            x={(x * grid_spacing) + grid_spacing - (grid_spacing / 2) + (circle_radius / 2)}
            y={(y * grid_spacing) + grid_spacing - (grid_spacing / 2) + (circle_radius / 2)}
            width={grid_spacing}
            height={grid_spacing}
            fill="rgba(255, 255, 255, 0.5)"
            stroke="none"
          />
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="24"
            fontWeight="bold"
          >
            {square.text}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="game-board-container">
      <svg
        ref={svgRef}
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="game-board border-2 border-black"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {renderSquares()}
        {renderConnections()}
        {renderDraggingLine()}
        {renderCircles()}
      </svg>
    </div>
  );
}