import { User } from "./user";

export interface Customer extends User{
    firstname?: string;
    lastname?: string;
    phone?: string;
    address?: string;
}