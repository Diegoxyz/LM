import { ODataSettings } from 'angular-odata';

export class SapODataSettings extends ODataSettings{
    get baseUrl() : string {
        return super.baseUrl + '/' + 'test';
    }

    set baseUrl(baseUrl: string) {
        super.baseUrl = baseUrl;
    }
}