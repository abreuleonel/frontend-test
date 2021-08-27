import type { Options } from '../types';
import kebabCase from 'lodash/kebabCase';

export default class UrlProcessorFluentAPI {
    #opts;
    #url;
    #qs: any;
    #endpoint;

    constructor(opts: Options) {
        this.#opts = opts;
        this.#url = opts.baseUrl || ''
        this.#endpoint = kebabCase(opts.name);
        this.#qs = null;
    }

    formatEndpoint() {
        this.#hasOptsUrlParser()
        this.#hasOptsPath()
        this.#hasOptsIdButNotCustomPath()
        this.#hasOptsIdAndCustomPath()

        this.#endpoint = this.#endpoint.replace(/\/\//g, '/');
        this.#endpoint = this.#endpoint.startsWith('/') ? this.#endpoint.substring(1) : this.#endpoint;

        return this;
    }

    formatUrl() {
        this.#url = (!this.#url.endsWith('/')) ? this.#url += '/' : this.#url;
        this.#url += this.#endpoint;
        this.#url = (this.#url.endsWith('/')) ? this.#url.slice(0, -1) : this.#url;

        return this;
    }

    formatQuery() {
        this.#hasOptsQuery();

        if (this.#qs != null) {
            this.#url += '?' + this.#qs
        }

        return this;
    }


    #hasOptsQuery = () => {
        if(!this.#opts.query)
            return;

        this.#qs = ''
        
        const queryAsArray = Object.entries(this.#opts.query);     

        const filteredArray = queryAsArray.filter((value) => {
            return (value[1] != null 
                && !Number.isNaN(value[1])
                && typeof value[1] != undefined)
        })
        
        const qq = filteredArray.reduce((acc: any, cur: any, currentIndex) => {
            let add = "";                               

            let value = cur[1];
            let name = this.#opts.queryStringParser
            ? this.#opts.queryStringParser(cur[0])
            : cur[0];
            
            if(Array.isArray(value)){                
                add = value.reduce((accArray, curArray, currentArrayIndex) => {
                    let addArray = name + '[]=' + curArray;
                    if (currentArrayIndex < value.length - 1) addArray += '&'
                    return accArray + addArray;
                }, add);                
            }
            else{
                add = name + '=' + value    
            }            
            
            if (currentIndex < filteredArray.length - 1)
                add += `&`

            return acc + add;
        }, this.#qs);

        this.#qs = qq;

        return;
    }

    #hasOptsUrlParser = () => {
        if (!this.#opts.urlParser)
            return;

        this.#endpoint = this.#opts.urlParser(this.#opts.name || '')
    }

    #hasOptsPath = () => {
        if(!this.#opts.path)
            return;
        
        this.#endpoint = this.#opts.path
    }

    #hasOptsIdButNotCustomPath = () => {
        if (!this.#opts.id || this.#opts.customPath)
            return;

        this.#endpoint += '/'
        this.#endpoint += this.#opts.id        
    }

    #hasOptsIdAndCustomPath = () => {
        if(!this.#opts.customPath)
            return;

        this.#endpoint = (!this.#opts.id) ? this.#opts.customPath : this.#opts.customPath.replace(/:\w+/, this.#opts.id.toString());
    }

    build() {
        return this.#url;
    }
}
