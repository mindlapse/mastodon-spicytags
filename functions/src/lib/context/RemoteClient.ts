
export default abstract class RemoteClient<T> {
  private config: RemoteClientConfig<T>;
  private client?: T;

  constructor(config: RemoteClientConfig<T>) {
    this.config = config;
  }

  /**
   * Initialize the client
   */
  async initializeClient() {
    this.client = await this.config.init?.();
  }

  /**
   * Get client
   * @returns An instance of the client
   * @throws Error if the client was not initialized.
   */
  getClient(): T {
    if (!this.client) throw Error("Not initialized");
    return this.client;
  }

  /**
   * Cleanup any resources, connections, etc
   */
  async cleanUp() {
    if (this.client) {
      await this.config?.cleanUp?.(this.client!);
    }
  }
}

export interface RemoteClientConfig<T> {
  init: () => Promise<T>;
  cleanUp?: (client: T) => Promise<void>;
}
