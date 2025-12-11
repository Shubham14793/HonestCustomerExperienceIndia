import { promises as fs } from 'fs';
import path from 'path';
import { logger } from './logger';

// Use a writable directory when running in serverless (e.g., Vercel) where the repo path is read-only.
// Allow override via DATA_DIR env for flexibility; default to /tmp on Vercel, repo-local otherwise.
const DATA_DIR = process.env.DATA_DIR
  ? process.env.DATA_DIR
  : process.env.VERCEL
    ? '/tmp/hcei-data'
    : path.join(process.cwd(), 'data');

/**
 * Generic JSON file handler for data persistence
 */
export class JsonStorage<T> {
  private filePath: string;

  constructor(filename: string) {
    this.filePath = path.join(DATA_DIR, filename);
  }

  /**
   * Read all data from JSON file
   */
  async readAll(): Promise<T[]> {
    try {
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      await fs.access(this.filePath);
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      logger.warn('storage.readAll fallback to empty array', {
        filePath: this.filePath,
        error: (error as Error).message,
      });
      return [];
    }
  }

  /**
   * Write data to JSON file
   */
  async writeAll(data: T[]): Promise<void> {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  /**
   * Find item by predicate
   */
  async findOne(predicate: (item: T) => boolean): Promise<T | undefined> {
    const data = await this.readAll();
    return data.find(predicate);
  }

  /**
   * Find all items matching predicate
   */
  async findMany(predicate: (item: T) => boolean): Promise<T[]> {
    const data = await this.readAll();
    return data.filter(predicate);
  }

  /**
   * Add new item
   */
  async create(item: T): Promise<T> {
    const data = await this.readAll();
    data.push(item);
    await this.writeAll(data);
    return item;
  }

  /**
   * Update item by predicate
   */
  async update(predicate: (item: T) => boolean, updates: Partial<T>): Promise<T | null> {
    const data = await this.readAll();
    const index = data.findIndex(predicate);
    
    if (index === -1) return null;
    
    data[index] = { ...data[index], ...updates };
    await this.writeAll(data);
    return data[index];
  }

  /**
   * Delete item by predicate
   */
  async delete(predicate: (item: T) => boolean): Promise<boolean> {
    const data = await this.readAll();
    const filteredData = data.filter(item => !predicate(item));
    
    if (filteredData.length === data.length) return false;
    
    await this.writeAll(filteredData);
    return true;
  }
}

/**
 * Storage instances for each data type
 */
export const storage = {
  users: new JsonStorage<import('./types').User>('users.json'),
  cases: new JsonStorage<import('./types').Case>('cases.json'),
  updates: new JsonStorage<import('./types').CaseUpdate>('updates.json'),
  admins: new JsonStorage<import('./types').Admin>('admins.json'),
  config: new JsonStorage<import('./types').YouTubeConfig>('config.json'),
};
