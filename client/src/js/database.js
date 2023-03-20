import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// GET jate db
export const getDb = async () => {
  console.log('GET jate database content');
  
  const jateDb = await openDB('jate', 1);
  const tx = jateDb.transaction('jate', 'readonly');
  const store = tx.objectStore('jate');
  const request = store.getAll();
  const result = await request;

  // if(!result) {
  //   console.error('GET failed; database not retrieved');
  // }

  console.log('result.value', result);

  return result;
};

// PUT to jate db
// debating whether id is needed to be specified here (id, content) and store.put({id: id, content})
export const putDb = async (content) => {
  
  const jateDb = await openDB('jate', 1);
  const tx = jateDb.transaction('jate', 'readwrite');
  const store = tx.objectStore('jate');
  const request = store.put({ content });
  const result = await request;

  // if (!result) {
  //   console.error('PUT failed; data not added');
  // }
  
  console.log('PUT implemented; data added to jateDb', result);
};

// POST to jate db (not sure if necessary, since PUT is handling content updates)
// export const postDb = async (content) => {
//   console.log('POST to jateDb');

//   const jateDb = await openDB('jate', 1);
//   const tx = jateDb.transaction('jate', 'readwrite');
//   const store = tx.objectStore('jate');
//   const request = store.put({ content });
//   const result = await request;

//   if(!result) {
//     console.log('POST failed; new data not saved');
//   }

//   console.log('Content saved to database', result);
// };

// TODO: Add logic to a method that accepts some content and adds it to the database
// export const putDb = async (content) => {
//   // console.error('putDb not implemented');
// }

// // TODO: Add logic for a method that gets all the content from the database
// export const getDb = async () => {
  // console.error('getDb not implemented');
// };

initdb();
