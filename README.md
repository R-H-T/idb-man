# idb-man
IndexedDB Manager is made to simplify IndexedDB.

## Why use IndexedDB instead of LocalStorage?
**Simple answer:** It all depends on your project's needs. If you'll be using a shared preference with your Service Worker, then this is a good place for IndexedDB.

## Getting started
Copy the `idb-man` folder in `src` to your project's source and import it. **E.g.:**

```js
import IDBManager from './utility/idb-man';

// Config
const IDBM_DB_NAME = 'my-db-name';
const IDBM_DB_VERSION = 1;
const IDBM_OSKEY_USER_PREFERENCES = 'user-preferences';
const osKeys = [{ key: IDBM_OSKEY_USER_PREFERENCES }];
const idbm = new IDBManager(IDBM_DB_NAME, IDBM_DB_VERSION, osKeys);

// Helpers
const userPreferencesGetItem = async key => idbm.getItem(IDBM_OSKEY_USER_PREFERENCES, key);
const userPreferencesSetItem = async (key, value) =>
  idbm.setItem(IDBM_OSKEY_USER_PREFERENCES, key, value);
  
// User Preferences Keys
const USER_PREFERENCES_DARK_MODE = 'dark-mode';

/*...*/

const toggleDarkMode = async () => {
  try {
    const oldValue = await userPreferencesGetItem(USER_PREFERENCES_DARK_MODE);
    await userPreferencesSetItem(USER_PREFERENCES_DARK_MODE, !oldValue);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

# Contributions
Contributions are welcome. There are more features in IndexedDB to include.

# License
**MIT**

---
*Copyright ©2019 – Roberth Hansson-Tornéus (github.com/R-H-T)*
