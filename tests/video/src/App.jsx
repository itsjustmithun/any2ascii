import React from 'react'
import AsciiMe from 'asciime'

export default function App() {
  return (
    <div>
      <AsciiMe 
        src="/bike.mp4" 
        numColumns={150}
        colored={true}
        autoPlay={true}
        enableMouse={true}
      />
    </div>
  )
}
