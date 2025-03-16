import Circle from './circle'
import {circle_radius,grid_spacing} from '../constants/GameConstants'
interface GameBoardProps{
    width:number;
    height:number;
}
export default function GameBoard({widht,height}:GameBoardProps):JSX.Element{
     
    
    return (

    <div className='grid grid-cols-10 gap-6'>
            <Circle/>
    </div>
    )
}
