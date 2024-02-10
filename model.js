import {Schema, model} from "mongoose";
const msgSchema = new Schema(
    {
        name: {
            type:String,
            required : true,
        },
        email: {
            type:String,
            required : true,
        },
        msg: {
            type:String,
            required : true,
        }
    },
    {timestamp:true, collection: 'Msg', }
);
const Msg = model("Msg", msgSchema);
export default Msg;