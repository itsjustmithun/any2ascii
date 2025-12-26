# asciime

WebGL-powered React Component for real-time video or image to ASCII conversion.

## Demo

![bike.gif](./assets/bike.gif)

![gta.jpeg](./assets/gta.jpeg)

## Installation

```bash
npm install asciime
```

Or with yarn:
```bash
yarn add asciime
```

## Quick Start

```tsx
import AsciiMe from "asciime";

function App() {
  return (
    <AsciiMe
      src="/video.mp4"
      numColumns={120}
      colored={true}
      brightness={1.0}
      audioEffect={50}
      enableMouse={true}
      enableRipple={true}
      charset="detailed"
      isPlaying={true}
      autoPlay={true}
    />
  );
}
```

### Basic Usage

```tsx
// Minimal setup
<AsciiMe src="/video.mp4" />

// With custom styling
<AsciiMe 
  src="/video.mp4" 
  numColumns={80}
  colored={false}
  className="my-ascii-player"
/>
```

## API Reference

### Props

| Prop                   | Type         | Default      | Description                                       |
| ---------------------- | ------------ | ------------ | ------------------------------------------------- |
| `src`                  | `string`     | **required** | Video URL or path                                 |
| `numColumns`           | `number`     | `auto`       | Number of ASCII columns (controls detail level)   |
| `colored`              | `boolean`    | `true`       | Use original video colors vs green terminal style |
| `brightness`           | `number`     | `1.0`        | Brightness multiplier (0-2, 1.0 = normal)         |
| `blend`                | `number`     | `0`          | Blend original video with ASCII (0-100)           |
| `highlight`            | `number`     | `0`          | Background highlight intensity (0-100)            |
| `dither`               | `string`     | `"none"`     | Dithering mode: `"none"`, `"bayer"`, `"random"`   |
| `charset`              | `CharsetKey` | `"standard"` | Character set for ASCII rendering                 |
| `enableMouse`          | `boolean`    | `true`       | Enable cursor glow effect                         |
| `trailLength`          | `number`     | `24`         | Mouse trail persistence (frames)                  |
| `enableRipple`         | `boolean`    | `false`      | Enable click ripple effect                        |
| `rippleSpeed`          | `number`     | `40`         | Ripple expansion speed                            |
| `audioEffect`          | `number`     | `0`          | Audio-reactive brightness (0-100)                 |
| `audioRange`           | `number`     | `50`         | Audio effect intensity range (0-100)              |
| `isPlaying`            | `boolean`    | `true`       | Control video playback state                      |
| `autoPlay`             | `boolean`    | `true`       | Auto-play video on mount                          |
| `enableSpacebarToggle` | `boolean`    | `false`      | Toggle play/pause with spacebar                   |
| `showStats`            | `boolean`    | `false`      | Show FPS performance overlay                      |
| `className`            | `string`     | `""`         | Custom CSS class name                             |

## Character Sets

Available character sets for different visual styles:

```tsx
import { ASCII_CHARSETS } from "asciime";

// Use in your component
<AsciiMe src="/video.mp4" charset="detailed" />
```

| Charset     | Characters               | Description                      |
| ----------- | ------------------------ | -------------------------------- |
| `standard`  | `@%#*+=-:. `             | Classic ASCII art look           |
| `detailed`  | 70 characters            | Full gradient with fine detail   |
| `blocks`    | `█▓▒░ `                  | Block-based rendering            |
| `minimal`   | `@#. `                   | Minimalist style                 |
| `binary`    | `10 `                    | Binary/matrix effect             |
| `dots`      | `●◉○◌ `                  | Circular dot patterns            |
| `arrows`    | `↑↗→↘↓↙←↖ `               | Directional arrows               |
| `emoji`     | Various emoji            | Fun emoji-based visualization    |

## Dithering

Dithering creates smoother gradients by adding intentional patterns to the ASCII output. This helps reduce banding artifacts when using limited character sets.

**Modes:**
- `none` - Direct brightness-to-character mapping (default)
- `bayer` - Ordered Bayer matrix dithering for consistent patterns
- `random` - Random noise dithering for organic look

Dithering is especially effective with minimal character sets or when you want film-like grain.

## Features

- **WebGL-Accelerated**: Hardware-accelerated rendering for smooth performance
- **Real-time Conversion**: Live video to ASCII transformation
- **Color Support**: Maintain original video colors or go classic monochrome
- **Audio Reactive**: Brightness responds to audio levels
- **Interactive Effects**: Mouse trails and click ripple effects
- **Full Controls**: Play, pause, seek, and control playback
- **Customizable**: Extensive prop options for fine-tuning
- **Responsive**: Adapts to container size

## Examples

### Classic Terminal Look

```tsx
<AsciiMe 
  src="/video.mp4"
  colored={false}
  charset="standard"
  brightness={0.9}
/>
```

### Audio Reactive

```tsx
<AsciiMe 
  src="/video.mp4"
  audioEffect={80}
  audioRange={70}
  charset="detailed"
/>
```

### Matrix Style

```tsx
<AsciiMe 
  src="/video.mp4"
  charset="binary"
  colored={false}
  brightness={1.2}
/>
```

### Smooth Dithering

```tsx
<AsciiMe 
  src="/video.mp4"
  dither="bayer"
  charset="minimal"
  brightness={0.9}
/>
```

### Interactive Experience

```tsx
<AsciiMe 
  src="/video.mp4"
  enableMouse={true}
  enableRipple={true}
  trailLength={32}
  rippleSpeed={50}
/>
```

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Run tests
npm test
```

## License

MIT

## Credits

Video ASCII module was inspired by [Elijah's Video2Ascii NPM Package](https://www.npmjs.com/package/video2ascii)