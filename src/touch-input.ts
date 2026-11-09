/** Live input shared by the touch surfaces and the game loop. */
export class TouchInput {
  x = 0;
  z = 0;
  running = false;
  lookX = 0;
  lookY = 0;

  move(x: number, z: number) {
    const distance = Math.hypot(x, z);
    const strength = Math.min(1, Math.max(0, (distance - 0.12) / 0.65));
    this.x = distance ? x / distance * strength : 0;
    this.z = distance ? z / distance * strength : 0;
    // Separate thresholds keep small thumb movements from flickering between gaits.
    this.running = distance >= (this.running ? 0.80 : 0.93);
  }

  reset() {
    this.move(0, 0);
    this.lookX = this.lookY = 0;
  }
}
