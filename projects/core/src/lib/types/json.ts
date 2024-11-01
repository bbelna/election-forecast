/**
 * JSON data keyed by strings.
 * @template T Optional, defaults to `string`. The type of the values in the
 * JSON object.
 */
export type Json<T = string> = { [key: string]: T };
