PROJECT OVERVIEW
================

This document explains, exactly and only as implemented in the repository, how the `asciime` library works, how to run it locally, what inputs it expects from code evidence, and known gaps. All references point to files and symbols present in the codebase.

1. What this package is
- Package provides a React component named `AsciiMe` that renders a WebGL canvas and uses a video source to render an ASCII representation of the video in real-time. The component is exported from `src/components/AsciiMe.tsx` and re-exported by `src/index.ts`.

2. Entry point and build
- Library entry file: `src/index.ts` (exports `AsciiMe`).
- Build tool: `tsup` (configured by `tsup.config.ts`).
- package.json scripts (evidence): `build` → `tsup`, `lint` → `eslint src/`, `prepublishOnly` → `npm run build`.

3. High-level runtime pipeline (strictly from code)
1) The `AsciiMe` React component (src/components/AsciiMe.tsx) renders a hidden `<video>` element and a visible `<canvas>` element. The `<video>` receives the `src` prop and attributes like `loop`, `playsInline`, `muted`, and `crossOrigin="anonymous"`.
2) The core hook `useAsciiMe` (src/hooks/useAsciiMe.ts) supplies refs (`videoRef`, `canvasRef`) and is responsible for WebGL setup, atlas generation, and the render loop.
3) During setup `useAsciiMe` calculates grid dimensions (via utilities in `src/lib/webgl/utils.ts`), initializes a WebGL2 rendering context, compiles shaders (vertex and fragment shaders from `src/lib/webgl/shaders/*.glsl`), and creates GPU resources (vertex buffers, textures).
4) An ASCII atlas texture is created by drawing characters onto an offscreen 2D canvas and uploading it as a texture (see `createAsciiAtlas` in `src/lib/webgl/utils.ts` and the `ASCII_CHARSETS` in `src/lib/ascii-charsets.ts`).
5) Per frame, the current video frame is uploaded directly to the video texture using WebGL calls such as `gl.texImage2D(..., video)` (see `src/hooks/useAsciiMe.ts`).
6) The fragment shader (`src/lib/webgl/shaders/fragment.glsl`) maps sampled video brightness to a character index, samples that character from the ascii atlas, optionally colors it (colored vs terminal-green), and composes audio/mouse/ripple effects into the final color output.
7) Optional features are integrated via hooks that register per-frame uniform setters: `useAsciiAudio` (src/hooks/useAsciiAudio.ts) for audio-driven uniforms, `useAsciiMouseEffect` (src/hooks/useAsciiMouseEffect.ts) for mouse-based uniforms, and `useAsciiRipple` (src/hooks/useAsciiRipple.ts) for click ripples.

4. Key runtime components (exact file references)
- `AsciiMe` — `src/components/AsciiMe.tsx`: React component rendering `<video>` and `<canvas>` and wiring hooks.
- `useAsciiMe` — `src/hooks/useAsciiMe.ts`: Core WebGL setup, shader compilation/linking, atlas creation, texture upload, render loop.
- `useAsciiAudio` — `src/hooks/useAsciiAudio.ts`: Web Audio API analyzer, registers uniform setter to supply audio level to shader.
- `useAsciiMouseEffect` — `src/hooks/useAsciiMouseEffect.ts`: Tracks normalized mouse coordinates, registers uniform setter for `u_mouse` and related uniforms.
- `useAsciiRipple` — `src/hooks/useAsciiRipple.ts`: Manages ripple events on click and registers per-frame ripple uniforms.
- `ASCII_CHARSETS` & helpers — `src/lib/ascii-charsets.ts`: Character sets and helpers used to build the atlas.
- WebGL utilities — `src/lib/webgl/utils.ts`: shader compile/link helpers, quad creation, texture creation (video & atlas), grid calculation.
- Shaders — `src/lib/webgl/shaders/vertex.glsl` and `src/lib/webgl/shaders/fragment.glsl`.

5. Supported input types and formats (evidence only)
- The code uses an `HTMLVideoElement` as the input media source. Evidence:
  - `videoRef` is typed `useRef<HTMLVideoElement>(null)` in `src/hooks/useAsciiMe.ts`.
  - The `<video>` element in `src/components/AsciiMe.tsx` sets `src={src}` and attributes `muted`, `loop`, `playsInline`, `crossOrigin="anonymous"`.
  - The video frame is uploaded to WebGL with `gl.texImage2D(..., video)` (see `src/hooks/useAsciiMe.ts`).
- There is no code that performs file-input handling or creates `ObjectURL`s (search for `createObjectURL`, `MediaSource`, or `input type="file"` returned no matches). Therefore the library, as-is, expects a URL (or any value that can be assigned to a `<video src=...>` attribute) and does not provide a built-in upload UI.
- The README contains an example using an `.mp4` URL, but there is no code that restricts or validates file extensions or MIME types. The runtime will accept any source that the browser can play in an HTMLVideoElement and that allows pixel read access (CORS considerations noted below).

6. WebGL & shader details (evidence)
- Shaders are provided in `src/lib/webgl/shaders/*.glsl` and imported by the WebGL setup code in `src/hooks/useAsciiMe.ts` and `src/lib/webgl/shaders.ts`.
- `createAsciiAtlas` (in `src/lib/webgl/utils.ts`) draws glyphs to an offscreen 2D canvas and uploads them as a texture used by the fragment shader to sample character bitmaps.
- The fragment shader maps brightness to character index and composes final color, applying uniforms set by audio/mouse/ripple hooks.

7. Audio and interaction features (evidence)
- Audio: `src/hooks/useAsciiAudio.ts` uses the Web Audio API (`AudioContext`, `createMediaElementSource`, `AnalyserNode`) to compute per-frame audio levels and register a shader uniform setter.
- Mouse: `src/hooks/useAsciiMouseEffect.ts` registers event handlers and a per-frame uniform setter for mouse position and trail.
- Ripple: `src/hooks/useAsciiRipple.ts` records clicks and supplies ripple-related uniforms per-frame.

8. How to run locally (exact commands)
From the repository root, the package provides build and lint scripts. There is no dev/demo `start` or `dev` script.

Commands to run locally (install and build):
```bash
npm install
npm run build
npm run lint
```

Notes:
- The package is structured as a library (see `package.json` fields `main`, `module`, and `types` pointing to `dist/*`). There is no bundled demo app or `start` script; to test the component you must import it into a React application (or create a small demo) and provide a playable video URL.

9. CORS and pixel access
- The video element in `src/components/AsciiMe.tsx` sets `crossOrigin="anonymous"`. Sampling video pixels into WebGL requires the video resource to either be same-origin or served with permissive CORS headers; otherwise WebGL pixel read/upload may fail or be tainted. The code expects to be able to call `gl.texImage2D(..., video)`, which will succeed only if the browser permits it for the given video URL.

10. Known gaps and questions (from repo evidence)
- There is no example/demo app or `dev` script in `package.json`. If you want an interactive local playground, add a small demo app (Vite/CRA) or an `examples/` folder.
- No file-upload UI is present; the library expects a URL assigned to the `<video>` `src` prop.
- There is no explicit format whitelist in code; any format the browser can play is accepted, but the README uses an `.mp4` example.
- The code relies on WebGL2; when WebGL2 isn't available the library logs and exits (see `useAsciiMe` checks). There is no CPU fallback.

11. Where to look in the code (quick links)
- `src/components/AsciiMe.tsx`
- `src/hooks/useAsciiMe.ts`
- `src/hooks/useAsciiAudio.ts`
- `src/hooks/useAsciiMouseEffect.ts`
- `src/hooks/useAsciiRipple.ts`
- `src/lib/webgl/utils.ts`
- `src/lib/webgl/shaders/fragment.glsl`
- `src/lib/ascii-charsets.ts`
- `package.json`

End of PROJECT_OVERVIEW.md (no code changed)
