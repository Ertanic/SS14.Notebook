import Database, { QueryResult } from "tauri-plugin-sql-api";
import IRepository from "./IRepository";
import SQLManager, { InsertConstructor, UpdateConstructor } from "./SQL";

export class QuickSentenceCategory {
    category_id: number = undefined!;
    name: string;
    
    constructor(name: string) {
        this.name = name;
    }
}

export class QuickSentence {
    quick_sentence_id: number = undefined!;
    title: string;
    sentence: string;
    category_id: number;

    constructor(title: string, sentence: string, category_id: number) {
        this.title = title;
        this.sentence = sentence;
        this.category_id = category_id;
    }
}

export class QuickSentenceRepository implements IRepository<QuickSentence> {
    private _db: Database = undefined!;
    private _tableName: string = "quick_sentences";

    async InitAsync(): Promise<this> {
        this._db = await Database.load("sqlite:quick_sentence.db");
        const initCommand = await SQLManager.loadAsync("quick_sentences_init");
        this._db.execute(initCommand);
        return this;
    }
    async Insert(data: QuickSentence[]): Promise<QueryResult> {
        const command = InsertConstructor.createCommand(this._tableName).set(data).build();
        return await this._db.execute(command);
    }

    async Update(data: QuickSentence): Promise<QueryResult> {
        const command = UpdateConstructor.createCommand(this._tableName).set([data]).build();
        return await this._db.execute(command);
    }

    async Delete(id: number): Promise<QueryResult> {
        return await this._db.execute(`DELETE FROM ${this._tableName} WHERE quick_sentence_id = $1`, [id]);
    }

    async GetById(id: number): Promise<QuickSentence> {
        return await this._db.select<QuickSentence>(`SELECT * FROM ${this._tableName} WHERE quick_sentence_id = $1`, [id]);
    }

    async GetAll(): Promise<QuickSentence[]> {
        return await this._db.select<QuickSentence[]>(`SELECT * FROM ${this._tableName}`);
    }

    async Close(): Promise<void> {
        await this._db.close();
    }
}

export class QuickSentenceCategoryRepository implements IRepository<QuickSentenceCategory> {
    private _db: Database = undefined!;
    private _tableName: string = "quick_sentence_categories";

    async InitAsync(): Promise<this> {
        this._db = await Database.load("sqlite:quick_sentence.db");
        const initCommand = await SQLManager.loadAsync("quick_sentences_init");
        this._db.execute(initCommand);
        return this;
    }
    async GetById(id: number): Promise<QuickSentenceCategory | undefined> {
        return await this._db.select<QuickSentenceCategory>(`SELECT * FROM ${this._tableName} WHERE category_id = $1`, [id]);
    }
    async GetAll(): Promise<QuickSentenceCategory[]> {
        return await this._db.select<QuickSentenceCategory[]>(`SELECT * FROM ${this._tableName}`);
    }
    async Insert(data: QuickSentenceCategory[]): Promise<QueryResult> {
        const command = InsertConstructor.createCommand(this._tableName).set(data).build();
        return await this._db.execute(command);
    }
    async Delete(id: number): Promise<QueryResult> {
        return await this._db.execute(`DELETE FROM ${this._tableName} WHERE category_id = $1`, [id]);
    }
    async Close(): Promise<void> {
        await this._db.close();
    }
    
    Update(_data: QuickSentenceCategory): Promise<QueryResult> {
        throw new Error("Method not implemented.");
    }
}