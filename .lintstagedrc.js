module.exports = {
  "**/*.{js,jsx,ts,tsx}": ["biome format --write", "biome lint"],
  "*.json": ["biome format --write"],
};
