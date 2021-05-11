export type StorageType = "local" | "session"
export type Storage = Record<StorageType, Record<string, string>[]>

// Singleton class to store the session or local storage
// accross the tests

export class GenericStorageStore {
    private static _instance: GenericStorageStore;

    strorage = {} as Storage

    // private constructor to prevent the usage of "new GenericStorage()"
    private constructor() {/** */}

    getStorageInstance(){
      if (!this.strorage){
        this.strorage = {} as Storage
      }

      return this.strorage
    }

    set(type: StorageType, toStore: Record<string, string>[]){
      this.strorage[type] = toStore
    }

    get(type: StorageType){
      return this.strorage[type]
    }

    public static get Instance()
    {
      return this._instance || (this._instance = new this())
    }
}