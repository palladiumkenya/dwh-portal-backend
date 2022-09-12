import { HttpService, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxiosResponse } from "axios"

@Injectable()
export class MetabaseService {
    constructor(private readonly httpService: HttpService, private configService: ConfigService){}

    login(): Promise<AxiosResponse<any[]>> {
        return this.httpService.post(`${this.configService.get<string>('METABASE_BASE_URL')}/api/session`,
         {
            username: this.configService.get<string>('METABASE_SHARED_USERNAME'),
            password: this.configService.get<string>('METABASE_SHARED_PASSWORD'),
         }).toPromise();
    }
}