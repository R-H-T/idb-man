/**
 * =====================
 * # RHT - IDB Manager #
 * =====================
 * @name RHT - IDB Manager
 * @description
 *    RHT - IDB Manager is a helper class for simply managing data with IndexedDB.
 * @author Roberth Hansson-Tornéus (github.com/R-H-T)
 * @code https://github.com/R-H-T/idb-man
 * @copyright ©2019
 * @license MIT
 * @file idb-man.js
 */
class IDBManager {
  constructor(
    dbName = IDBM_DEFAULT_DB_NAME,
    dbVersion = IDBM_DEFAULT_DB_VERSION,
    storeKeys = []
  ) {
    this._config = {
      dbName,
      dbVersion,
      storeKeys,
    };
  }

  async openDb(
    dbName = this._config.dbName,
    dbVersion = this._config.dbVersion
  ) {
    return new Promise(async (resolve, reject) => {
      const request = indexedDB.open(dbName, dbVersion);
      request.onupgradeneeded = e => this.onUpgradeNeeded(e);
      this.dbRequestHelper(request, resolve, reject);
    });
  }

  async onUpgradeNeeded(e) {
    const db = e.target.result;
    await this.dbRequestHelper(db);
    this._config.storeKeys.forEach(({ key, keyPath, autoIncrement }) => {
      db.createObjectStore(key, { keyPath, autoIncrement });
    });
  }

  async getStoreForKey(
    dbKey,
    readwriteRule = IDBM_TRANSACTION_OPTIONS_READ_WRITE
  ) {
    try {
      const db = await this.openDb(this._config.dbName);
      return db.transaction([dbKey], readwriteRule).objectStore(dbKey);
    } catch (error) {
      throw error;
    }
  }

  async setItem(
    osKey = new Error('`osKey` is required'),
    key = new Error('`key` is required'),
    value
  ) {
    return new Promise(async (resolve, reject) => {
      const request = (await this.getStoreForKey(osKey)).put(value, key);
      this.dbRequestHelper(request, resolve, reject);
    });
  }

  async addItem(
    osKey = new Error('`osKey` is required'),
    key = new Error('`key` is required'),
    value
  ) {
    return new Promise(async (resolve, reject) => {
      const request = (await this.getStoreForKey(osKey)).add(value, key);
      this.dbRequestHelper(request, resolve, reject);
    });
  }

  async getItem(
    osKey = new Error('`osKey` is required'),
    key = new Error('`key` is required')
  ) {
    return new Promise(async (resolve, reject) => {
      const request = (await this.getStoreForKey(osKey)).get(key);
      this.dbRequestHelper(request, resolve, reject);
    });
  }

  async deleteItem(
    osKey = new Error('`osKey` is required'),
    key = new Error('`key` is required')
  ) {
    return new Promise(async (resolve, reject) => {
      const request = (await this.getStoreForKey(osKey)).delete(key);
      this.dbRequestHelper(request, resolve, reject);
    });
  }

  async deleteItems(osKey, keys = []) {
    return keys.map(async key => this.deleteItem(osKey, key));
  }

  async clearAll(osKey, keyRange) {
    return new Promise(async (resolve, reject) => {
      const request = (await this.getStoreForKey(osKey)).clear(keyRange);
      this.dbRequestHelper(request, resolve, reject);
    });
  }

  async getAllItems(osKey, query, count) {
    return new Promise(async (resolve, reject) => {
      const request = (await this.getStoreForKey(osKey)).getAll(query, count);
      this.dbRequestHelper(request, resolve, reject);
    });
  }

  dbRequestHelper(request, resolve, reject) {
    request.addEventListener('error', error => {
      return reject(error);
    });
    request.addEventListener('success', () => {
      return resolve(request.result);
    });
  }
}

const IDBM_DEFAULT_DB_NAME = 'idbm-1';
const IDBM_DEFAULT_DB_VERSION = 1;
const IDBM_TRANSACTION_OPTIONS_READ_WRITE = 'readwrite';

export default IDBManager;
