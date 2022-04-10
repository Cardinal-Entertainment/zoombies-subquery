// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




type RarityPerDayProps = Omit<RarityPerDay, NonNullable<FunctionPropertyNames<RarityPerDay>>>;

export class RarityPerDay implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public diamond?: bigint;

    public platinum?: bigint;

    public epic?: bigint;

    public rare?: bigint;

    public uncommon?: bigint;

    public common?: bigint;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save RarityPerDay entity without an ID");
        await store.set('RarityPerDay', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove RarityPerDay entity without an ID");
        await store.remove('RarityPerDay', id.toString());
    }

    static async get(id:string): Promise<RarityPerDay | undefined>{
        assert((id !== null && id !== undefined), "Cannot get RarityPerDay entity without an ID");
        const record = await store.get('RarityPerDay', id.toString());
        if (record){
            return RarityPerDay.create(record as RarityPerDayProps);
        }else{
            return;
        }
    }



    static create(record: RarityPerDayProps): RarityPerDay {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new RarityPerDay(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
