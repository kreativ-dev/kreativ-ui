/**
 * Stand-in matching the locked Dialog stack model:
 * isRegistered -> isTopmost -> isSuspended = isRegistered && !isTopmost.
 * register(id) is a no-op if already registered. Knows NOTHING about dedupe/conflicts.
 */
export class DialogStack {
  private order: string[] = [];
  private listeners = new Set<() => void>();
  private version = 0;

  register = (id: string) => {
    if (this.order.includes(id)) return;
    this.order = [...this.order, id];
    this.emit();
  };

  unregister = (id: string) => {
    if (!this.order.includes(id)) return;
    this.order = this.order.filter((x) => x !== id);
    this.emit();
  };

  isRegistered = (id: string) => this.order.includes(id);
  isTopmost = (id: string) => this.order[this.order.length - 1] === id;
  isSuspended = (id: string) => this.isRegistered(id) && !this.isTopmost(id);

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };
  /** Changes on every mutation — for useSyncExternalStore. */
  getSnapshot = () => this.version;

  private emit() {
    this.version++;
    this.listeners.forEach((l) => l());
  }
}
