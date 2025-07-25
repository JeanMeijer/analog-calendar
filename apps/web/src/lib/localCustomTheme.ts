export function loadCustomThemeFromLocalStorage() {
  if (typeof window === "undefined") return;

  const stored = localStorage.getItem("custom-theme");
  if (!stored) return;

  try {
    const theme = JSON.parse(stored);
    for (const token in theme) {
      document.documentElement.style.setProperty(token, theme[token]);
    }
  } catch (err) {
    console.warn("Failed to load custom theme", err);
  }
}
