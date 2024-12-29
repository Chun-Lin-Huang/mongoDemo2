export interface Order{
    _id?: string,
    sid?: String,
    name: string,
    phoneNumber: string,
    content?: string|undefined,
    total?: string|undefined,
    remark?: string|undefined
}