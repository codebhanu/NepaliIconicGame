'use client'
import {useRef,useEffect} from 'react';

export default function Circle ():JSX.Element{

    return (
    <svg height="100" width="100" xmlns="http://www.w3.org/2000/svg">
  <circle r="45" cx="50" cy="50" stroke="black" stroke-width="3" fill="white" />
</svg> 
    )

};
