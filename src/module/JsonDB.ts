import fs from 'fs';
import { resolve } from 'path';
import { JsonDbOptions } from '../interface/Options';
import { SchemaTypes } from '../interface/SchemaTypes';

export default class JsonDB {
  private format = 0;
  private dbRef: string = '';
  private dirRef: string = '';
  private path: string[] = [];
  private readonly database: string;

  constructor(database: string, options: JsonDbOptions) {
    this.database = database.endsWith('.json') ? database : database + '.json';
    if (options.path && options.path.length) this.path = [...options.path];
    if (options.format) this.format = options.format;
  }

  public run(): boolean {
    const databaseRef = this.path.length
      ? resolve(...this.path, this.database)
      : resolve(this.database);
    if (!fs.existsSync(databaseRef.slice(0, databaseRef.length - this.database.length))) {
      let dirAux = '';
      this.path.forEach((dir) => {
        fs.mkdirSync(resolve(dirAux, dir));
        dirAux += resolve(dirAux, dir);
      });
    }
    try {
      fs.writeFileSync(databaseRef, '{}', { encoding: 'utf-8' });
    } catch (error) {
      return false;
    }
    this.dbRef = databaseRef;
    this.dirRef = this.dbRef.slice(0, this.dbRef.length - this.database.length);
    return true;
  }

  private addSchema(name: string, schemaType: SchemaTypes) {
    const schemaName = name.endsWith('.json') ? name : name.concat('.json');
    const json: any = JSON.parse(fs.readFileSync(this.dbRef, { encoding: 'utf-8' }));
    const schema = {
      name,
      dir: resolve(this.dirRef, schemaName),
      types: { ...schemaType },
      createdAt: Date.now(),
    };
    json.schemas =
      json.schemas && json.schemas.length ? [...json.schemas, { ...schema }] : [{ ...schema }];
    fs.writeFileSync(this.dbRef, JSON.stringify(json, null, this.format));
    fs.writeFileSync(resolve(this.dirRef, schemaName), '{}', { encoding: 'utf-8' });
  }

  public model(name: string, schema: SchemaTypes) {
    this.addSchema(name, schema);
  }
}
