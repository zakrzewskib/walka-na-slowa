import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Node's experimental global localStorage has no working methods without
// --localstorage-file and shadows jsdom's implementation, so use a simple in-memory one.
class MemoryStorage implements Storage {
  private data = new Map<string, string>();

  get length() {
    return this.data.size;
  }
  clear() {
    this.data.clear();
  }
  getItem(key: string) {
    return this.data.get(key) ?? null;
  }
  key(index: number) {
    return [...this.data.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.data.delete(key);
  }
  setItem(key: string, value: string) {
    this.data.set(key, String(value));
  }
}

vi.stubGlobal('localStorage', new MemoryStorage());
