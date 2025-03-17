import Circle from './circle'
import {circle_radius,grid_spacing} from '../constants/GameConstants'
interface GameBoardProps{
    width:number;
    height:number;
}
export default function GameBoard({width,height}:GameBoardProps):JSX.Element{
    const  svgWidth:number=width*grid_spacing+grid_spacing;
    const svgHeight:number=height*grid_spacing+grid_spacing;

    //Now we have to generate circile based on grid dimenstion

    const renderCircles=():JSX.Element[] =>{
        const circles:JSX.Element[]= [];
        for (let y:number=0;y<height;y++){
            for (let x:number=0;x<width;x++){
                const cx:number=x*grid_spacing+grid_spacing;
                const cy:number=y*grid_spacing+grid_spacing;
                circles.push(
                    <Circle key ={`circle-${x}-${y}`}
                    cx={cx}
                    cy={cy}
                    id={`${x}-${y}`}
                    />
                )

            }
        }
        return circles;
    }
    
    return (

    <div className=' game-board-container '>
            <svg

                width={svgWidth}
                height={svgHeight}
                viewBox={ `0 0 ${svgWidth} ${svgHeight}`}
                className='game-board'

            >
{renderCircles()}



            </svg>
            <Circle/>
    </div>
    )
}
