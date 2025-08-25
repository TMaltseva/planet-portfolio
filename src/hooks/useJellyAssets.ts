export function useJellyAssets() {
  const modules = import.meta.glob("/src/assets/jelly-elements/*.png", {
    eager: true,
    import: "default",
  }) as Record<string, string>;
  return Object.values(modules);
}
