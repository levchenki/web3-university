import {Address} from "abitype";

export interface ITransactionParams {
    value: string;
    to: Address;
}