import { BaseDirectory, readTextFile } from "@tauri-apps/api/fs";

interface IBuildConstructor {
    build(): string;
}

interface IValuesSetter<T> {
    set(values: T[]): IBuildConstructor;
}

export class InsertConstructor<T> implements IValuesSetter<T>, IBuildConstructor {
    table!: string;
    values!: T[];

    static createCommand<T>(table: string): IValuesSetter<T> {
        const constructor = new InsertConstructor<T>();
        constructor.table = table;
        return constructor;
    }

    set(values: T[]): IBuildConstructor {
        this.values = values;
        return this;
    }

    build(): string {
        if (this.values.length === 0) return "";
        const columns = Reflect.ownKeys(this.values[0] as object);
        const values = this.values.map(value => `(${columns.map(col => {
            const v = Reflect.get(value as object, col);
            const typeValue = typeof v;
            if (typeValue === "undefined") return "NULL";
            if (typeValue === "string") return `"${v}"`;
            return v.toString();
        }).join(',')})`);

        return `INSERT INTO ${this.table}(${columns.join(',')}) VALUES ${values}`;
    }
}

export class UpdateConstructor<T> implements IValuesSetter<T>, IBuildConstructor {
    table!: string;
    values!: T[];

    static createCommand<T>(table: string) {
        const constructor = new UpdateConstructor<T>();
        constructor.table = table;
        return constructor;
    }
    set(values: T[]): IBuildConstructor {
        this.values = values;
        return this;
    }
    build(): string {
        if (this.values.length === 0) return "";
        const allColumns = Reflect.ownKeys(this.values[0] as object);
        const columns = allColumns.slice(1);
        const idCol = allColumns[0];
        let commands: string[] = [];
        this.values.forEach(v => commands.push(`UPDATE ${this.table} SET ${columns.map(c => {
                const colVal = Reflect.get(v as object, c);
                const typeValue = typeof colVal;
                let val = typeValue === "string" ? `"${colVal}"` : colVal.toString();
                return `${c.toString()}=${val}`;
            }).join(',')} WHERE ${idCol.toString()}=${Reflect.get(v as object,idCol)}`    
        ));

        return commands.join(";");
    }
}

class SQLManager {
    static basePath = "data/databases/sql";

    static async loadAsync(filename: string): Promise<string> {
        const fullpath = [this.basePath, filename.concat(".sql")].join('/');
        const string = await readTextFile(fullpath, { dir: BaseDirectory.Resource });
        return string;
    }
}

export default SQLManager;