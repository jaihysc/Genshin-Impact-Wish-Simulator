import { browser } from '$app/environment';
import { openDB } from 'idb';

const version = 1;
const DBName = 'WishSimulator';
const storeName = 'history';

let IndexedDB;
if (browser) {
	IndexedDB = openDB(DBName, version, {
		upgrade(db) {
			const store = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
			store.createIndex('banner', 'banner', { unique: false });
			store.createIndex('name', 'name', { unique: false });
		}
	});
}

// Memory-based replacement for IndexedDB
let memoryDB = [];

const HistoryIDB = {
	async historyCount() {
		try {
			return (await IndexedDB).count(storeName);
		}
		catch (e) {
			return memoryDB.length();
		}
	},
	async getList(banner) {
		try {
			return (await IndexedDB).getAllFromIndex(storeName, 'banner', banner);
		}
		catch (e) {
			let list = [];
			for (const entry of memoryDB) {
				if (entry.banner === banner) {
					list.push(entry);
				}
			}
			return list;
		}
	},

	async countItem(name) {
		try {
			return (await IndexedDB).countFromIndex(storeName, 'name', name);
		}
		catch (e) {
			let count = 0;
			for (const entry of memoryDB) {
				if (entry.name === name) {
					++count;
				}
			}
			return count;
		}
	},

	async getByName(name) {
		try {
			return (await IndexedDB).getAllFromIndex(storeName, 'name', name);
		}
		catch (e) {
			let list = [];
			for (const entry of memoryDB) {
				if (entry.name === name) {
					list.push(entry);
				}
			}
			return list;
		}
	},

	async resetHistory(banner) {
		try {
			const idb = await IndexedDB;
			const keys = await idb.getAllKeysFromIndex(storeName, 'banner', banner);
			keys.forEach((key) => idb.delete(storeName, key));
			return 'success';
		} catch (e) {
			let newMemoryDB = [];
			for (const entry of memoryDB) {
				if (entry.banner !== banner) {
					newMeoryDB.push(entry);
				}
			}
			memoryDB = newMemoryDB;
			return 'success';
		}
	},
	async clearIDB() {
		try {
			return (await IndexedDB).clear(storeName);
		}
		catch (e) {
			memoryDB.clear();
		}
	},
	async getAllHistories() {
		try {
			return (await IndexedDB).getAll(storeName);
		}
		catch (e) {
			return memoryDB;
		}
	},
	async addHistory(data) {
		// eslint-disable-next-line no-prototype-builtins
		if (!data.hasOwnProperty('banner')) return;
		try {
			return (await IndexedDB).put(storeName, data);
		}
		catch (e) {
			memoryDB.push(data);
		}
	},
	async delete(id) {
		if (!id) return;
		try {
			return (await IndexedDB).delete(storeName, id);
		}
		catch (e) {
			let newMemoryDB = [];
			for (const entry of memoryDB) {
				if (entry !== id) {
					newMeoryDB.push(entry);
				}
			}
			memoryDB = newMemoryDB;
		}
	}
};

export default HistoryIDB;
