'use client'
import react from "react"
interface CircleProps{
    cx:number;
    cy:number;
    id:string;
    radius?:number;
    onClick?:()=>void;
    onMouseDown?:(event:React.MouseEvent)=>void;
    onMouseUp?:(event:React.MouseEvent)=>void;
    isSelected?:boolean
}
export default function Circle ({
    cx,cy,id,radius=20,onClick,onMouseDown,onMouseUp,isSelected=false}:CircleProps
):JSX.Element{

    return (
  <circle r={radius} cx={cx} cy={cy} id={id} stroke="black" strokeWidth="3" fill="white"
        className={`circle ${isSelected ?'selected':''}`}  

            onClick={onClick}

            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
        />
    )

};
