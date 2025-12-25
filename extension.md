EXTENSION: Add Image Support (notes & minimal plan)
=================================================

Goal: extend the library so `AsciiMe` can accept image sources (JPEG/PNG/etc.) in addition to video URLs, without changing current behavior for video. This document lists precise, minimal code changes and pointers to relevant files so you (or a contributor) can implement image support.

Important: these are implementation notes referencing exact code locations in the repository. No code is changed by this document.

1) Where input is currently handled
- `src/components/AsciiMe.tsx` renders a `<video ref={videoRef} src={src} ... />` and relies on `useAsciiMe` to set up rendering.
- `src/hooks/useAsciiMe.ts` expects `videoRef.current` to be an `HTMLVideoElement` and uses it in `gl.texImage2D(..., video)` per frame to upload the current frame.

2) Minimal functional approach to support images
- Accept either a video or image URL as the `src` prop on `AsciiMe`. Internally, detect whether the provided `src` should be treated as an image by attempting to construct an `HTMLImageElement` (new Image()) and testing `image.complete`/`onload`, or by checking a `type` prop provided by the consumer (e.g., `mediaType: 'video' | 'image'`).

3) Concrete code locations to change
- `src/components/AsciiMe.tsx`:
  - Add optional prop `mediaType?: 'video' | 'image'` (default `video`) or accept `src` of either type and forward that information to `useAsciiMe` via a new `mediaType` prop.
  - If accepting images directly in the UI, add an `img` tag or create an offscreen `Image` and keep the `<video>` element for video sources only.

- `src/hooks/useAsciiMe.ts`:
  - Modify `useAsciiMe` signature to accept a `mediaType` flag and possibly an `imageRef` or `mediaElement` (union type `HTMLVideoElement | HTMLImageElement`).
  - Where the code uploads the texture per frame (search for `gl.texImage2D(..., video)`), adapt the call to accept either `video` or `image`: `gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mediaElement);` The WebGL call accepts either `HTMLVideoElement` or `HTMLImageElement` according to the WebGL spec, so no shader changes are required for static images.
  - For image sources, the render loop need not update each animation frame unless you want animated effects; you can render once after the image loads and then, if desired, keep the render loop running for interaction (mouse/ripple/audio may still apply but audio won't for a static image).

4) Loader & lifecycle notes
- Image loading: create an `Image()` in `AsciiMe` or `useAsciiMe`, set `crossOrigin = 'anonymous'` to match current video usage, set `src`, and wait for `onload` before creating/updating the WebGL texture. Example flow (pseudo-code):

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => { /* create texture / upload via gl.texImage2D(..., img) */ };
  img.src = src;

- If the consumer supplies `mediaType: 'image'`, `AsciiMe` should not render the `<video>` element, or it can render both but hide the one not used.

5) Audio & interaction considerations
- Audio: `useAsciiAudio` attaches to a `HTMLMediaElement` (video) and uses a `MediaElementAudioSourceNode`. Static images do not have audio; if `mediaType === 'image'` skip instantiation of `useAsciiAudio` or ensure it no-ops.
- Mouse/ripple: These features are orthogonal and can continue to work with image inputs. Ripples and mouse uniforms can be registered as they are currently.

6) CORS and pixel read/upload
- Same CORS rule applies: set `img.crossOrigin = 'anonymous'` for remote images. Uploading an image to WebGL via `gl.texImage2D(..., img)` requires the image to permit cross-origin pixel access.

7) Example API additions (minimal)
- Add optional prop to `AsciiMe` component signature:

  interface AsciiMeProps {
    src: string;
    mediaType?: 'video' | 'image'; // default 'video'
    // existing props unchanged
  }

- Or allow the consumer to pass `mediaElement?: HTMLVideoElement | HTMLImageElement` in props to bypass internal element creation.

8) Render and update strategy for images
- On image load: create texture if not present, call `gl.texImage2D(..., img)`, set any uniforms that depend on media dimensions (grid size, resolution), and draw a single frame.
- If interactive effects are desired (ripples, mouse, color cycling), keep the render loop running and update uniforms per frame even for a static image.

9) Test plan (how to test locally without code changes in the library)
- Create a small local React page or sandbox that imports `AsciiMe` from this repo (built via `npm run build`) and render it with `mediaType='image'` and a public PNG/JPEG URL served with CORS allowed. Verify the image renders as ASCII.

10) Files to modify (summary)
- `src/components/AsciiMe.tsx` — add `mediaType` prop and image element/creation logic.
- `src/hooks/useAsciiMe.ts` — accept a union `HTMLVideoElement | HTMLImageElement` and adapt texture upload and setup accordingly; skip audio setup for images.

11) Open questions (so I don't make assumptions)
- Should `AsciiMe`'s public API prefer `mediaType` to be explicit, or should it auto-detect based on the supplied URL or a provided `mediaElement`? I will wait for your preference before proposing code.
- Do you want images to be treated as static (one-time render) by default or keep the animation loop active for interactive effects? (recommended default: static render, optional prop to keep loop running)

End of extension.md
