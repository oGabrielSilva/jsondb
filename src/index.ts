import type { JsonDbOptions } from './interface/Options';
import JsonDB from './module/JsonDB';
import genUid from './utils/uid';

export default function getJsonDBInstance(databaseName: string, options: JsonDbOptions) {
  return new JsonDB(databaseName, options);
}

const jsonDb = getJsonDBInstance('test', { path: ['db'], format: 2 });

jsonDb.run();
jsonDb.model('Schema', { name: { type: 'String' } });

console.log(jsonDb);

export { genUid };
