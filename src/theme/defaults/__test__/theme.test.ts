import { defaultTheme } from "../theme";

console.log("PASS: real defaultTheme compiles and constructs successfully");
console.log("intensity:", defaultTheme.intensity);
console.log("has brand semantic color:", "brand" in defaultTheme.semanticTokens.colors!);
