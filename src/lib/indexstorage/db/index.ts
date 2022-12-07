import * as mysql from "mysql";
import * as R from "ramda";

import { tryTimes } from "../../delay";
import { TableBase } from "./tables";
import { SendTable } from "./tables/send";

export class SairiDatabase {
  // private _projectsTable: ProjectTable;
  // private _historyTable: HistoryTable;
  private _sendTable: SendTable;

  private _conn: mysql.Pool;
  private _tables: TableBase[];

  constructor() {
    const config = {
      connectionLimit: 10,
      host: "localhost",
      user: "",
      password: "",
      database: "",
      port: 3306,
      timezone: "+0:00",
    };

    console.log(`Creating db connecting pool: ${config.host}`);

    const conn = mysql.createPool(config);

    // this._projectsTable = new ProjectTable(conn);
    // this._historyTable = new HistoryTable(conn);
    this._sendTable = new SendTable(conn);

    this._conn = conn;
    // this._tables = [this._projectsTable, this._historyTable, this._sendTable];
    this._tables = [this._sendTable];
  }

  public get send(): SendTable {
    return this._sendTable;
  }

  dropAll(): Promise<boolean> {
    const f = () =>
      Promise.all(this._tables.map((t) => t.drop())).then((a) =>
        R.all((x) => x, a)
      );

    return tryTimes("Drop the tables", 5, 500, f);
  }

  async initialize(): Promise<boolean | void> {
    const f = () =>
      Promise.all(this._tables.map((x) => x.initialize())).then((a) =>
        R.all((x) => x, a)
      );

    return tryTimes("Initialize DB tables", 10, 5000, f).catch((err) => {
      console.error("DB Initialization error");
      console.error(err);
    });
  }
}

export function dateFormat(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

export const db = new SairiDatabase();
