// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




type LogCardMintedProps = Omit<LogCardMinted, NonNullable<FunctionPropertyNames<LogCardMinted>>>;

export class LogCardMinted implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public blockNumber?: number;

    public blockTimestamp: Date;

    public buyer: string;

    public tokenId: bigint;

    public cardTypeId: number;

    public editionNumber: bigint;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save LogCardMinted entity without an ID");
        await store.set('LogCardMinted', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove LogCardMinted entity without an ID");
        await store.remove('LogCardMinted', id.toString());
    }

    static async get(id:string): Promise<LogCardMinted | undefined>{
        assert((id !== null && id !== undefined), "Cannot get LogCardMinted entity without an ID");
        const record = await store.get('LogCardMinted', id.toString());
        if (record){
            return LogCardMinted.create(record as LogCardMintedProps);
        }else{
            return;
        }
    }



    static create(record: LogCardMintedProps): LogCardMinted {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new LogCardMinted(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
