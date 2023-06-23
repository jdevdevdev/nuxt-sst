import { fileURLToPath } from 'node:url'
import type { NitroPreset } from "nitropack";

function defineNitroPreset(preset: NitroPreset) {
  return preset;
}

export default defineNitroPreset({
  entry: fileURLToPath(new URL('./entry.ts', import.meta.url)),
})