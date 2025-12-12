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

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY);

/**
 * Lightweight Supabase REST adapter. This fetches all rows for read/filter operations
 * and issues targeted writes by `id`. It keeps the same surface as JsonStorage to
 * minimize changes across the app. Guarded behind env flags.
 */
// istanbul ignore next
class SupabaseStorage<T extends { id: string }> {
  private table: string;
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(table: string) {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      throw new Error('Supabase environment variables are not configured');
    }
    this.table = table;
    this.baseUrl = `${SUPABASE_URL}/rest/v1/${table}`;
    this.headers = {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    };
  }

  private async handleResponse<R>(res: Response, action: string): Promise<R> {
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Supabase ${action} failed: ${res.status} ${text}`);
    }
    return res.json() as Promise<R>;
  }

  async readAll(): Promise<T[]> {
    const res = await fetch(`${this.baseUrl}?select=*`, { headers: this.headers });
    return this.handleResponse<T[]>(res, 'readAll');
  }

  async findOne(predicate: (item: T) => boolean): Promise<T | undefined> {
    const data = await this.readAll();
    return data.find(predicate);
  }

  async findMany(predicate: (item: T) => boolean): Promise<T[]> {
    const data = await this.readAll();
    return data.filter(predicate);
  }

  async create(item: T): Promise<T> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(item),
    });
    const [created] = await this.handleResponse<T[]>(res, 'create');
    return created ?? item;
  }

  async update(predicate: (item: T) => boolean, updates: Partial<T>): Promise<T | null> {
    const existing = await this.findOne(predicate);
    if (!existing || !existing.id) return null;

    const res = await fetch(`${this.baseUrl}?id=eq.${encodeURIComponent(existing.id)}`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(updates),
    });

    const [updated] = await this.handleResponse<T[]>(res, 'update');
    return updated ?? { ...existing, ...updates };
  }

  async delete(predicate: (item: T) => boolean): Promise<boolean> {
    const existing = await this.findOne(predicate);
    if (!existing || !existing.id) return false;

    const res = await fetch(`${this.baseUrl}?id=eq.${encodeURIComponent(existing.id)}`, {
      method: 'DELETE',
      headers: this.headers,
    });

    await this.handleResponse(res, 'delete');
    return true;
  }
}

const createStorage = <T extends { id: string }>(table: string, filename: string) =>
  hasSupabase ? new SupabaseStorage<T>(table) : new JsonStorage<T>(filename);

/**
 * Storage instances for each data type
 */
export const storage = {
  users: createStorage<import('./types').User>('users', 'users.json'),
  cases: createStorage<import('./types').Case>('cases', 'cases.json'),
  updates: createStorage<import('./types').CaseUpdate>('updates', 'updates.json'),
  admins: createStorage<import('./types').Admin>('admins', 'admins.json'),
  config: createStorage<import('./types').YouTubeConfig>('config', 'config.json'),
};

export type StorageAdapter<T> = JsonStorage<T> | SupabaseStorage<T & { id: string }>;
