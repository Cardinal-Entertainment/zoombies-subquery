// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




type NFTPerDayProps = Omit<NFTPerDay, NonNullable<FunctionPropertyNames<NFTPerDay>>>;

export class NFTPerDay implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public minted?: bigint;

    public burned?: bigint;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save NFTPerDay entity without an ID");
        await store.set('NFTPerDay', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove NFTPerDay entity without an ID");
        await store.remove('NFTPerDay', id.toString());
    }

    static async get(id:string): Promise<NFTPerDay | undefined>{
        assert((id !== null && id !== undefined), "Cannot get NFTPerDay entity without an ID");
        const record = await store.get('NFTPerDay', id.toString());
        if (record){
            return NFTPerDay.create(record as NFTPerDayProps);
        }else{
            return;
        }
    }



    static create(record: NFTPerDayProps): NFTPerDay {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new NFTPerDay(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
