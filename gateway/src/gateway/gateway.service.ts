import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxiosRequestConfig } from "axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class GatewayService {
  private readonly serverUrlMap: Record<string, string>;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {

    this.serverUrlMap = {
      auth: this.configService.get<string>("AUTH_SERVER_URL"),
      event: this.configService.get<string>("EVENT_SERVER_URL"),
    };
  }

  async forwardRequest(
  target: string, 
  method: string,
  url: string,
  body: any,
  headers: any,
) {
  const serviceUrl = this.serverUrlMap[target];
  if (!serviceUrl) throw new Error(`정의되지 않은 서버: ${target}`);

  const base = serviceUrl.replace(/\/$/, "");
  const path = url.replace(/^\//, "");
  const fullUrl = `${base}/${path}`;

  const forwardedHeaders = { ...headers };
  delete forwardedHeaders['host'];
  delete forwardedHeaders['Host'];
  delete forwardedHeaders['content-length'];
  delete forwardedHeaders['Content-Length'];
  delete forwardedHeaders['connection'];
  delete forwardedHeaders['Connection'];

  forwardedHeaders['Content-Type'] = 'application/json';

  const config: AxiosRequestConfig = {
    method,
    url: fullUrl,
    data: body,
    headers: forwardedHeaders,
  };

  const response = await firstValueFrom(this.httpService.request(config));
  return response.data;
}
}
