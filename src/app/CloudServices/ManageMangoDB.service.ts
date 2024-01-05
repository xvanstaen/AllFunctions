import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient,  HttpErrorResponse } from '@angular/common/http';
import { configServer } from '../JsonServerClass';

@Injectable({
  providedIn: 'root'
})
export class ManageMangoDBService {
   
  constructor(private   http: HttpClient) { }

  
  findConfig(configServer:configServer,dataBase:string ): Observable<any> {
    const http_get=configServer.baseUrl+'/config/'+configServer.GoogleProjectId+'/'+configServer.test_prod+'/'+dataBase;
    return this.http.get<any>(http_get); 
  }

  findConfigbyString(configServer:configServer,dataBase:string,searchString: any ): Observable<any> {
    return this.http.get<any>(`${configServer.baseUrl}/configByString/${configServer.GoogleProjectId}/${configServer.test_prod}/${dataBase}?searchString=${searchString}`);
  } 

  findAllConfig(configServer:configServer,dataBase:string ): Observable<any> {
    const http_get=configServer.baseUrl+'/allConfig/'+configServer.GoogleProjectId+'/'+configServer.test_prod+'/'+dataBase;
    return this.http.get<any>(http_get);  // cache is not used
  }

  findAllConfigbyString(configServer:configServer,dataBase:string,searchString: any ): Observable<any> {
    return this.http.get<any>(`${configServer.baseUrl}/allConfigByString/${configServer.GoogleProjectId}/${configServer.test_prod}/${dataBase}?searchString=${searchString}`);
  } // cache is not used

  resetConfig(configServer:configServer,dataBase:string ): Observable<any> {
    const http_get=configServer.baseUrl+'/resetConfig/'+configServer.GoogleProjectId+'/'+configServer.test_prod+'/'+dataBase;
    return this.http.get<any>(http_get); 
  }

  updateConfig(configServer:configServer,dataBase:string,id:string,record:any ): Observable<any> {
    const http_get=configServer.baseUrl+'/updateConfig/'+configServer.GoogleProjectId+'/'+configServer.test_prod+'/'+dataBase+'/'+id;
    return this.http.put<any>(http_get, record); 
  }
  uploadConfig(configServer:configServer,dataBase:string,record:any ): Observable<any> {
    const http_get=configServer.baseUrl+'/uploadConfig/'+configServer.GoogleProjectId+'/'+configServer.test_prod+'/'+dataBase;
    return this.http.put<any>(http_get,record); 
  }

}