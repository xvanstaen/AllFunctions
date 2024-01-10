import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient,  HttpErrorResponse } from '@angular/common/http';
import { configServer } from '../JsonServerClass';

@Injectable({
  providedIn: 'root'
})
export class ManageMongoDBService {
   
  constructor(private   http: HttpClient) { }


  findConfig(configServer:configServer,collection:string ): Observable<any> {
    const http_get=configServer.baseUrl+'/config/'+configServer.GoogleProjectId+'/'+configServer.test_prod+'/'+collection;
    return this.http.get<any>(http_get); 
  }

  findConfigbyString(configServer:configServer,collection:string,searchBucket:string,searchString: any ): Observable<any> {
    return this.http.get<any>(`${configServer.baseUrl}/configByString/${configServer.GoogleProjectId}/${configServer.test_prod}/${collection}/${searchBucket}?searchString=${searchString}`);
  } 

  findAllConfig(configServer:configServer,collection:string ): Observable<any> {
    const http_get=configServer.baseUrl+'/allConfig/'+configServer.GoogleProjectId+'/'+configServer.test_prod+'/'+collection;
    return this.http.get<any>(http_get);  // cache is not used
  }

  resetConfig(configServer:configServer,collection:string ): Observable<any> {
    const http_get=configServer.baseUrl+'/resetConfig/'+configServer.GoogleProjectId+'/'+configServer.test_prod+'/'+collection;
    return this.http.get<any>(http_get); 
  }

  updateConfig(configServer:configServer,collection:string,id:string,record:any ): Observable<any> {
    const http_get=configServer.baseUrl+'/updateConfig/'+configServer.GoogleProjectId+'/'+configServer.test_prod+'/'+collection+'/'+id;
    return this.http.put<any>(http_get, record); 
  }
  uploadConfig(configServer:configServer,collection:string,record:any ): Observable<any> {
    const http_get=configServer.baseUrl+'/uploadConfig/'+configServer.GoogleProjectId+'/'+configServer.test_prod+'/'+collection;
    return this.http.put<any>(http_get,record); 
  }
  delConfigById(config:configServer, db:string,collection:string,id: any): Observable<any> {
    const http_get=config.baseUrl+'/delConfigById/'+db+'/'+config.test_prod+'/'+collection+'/'+id;
    return this.http.get<any>(http_get); 
  }

}