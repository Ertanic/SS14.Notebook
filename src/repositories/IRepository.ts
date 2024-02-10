import { QueryResult } from "tauri-plugin-sql-api";

interface IRepository<T> {
    InitAsync(): Promise<this>;
    GetById(id: number): Promise<T | undefined>;
    GetAll(): Promise<T[]>;
    Insert(data: T[]): Promise<QueryResult>;
    Update(data: T): Promise<QueryResult>;
    Delete(id: number): Promise<QueryResult>;
    Close(): Promise<void>;
}

export default IRepository;