// Shaders
export { VERTEX_SHADER, FRAGMENT_SHADER } from "./shaders";

// Utilities
export {
  compileShader,
  createProgram,
  createFullscreenQuad,
  createVideoTexture,
  createAsciiAtlas,
  calculateGridDimensions,
  createUniformSetter,
} from "./utils";

// Types and constants
export {
  CHAR_WIDTH_RATIO,
  type AsciiStats,
  type GridDimensions,
  type UniformSetter,
  type UniformLocations,
  type UseAsciiMeOptions,
  type UseAsciiMouseEffectOptions,
  type UseAsciiRippleOptions,
  type UseAsciiAudioOptions,
  type AsciiContext,
  type MouseEffectHandlers,
  type RippleHandlers,
  type AsciiMeProps,
  type AsciiMeWebGLProps,
  type BenchmarkStats,
  type WebGLResources,
  type Ripple,
} from "./types";
