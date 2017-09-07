import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Module } from './module';
import { MODULES } from './mock-modules';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ModuleService {
    
    constructor(private http: Http) { }
    
    getModules(offset, limit): Promise<Module[]> {
        return this.http.get('https://api.nusreviews.com/getModulesFullAttribute?offset=' + offset + '&limit=' + limit)
        .toPromise()
        .then(this.deserialiseJSONToModules)
        .catch(this.handleError);
    }
    getModulesSlowly(offset, limit): Promise<Module[]> {
        return new Promise(resolve => {
            // Simulate server latency with 1 second delay
            setTimeout(() => resolve(this.getModules(offset, limit)), 3000);
        });
    }
    getModulesById(modId: string, strict: boolean, offset: number, limit: number): Promise<Module[]> {
        // return this.getModules().then(modules => modules.find(module => module.id === id));
        return this.http.get('https://api.nusreviews.com/getModulesFullAttribute?'+ 
        'offset=' + offset + '&limit=' + limit + '&modId=' + modId + '&strict=' + strict)
        .toPromise()
        .then(this.deserialiseJSONToModules) 
        .catch(this.handleError);
    }
    
    private deserialiseJSONToModules(response): Module[] {
        let modules: Module[] = [];
        let jsonArray: [JSON] = response.json()['modules'];

        if (jsonArray.length > 0) {
            modules = jsonArray.map(function(mod) {
                let deserialisedModule = Module.deserialiseJson(mod);
                return deserialisedModule;
            });
        }
        return modules
    }
    
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
