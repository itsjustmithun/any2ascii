# Dithering Implementation

## Overview

Dithering has been added to the any2ascii module to create smoother gradients and reduce banding in ASCII art. This is particularly useful when using character sets with fewer characters.

## What is Dithering?

Dithering is a technique that creates the illusion of smoother gradients by adding intentional noise patterns. Instead of directly mapping brightness values to characters, dithering adds a threshold offset based on pixel position, allowing gradients to appear smoother even with limited characters.

## Implementation Details

### Shader Changes
- Added `uniform float u_ditherMode` to control dithering type
- Implemented two dithering algorithms:
  - **Bayer Matrix Dithering**: Uses a 4x4 Bayer matrix for ordered, consistent patterns
  - **Random Dithering**: Uses pseudo-random noise for organic, film-like grain

### Code Location
- Shader: `src/lib/webgl/shaders/fragment.glsl`
- Types: `src/lib/webgl/types.ts`
- Hook: `src/hooks/useAny2Ascii.ts`
- Component: `src/components/Any2Ascii.tsx`

## Usage

```tsx
import Any2Ascii from "any2ascii";

// No dithering (default)
<Any2Ascii src="/video.mp4" dither="none" />

// Bayer matrix dithering (ordered patterns)
<Any2Ascii src="/video.mp4" dither="bayer" />

// Random dithering (organic grain)
<Any2Ascii src="/video.mp4" dither="random" />
```

## When to Use Dithering

1. **Minimal Character Sets**: Using `minimal` or `binary` charsets benefits most from dithering
2. **Smooth Gradients**: When you want to reduce banding in smooth color transitions
3. **Artistic Effect**: Random dithering adds film-like grain
4. **Low Column Count**: Fewer columns = fewer characters = more visible banding without dithering

## Comparison

### Without Dithering (`dither="none"`)
- Sharp transitions between character brightness levels
- May show visible banding in gradients
- Cleaner, more digital look

### Bayer Dithering (`dither="bayer"`)
- Consistent ordered pattern
- Smooth gradients with predictable texture
- Classic dithering look (like old newspaper prints)

### Random Dithering (`dither="random"`)
- Organic, film-like grain
- Less visible patterns than Bayer
- Changes per frame (may flicker slightly)

## Technical Details

### Bayer Matrix
The implementation uses a 4x4 Bayer matrix normalized to [0,1]:
```glsl
mat4 bayer = mat4(
  0.0/16.0,  8.0/16.0,  2.0/16.0, 10.0/16.0,
  12.0/16.0, 4.0/16.0, 14.0/16.0,  6.0/16.0,
  3.0/16.0, 11.0/16.0,  1.0/16.0,  9.0/16.0,
  15.0/16.0, 7.0/16.0, 13.0/16.0,  5.0/16.0
);
```

The threshold is added to brightness before character mapping:
```glsl
float ditherAmount = (1.0 / u_numChars) * 0.75;
ditheredBrightness += (threshold - 0.5) * ditherAmount;
```

### Random Dithering
Uses a simple hash function based on pixel coordinates:
```glsl
float noise = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
float ditherAmount = (1.0 / u_numChars) * 0.5;
ditheredBrightness += (noise - 0.5) * ditherAmount;
```

## Performance

Dithering adds minimal overhead:
- 1-2 additional texture lookups for Bayer matrix
- Simple arithmetic operations
- No significant FPS impact on modern GPUs

## Examples

```tsx
// Film grain effect with minimal characters
<Any2Ascii 
  src="/video.mp4"
  charset="minimal"
  dither="random"
  colored={false}
/>

// Smooth gradients with standard charset
<Any2Ascii 
  src="/video.mp4"
  charset="standard"
  dither="bayer"
  brightness={0.9}
/>

// High detail without dithering
<Any2Ascii 
  src="/video.mp4"
  charset="detailed"
  dither="none"
/>
```
