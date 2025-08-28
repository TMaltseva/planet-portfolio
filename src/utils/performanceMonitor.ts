export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fpsHistory: number[] = [];
  private gpuLoadHistory: number[] = [];
  private isMonitoring = false;

  startMonitoring() {
    this.isMonitoring = true;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fpsHistory = [];
    this.gpuLoadHistory = [];

    this.monitorFrame();
  }

  stopMonitoring() {
    this.isMonitoring = false;
  }

  private monitorFrame() {
    if (!this.isMonitoring) return;

    this.frameCount++;
    const currentTime = performance.now();

    if (currentTime - this.lastTime >= 1000) {
      const fps = Math.round(
        (this.frameCount * 1000) / (currentTime - this.lastTime)
      );
      this.fpsHistory.push(fps);

      if (this.fpsHistory.length > 10) {
        this.fpsHistory.shift();
      }

      const avgFps =
        this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
      const gpuLoad = Math.max(0, Math.min(100, ((60 - avgFps) / 60) * 100));
      this.gpuLoadHistory.push(gpuLoad);

      if (this.gpuLoadHistory.length > 10) {
        this.gpuLoadHistory.shift();
      }

      this.frameCount = 0;
      this.lastTime = currentTime;
    }

    requestAnimationFrame(() => this.monitorFrame());
  }

  getPerformanceStats() {
    if (this.fpsHistory.length === 0) return null;

    const avgFps =
      this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
    const avgGpuLoad =
      this.gpuLoadHistory.reduce((a, b) => a + b, 0) /
      this.gpuLoadHistory.length;

    return {
      avgFps: avgFps.toFixed(1),
      avgGpuLoad: avgGpuLoad.toFixed(1),
      samples: this.fpsHistory.length,
    };
  }

  estimateBatterySavings(animationsStopped: boolean) {
    if (!animationsStopped) return 0;

    const baseBatteryDrain = 100;
    const savingsPercentage = 0.3;

    return Math.round(baseBatteryDrain * savingsPercentage);
  }
}

export const performanceMonitor = new PerformanceMonitor();
