import { Service } from "../abstract/Service";
import { Order } from "../interfaces/Order";
import { logger } from "../middlewares/log";
import { ordersModel } from "../orm/schemas/ordersSchemas";
import { DBResp } from "../interfaces/DBResp";
import { resp } from "../utils/resp";

export class UserService extends Service {
    public async getAllOrders(): Promise<Array<DBResp<Order>> | undefined> {
        try {
            const res: Array<DBResp<Order>> = await ordersModel.find({});
            return res;
        } catch (error) {
            return undefined;
        }
    }

    /**
     * 新增訂單
     * @param info 訂單資訊
     * @returns resp
     */
    public async insertOne(info: Order): Promise<resp<DBResp<Order> | undefined>> {
        const current = await this.getAllOrders();
        const resp: resp<DBResp<Order> | undefined> = {
            code: 200,
            message: "",
            body: undefined,
        };

        if (current && current.length > 0) {
            try {
                const phoneValidator = await this.phoneNumberValidator(info.phoneNumber);
                if (current.length >= 200) {
                    resp.message = "student list is full";
                    resp.code = 403;
                } else {
                    if (phoneValidator === "驗證通過") {
                        info.sid = String(current.length + 1);
                        info._id = undefined;
                        const res = new ordersModel(info);
                        resp.body = await res.save();
                    } else {
                        resp.code = 403;
                        resp.message = phoneValidator;
                    }
                }
            } catch (error) {
                resp.message = "server error";
                resp.code = 500;
            }
        } else {
            resp.message = "server error";
            resp.code = 500;
        }

        return resp;
    }

    /**
     * 電話號碼驗證器
     * @param phoneNumber 電話號碼
     * @returns 驗證結果
     */
    public async phoneNumberValidator(
        phoneNumber: string
    ): Promise<
        "電話號碼格式不正確，應為 0912-123-456" | "電話號碼已存在" | "驗證通過"
    > {
        // 驗證電話號碼格式 (格式：0912-123-456)
        const phonePattern = /^09\d{2}-\d{3}-\d{3}$/;
        if (!phonePattern.test(phoneNumber)) {
            return "電話號碼格式不正確，應為 0912-123-456";
        }

        if (await this.existingPhoneNumbers(phoneNumber)) {
            return "電話號碼已存在";
        }

        return "驗證通過";
    }

    /**
     * 檢查電話號碼是否已存在
     * @param phoneNumber 電話號碼
     * @returns 是否存在
     */
    public async existingPhoneNumbers(phoneNumber: string): Promise<boolean> {
        const students = await this.getAllOrders();
        let exist = false;
        if (students) {
            students.forEach((student) => {
                if (student.phoneNumber === phoneNumber) {
                    exist = true;
                }
            });
        }
        return exist;
    }

    /**
     * 刪除訂單
     * @param sid 訂單編號
     * @returns 
     */
    public async deleteBySid(sid: string): Promise<resp<undefined>> {
        const resp: resp<undefined> = {
            code: 200,
            message: "",
            body: undefined,
        };

        try {
            
            const deletedOrder = await ordersModel.findOneAndDelete({ sid });

            if (deletedOrder) {
                resp.message = "Order deleted successfully";
            } else {
                resp.code = 404;
                resp.message = "Order not found";
            }
        } catch (error) {
            resp.code = 500;
            resp.message = "server error";
        }

        return resp;
    }

    public async updateOrderBySid(
        sid: string,
        name?: string,
        phoneNumber?: string,
        remark?: string
    ) {
        const response: resp<DBResp<Order> | string> = {
            code: 200,
            message: "",
            body: "",
        };
    
        try {
            // 查詢是否存在指定 sid 的訂單
            const order: DBResp<Order> | null = await ordersModel.findOne({ sid });
            if (!order) {
                response.code = 404;
                response.message = "無效的 SID 或找不到該訂單";
                return response;
            }
    
            // 更新資料，只有傳入新值時才會更新
            if (name) order.name = name;
            if (phoneNumber) order.phoneNumber = phoneNumber;
            if (remark) order.remark = remark;
    
            // 保存更新
            await order.save();
            response.body = order;
            response.message = "更新成功";
    
        } catch (error) {
            console.error("更新訂單錯誤:", error);
            response.code = 500;
            response.message = "伺服器錯誤";
        }
    
        return response;
    }    
}