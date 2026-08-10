/**
 * LLM Output Sanitizer
 * Prevents repetition loops (e.g. "producingproducingproducing") from crashing 
 * the frontend or clogging the mesh.
 */
export function sanitizeLLMOutput(text) {
  if (!text) return text;
  
  // Split by whitespace or just check for contiguous string repetitions
  // The user requested: "executes on the third repeat of a word"
  
  // Regex to detect a word/token repeating 3 or more times consecutively
  // e.g. "producingproducingproducing" (no spaces) or "producing producing producing"
  const repetitionRegex = /(.{3,})(?:\s*\1){2,}/i;
  
  const match = text.match(repetitionRegex);
  if (match) {
    console.warn(`[Sanitizer] Loop detected! Truncating output at: "${match[1]}"`);
    // Find the index of the first repetition and truncate there
    return text.substring(0, match.index + match[1].length) + '... [ERR_LOOP_DETECTED]';
  }
  
  return text;
}
