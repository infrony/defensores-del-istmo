/**
 * Uniform grid spatial hash para queries de "enemigo más cercano".
 * Genérico para evitar acoplar a Enemy directamente.
 */
export interface HasPosition {
  x: number;
  y: number;
}

export class SpatialHash<T extends HasPosition> {
  private cells = new Map<number, T[]>();
  private readonly cellSize: number;

  constructor(cellSize = 128) {
    this.cellSize = cellSize;
  }

  clear(): void {
    this.cells.clear();
  }

  insert(item: T): void {
    const key = this.key(item.x, item.y);
    const bucket = this.cells.get(key);
    if (bucket) bucket.push(item);
    else this.cells.set(key, [item]);
  }

  /** Returns nearest item within `radius`, or null. Squared-distance comparison. */
  queryNearest(x: number, y: number, radius: number, accept: (t: T) => boolean): T | null {
    const r = Math.ceil(radius / this.cellSize);
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    const rSq = radius * radius;
    let best: T | null = null;
    let bestSq = rSq;
    for (let ix = cx - r; ix <= cx + r; ix++) {
      for (let iy = cy - r; iy <= cy + r; iy++) {
        const bucket = this.cells.get(this.hash(ix, iy));
        if (!bucket) continue;
        for (let k = 0; k < bucket.length; k++) {
          const it = bucket[k];
          if (!accept(it)) continue;
          const dx = it.x - x;
          const dy = it.y - y;
          const dSq = dx * dx + dy * dy;
          if (dSq < bestSq) {
            bestSq = dSq;
            best = it;
          }
        }
      }
    }
    return best;
  }

  private key(x: number, y: number): number {
    return this.hash(Math.floor(x / this.cellSize), Math.floor(y / this.cellSize));
  }

  /** Cantor pairing-ish hash (works for negative cells too). */
  private hash(ix: number, iy: number): number {
    const a = ix >= 0 ? 2 * ix : -2 * ix - 1;
    const b = iy >= 0 ? 2 * iy : -2 * iy - 1;
    return ((a + b) * (a + b + 1)) / 2 + b;
  }
}
