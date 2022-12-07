import * as _ from "lodash";
import * as mysql from "mysql";
import * as R from "ramda";

export abstract class TableBase {
  protected _conn: mysql.Pool;

  constructor(conn: mysql.Pool) {
    this._conn = conn;
  }

  drop(): Promise<boolean> {
    const q = `DELETE FROM ${this.tableName}`;
    return this.executeSql(q);
  }

  protected createTable(): string {
    return `CREATE TABLE IF NOT EXISTS ${this.tableName}`;
  }

  protected executeSql(sql: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._conn.query(sql, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  protected selectRow<T>(sql: string): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      this._conn.query(sql, (err, results) => {
        if (err) {
          console.error(err);
          resolve(undefined);
        } else {
          if (_.isArray(results) && R.length(results) > 0) {
            resolve(R.head(results));
          } else {
            console.error("Results is invalid");
            resolve(undefined);
          }
        }
      });
    });
  }

  protected selectRows<T>(sql: string): Promise<T[] | undefined> {
    return new Promise((resolve, reject) => {
      this._conn.query(sql, (err, results) => {
        if (err) {
          console.error(err);
          resolve(undefined);
        } else {
          if (_.isArray(results)) {
            resolve(results);
          } else {
            console.error("Results is invalid");
            resolve(undefined);
          }
        }
      });
    });
  }

  abstract get tableName(): string;
  abstract initialize(): Promise<boolean>;
}
