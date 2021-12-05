import { openDB } from 'idb';

export function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);

  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  const arrayBuffer = new ArrayBuffer(byteString.length);
  const _ia = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
      _ia[i] = byteString.charCodeAt(i);
  }

  const dataView = new DataView(arrayBuffer);
  const blob = new Blob([dataView], { type: mimeString });
  return blob;
}

export function convertObjectArray(objects){
  const dataArray = [];
  for(const key in objects){
    dataArray.push(objects[key]);
  }
  return dataArray
}

export function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}


// Indexed DB
const dbPromise = openDB('posts-store', 1, {
  upgrade(db) {
    if(!db.objectStoreNames.contains('posts')){
      db.createObjectStore('posts', { keyPath: 'id' })
    }
    if(!db.objectStoreNames.contains('sync-posts')){
      db.createObjectStore('sync-posts', { keyPath: 'id' })
    }
  }
});

export function writeData(st, data) {
  return dbPromise
    .then(function(db) {
      const tx = db.transaction(st, 'readwrite');
      const store = tx.objectStore(st);
      store.put(data);
      return tx.complete;
    });
}

export function readAllData(st) {
  return dbPromise
    .then(function(db) {
      const tx = db.transaction(st, 'readonly');
      const store = tx.objectStore(st);
      return store.getAll();
    });
}

export function clearAllData(st) {
  return dbPromise
    .then(function(db) {
      const tx = db.transaction(st, 'readwrite');
      const store = tx.objectStore(st);
      store.clear();
      return tx.complete;
    });
}

export function deleteItemFromData(st, id) {
  dbPromise
    .then(function(db) {
      const tx = db.transaction(st, 'readwrite');
      const store = tx.objectStore(st);
      store.delete(id);
      return tx.complete;
    })
    .then(function() {
      console.log('Item deleted!');
    });
}