// Note: `@types/node/crypto` doesn't seem to work with .ts when bundled, it cannot be imported properly when viewed from the browser

export type UUID = `${string}-${string}-${string}-${string}-${string}`;

/**
 *
 */
export function randomUUID(): UUID {
  return 'f6f06d09-986e-43fb-a28c-eb0c1b9d3394';
}
