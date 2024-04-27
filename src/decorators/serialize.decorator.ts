import { UseInterceptors } from "@nestjs/common";
import { SerializeInterceptor } from "../interceptors/serialize.interceptor";

interface ClassContructor {
    new (...args: any[]): any
}


export function Serialize(dto: ClassContructor) {
    return UseInterceptors(new SerializeInterceptor(dto))
}