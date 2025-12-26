import React, { useState } from 'react'
import AsciiMe from 'asciime'
import './App.css'

export default function App() {
  const [imageUrl, setImageUrl] = useState('https://picsum.photos/800/600')

  return (
    <div className="container">
      <h1>AsciiMe</h1>
      
      {/* Video Examples */}
      <section className="section">        
        <div className="demo">
          <h3>Basic Video with Mouse Trail</h3>
          <AsciiMe 
            src="/hummingbird.mp4" 
            mediaType="video"
            numColumns={100}
            colored={true}
            autoPlay={true}
            enableMouse={true}
            trailLength={20}
            showStats={true}
          />
        </div>

        <div className="demo">
          <h3>Video with Ripple Effect</h3>
          <p className="description">Click to create ripples</p>
          <AsciiMe 
            src="/parrots.mp4" 
            mediaType="video"
            numColumns={120}
            colored={true}
            autoPlay={true}
            enableRipple={true}
            rippleSpeed={30}
            showStats={true}
          />
        </div>
      </section>

      {/* Image Examples */}
      <section className="section">        
        <div className="demo">
          <h3>Basic Image to ASCII</h3>
          <p className="description">Converting a static image with colored output</p>
          <AsciiMe 
            src="https://picsum.photos/800/600"
            mediaType="image"
            numColumns={120}
            colored={true}
            showStats={true}
          />
        </div>

        <div className="demo">
          <h3>Image with Mouse Effects</h3>
          <p className="description">Move your mouse over the image</p>
          <AsciiMe 
            src="https://picsum.photos/id/237/800/600"
            mediaType="image"
            numColumns={100}
            colored={true}
            enableMouse={true}
            trailLength={20}
            showStats={true}
          />
        </div>

      </section>
    </div>
  )
}
