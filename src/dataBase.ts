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

  public getAll(): Promise<UserType[]> {
    return new Promise((resolve) => {
      resolve(Object.values(this.data));
    });
  }

  public getItem(id: string): Promise<UserType | null> {
    return new Promise((resolve) => {
      resolve(this.data[id] || null);
    });
  }

  public deleteItem(id: string): Promise<UserType | null> {
    return new Promise((resolve) => {
      if (!this.data[id]) {
        resolve(null);
      } else {
        const deletedItem = this.data[id];
        delete this.data[id];
        resolve(deletedItem);
      }
    });
  }

  public createItem(item: Omit<UserType, 'id'>): Promise<UserType> {
    return new Promise((resolve) => {
      const id = v4();
      this.data[id] = { ...item, id };
      resolve(this.data[id]);
    });
  }

  public updateItem(id: string, item: Partial<Omit<UserType, 'id'>>): Promise<UserType | null> {
    return new Promise((resolve) => {
      if (!this.data[id]) {
        resolve(null);
      } else {
        this.data[id] = { ...this.data[id], ...item, id: this.data[id].id };
        resolve(this.data[id]);
      }
    });
  }
}

export default InMemoryDatabase;
