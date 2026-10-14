
import mysql2, { PoolOptions, QueryError, QueryResult } from "mysql2";
import { appConfig } from "./app-config";

// Data Access Layer:
class Dal {

    // Configuration for our database:
    private readonly options: PoolOptions = {
        host: appConfig.mysqlHost,
        user: appConfig.mysqlUser,
        password: appConfig.mysqlPassword,
        database: appConfig.mysqlDatabase,
        dateStrings: ["DATE"]
    };

    // Connection object:
    private readonly connection = mysql2.createPool(this.options);

    // Execute SQL:
    public execute(sql: string, values?: (string | number | boolean | null)[]): Promise<QueryResult> {

        // Promisify:
        return new Promise<QueryResult>((resolve, reject) => {

            // Go to DB, send sql, get data, invoke callback:
            this.connection.query(sql, values, (err: QueryError | null, result: QueryResult) => {

                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }

            });

        });

    }

}

export const dal = new Dal();
