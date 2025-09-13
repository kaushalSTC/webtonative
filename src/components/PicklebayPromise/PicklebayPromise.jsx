import React from 'react'
import { PicklebayPromise as PicklebayPromiseImage } from '../../assets'

function PicklebayPromise() {
  return (
    <>
        <div className='w-full h-[10px] bg-f2f2f2 my-7 md:my-12'></div>
        <div className='px-[35px] md:px-12'>
            <img src={PicklebayPromiseImage} alt="picklebay promise" className='w-full h-full object-cover '/>
        </div>
    </>
  )
}

export default PicklebayPromise