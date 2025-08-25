export function getRandomJellyElements(assets: string[], count: number = 2) {
  const shuffled = [...assets].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
