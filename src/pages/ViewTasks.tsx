import React from 'react'
import ViewUserTask from './ViewUserTask'

export default function ViewTasks() {
    const display2 =  { display: 'block' };
  return (
    <>
    <div>
      <ViewUserTask styleFromComponent={display2}/>
      </div>
    </>
  )
}

