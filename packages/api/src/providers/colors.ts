import z from "zod";

const HEX_REGEX = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

const hexToRgbObjectSchema = z
  .string()
  .regex(HEX_REGEX, { message: "Invalid hex color format" })
  .transform((rawHex) => {
    let hex = rawHex.replace(/^#/, "");
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((ch) => ch + ch)
        .join("");
    }
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  });

// Usage:
// const { r, g, b } = hexToRgbObjectSchema.parse("#1a2b3c");

const COLORS = [
  "#FB2C36",
  "#FF6900",
  "#F0B100",
  "#00C950",
  "#2B7FFF",
  "#AD46FF",
];

export function assignColor(index: number) {
  return COLORS[index % COLORS.length];
}
