import SQLite from 'react-native-sqlite-storage';

class DatabaseConnector {
    private databaseConnection: Promise<SQLite.SQLiteDatabase>;

    constructor(dbName: string, dbLocation: SQLite.Location) {
        this.databaseConnection = SQLite.openDatabase({name: dbName, location: dbLocation});
    }

    public saveState() {
        this.databaseConnection.then((tx) => {
            tx.executeSql("CREATE TABLE IF NOT EXISTS ");
        });
    }
    public getLastState() {
        this.databaseConnection.then((tx) => {
            tx.executeSql("C")
        });
    }
}

export const Instance: DatabaseConnector = new DatabaseConnector('glife_db', 'default');