# Video Test

Quick test setup for AsciiMe video functionality.

## Run

```bash
# Build the library first (from repo root)
cd ../..
npm run build

# Then run the test
cd tests/video
npm install
npm run dev
```

Open http://localhost:5173

## Note

- Uses the built library from `../../dist/index.mjs`
- Video source: `../../assets/hummingbird.mp4` (symlinked in public folder)
