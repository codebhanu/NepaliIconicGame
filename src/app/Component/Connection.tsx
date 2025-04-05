interface line_props{
    startX:number;
    startY:number;
    endX:number;
    endY:number;

}
export default function  ConnectionLine({startX,startY,endX,endY}:line_props){
    return (
<line
  x1={startX}
  y1={startY}
  x2={endX}
  y2={endY}
  stroke="black"
  strokeWidth="10"
/>

    )
}
