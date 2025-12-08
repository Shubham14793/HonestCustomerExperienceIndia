import { JsonStorage } from '@/lib/storage';
import { promises as fs } from 'fs';
import path from 'path';

// Mock the fs module
jest.mock('fs', () => ({
  promises: {
    access: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn(),
    mkdir: jest.fn(),
  },
}));

interface TestItem {
  id: string;
  name: string;
  value: number;
}

describe('JsonStorage', () => {
  let storage: JsonStorage<TestItem>;
  const testData: TestItem[] = [
    { id: '1', name: 'Item 1', value: 100 },
    { id: '2', name: 'Item 2', value: 200 },
    { id: '3', name: 'Item 3', value: 300 },
  ];

  beforeEach(() => {
    storage = new JsonStorage<TestItem>('test.json');
    jest.clearAllMocks();
  });

  describe('readAll', () => {
    it('should read all data from JSON file', async () => {
      (fs.access as jest.Mock).mockResolvedValue(undefined);
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(testData));

      const result = await storage.readAll();

      expect(result).toEqual(testData);
      expect(fs.readFile).toHaveBeenCalled();
    });

    it('should return empty array when file does not exist', async () => {
      (fs.access as jest.Mock).mockRejectedValue(new Error('File not found'));

      const result = await storage.readAll();

      expect(result).toEqual([]);
    });
  });

  describe('writeAll', () => {
    it('should write data to JSON file', async () => {
      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      await storage.writeAll(testData);

      expect(fs.mkdir).toHaveBeenCalled();
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.any(String),
        JSON.stringify(testData, null, 2),
        'utf-8'
      );
    });
  });

  describe('findOne', () => {
    beforeEach(() => {
      (fs.access as jest.Mock).mockResolvedValue(undefined);
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(testData));
    });

    it('should find item matching predicate', async () => {
      const result = await storage.findOne(item => item.id === '2');

      expect(result).toEqual(testData[1]);
    });

    it('should return undefined when no item matches', async () => {
      const result = await storage.findOne(item => item.id === '999');

      expect(result).toBeUndefined();
    });
  });

  describe('findMany', () => {
    beforeEach(() => {
      (fs.access as jest.Mock).mockResolvedValue(undefined);
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(testData));
    });

    it('should find all items matching predicate', async () => {
      const result = await storage.findMany(item => item.value > 150);

      expect(result).toHaveLength(2);
      expect(result).toEqual([testData[1], testData[2]]);
    });

    it('should return empty array when no items match', async () => {
      const result = await storage.findMany(item => item.value > 1000);

      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    beforeEach(() => {
      (fs.access as jest.Mock).mockResolvedValue(undefined);
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(testData));
      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);
    });

    it('should add new item and save to file', async () => {
      const newItem: TestItem = { id: '4', name: 'Item 4', value: 400 };

      const result = await storage.create(newItem);

      expect(result).toEqual(newItem);
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('"id": "4"'),
        'utf-8'
      );
    });
  });

  describe('update', () => {
    beforeEach(() => {
      (fs.access as jest.Mock).mockResolvedValue(undefined);
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(testData));
      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);
    });

    it('should update item matching predicate', async () => {
      const updates = { name: 'Updated Item', value: 250 };

      const result = await storage.update(item => item.id === '2', updates);

      expect(result).toBeDefined();
      expect(result?.name).toBe('Updated Item');
      expect(result?.value).toBe(250);
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should return null when no item matches', async () => {
      const updates = { name: 'Updated Item' };

      const result = await storage.update(item => item.id === '999', updates);

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      (fs.access as jest.Mock).mockResolvedValue(undefined);
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(testData));
      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);
    });

    it('should delete item matching predicate', async () => {
      const result = await storage.delete(item => item.id === '2');

      expect(result).toBe(true);
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.any(String),
        expect.not.stringContaining('"id": "2"'),
        'utf-8'
      );
    });

    it('should return false when no item matches', async () => {
      const result = await storage.delete(item => item.id === '999');

      expect(result).toBe(false);
    });
  });
});
