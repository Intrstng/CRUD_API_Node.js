import { InMemoryDatabaseInterface, UserType } from './data';
import { v4 } from 'uuid';


// Singleton InMemoryDatabase implementation
class InMemoryDatabase implements InMemoryDatabaseInterface {
  private static instance: InMemoryDatabase;
  private data: { [key: string]: UserType } = {};

  public static getInstance(): InMemoryDatabase {
    if (!InMemoryDatabase.instance) {
      InMemoryDatabase.instance = new InMemoryDatabase();
    }
    return InMemoryDatabase.instance;
  }

  public getAll(): UserType[] {
    return Object.values(this.data);
  }

  public getItem(id: string): UserType | null {
    return this.data[id] || null;
  }

  public deleteItem(id: string): UserType | null {
    if (!this.data[id]) {
      return null;
    }
    const deletedItem = this.data[id];
    delete this.data[id];
    return deletedItem;
  }

  public createItem(item: Omit<UserType, 'id'>): UserType {
    const id = v4();
    this.data[id] = { ...item, id };
    return this.data[id];
  }

  public updateItem(id: string, item: Partial<Omit<UserType, 'id'>>): UserType | null {
    if (!this.data[id]) {
      return null;
    }
    this.data[id] = { ...this.data[id], ...item, id: this.data[id].id};
    return this.data[id];
  }
}

export default InMemoryDatabase;
