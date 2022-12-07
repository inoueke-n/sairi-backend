import { TableBase } from ".";
import { dateFormat } from "..";
import { SendData } from "../types";

type Optional<T> = T | undefined;

export class SendTable extends TableBase {
  tableName = "send";

  async initialize(): Promise<boolean> {
    const sql = `
      ${this.createTable()} (
          id VARCHAR(16) NOT NULL,
          uid VARCHAR(128) NOT NULL,
          storage_id VARCHAR(16) NOT NULL,
          url VARCHAR(256) NOT NULL,
          created_at DATETIME NOT NULL,
          PRIMARY KEY (id)
      )`;
    return this.executeSql(sql);
  }

  /**
   *
   * @param id Sent data id
   * @param uid User id
   */
  insert(
    id: string,
    uid: string,
    storageId: string,
    url: string
  ): Promise<boolean> {
    const createdAt = dateFormat(new Date());
    const sql = `
                INSERT INTO send(id, uid, created_at, storage_id, url)
                VALUES('${id}', '${uid}', '${createdAt}', '${storageId}', '${url}')`;

    return this.executeSql(sql);
  }

  get(uid: string, id: string): Promise<Optional<SendData>> {
    const sql = `
      SELECT * FROM send where uid = '${uid}' and id = '${id}'
    `;

    return this.selectRow<SendData>(sql);
  }

  getUserData(uid: string): Promise<Optional<SendData[]>> {
    const sql = `
      SELECT * FROM send where uid = '${uid}' ORDER BY created_at
    `;

    return this.selectRows<SendData>(sql);
  }

  getAll(): Promise<Optional<SendData[]>> {
    const sql = `
      SELECT * FROM send
    `;

    return this.selectRows<SendData>(sql);
  }
}
