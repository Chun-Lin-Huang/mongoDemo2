import { Route } from "../abstract/Route"
import { UserController } from "../controller/UserController";
import { logger } from "../middlewares/log";

export class UserRoute extends Route{
    
    protected url: string;
    protected Contorller = new UserController();

    constructor(){
        super()
        this.url = '/api/v1/user/'
        this.setRoutes()
    }

    protected setRoutes(): void {
        
        this.router.get(`${this.url}findAll`,(req, res)=>{
            this.Contorller.findAll(req, res);
        })

        /**
         * 新增訂單
         * request body {
         *  name: string,
         *  phoneNumber: string",
         *  content: string,
         *  total: string,
         *  remark: string
         * } 
         * @returns resp<Student>
         */
        this.router.post(`${this.url}insertOne`,(req, res)=>{
            this.Contorller.insertOne(req, res);
        })

        /**
         * 刪除訂單
         */
        this.router.delete(`${this.url}deleteBySid`, (req, res) => {
            this.Contorller.deleteBySid(req, res);
        })

        this.router.put(`${this.url}updateOrderBySid`, (req, res) => {
            this.Contorller.updateOrderBySid(req, res);
        });        
    }
}