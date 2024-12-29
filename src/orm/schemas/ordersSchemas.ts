import { model, Schema } from "mongoose";
import { Order } from "../../interfaces/Order";

export const ordersSchemas = new Schema<Order>({
    sid:{ type: String, required: true },
    name:{ type: String, required: true },
    phoneNumber:{ type: String, required: true },
    content:{ type: String, required: false },
    total:{ type: String, required: false },
    remark:{ type: String, required: true },
});

export const ordersModel = model<Order>('orders', ordersSchemas);