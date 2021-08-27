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

    hasOptsUrlParser() {
        if (!this.#opts.urlParser)
            return this;

        this.#endpoint = this.#opts.urlParser(this.#opts.name || '')

        return this;
    }

    hasOptsPath() {
        if(!this.#opts.path)
            return this;
        
        this.#endpoint = this.#opts.path
        return this;
    }

    hasOptsIdButNotCustomPath() {
        if (!this.#opts.id || this.#opts.customPath)
            return this;

        this.#endpoint += '/'
        this.#endpoint += this.#opts.id
        
        return this;
    }

    hasOptsIdAndCustomPath() {
        if(!this.#opts.customPath)
            return this;

        this.#endpoint = (!this.#opts.id) ? this.#opts.customPath : this.#opts.customPath.replace(/:\w+/, this.#opts.id.toString());

        return this;
    }

    splitEndpointSlashes() {
        this.#endpoint = this.#endpoint.replace(/\/\//g, '/');
        return this;
    }

    endpointBeginsWithSlash() {
        this.#endpoint = this.#endpoint.startsWith('/') ? this.#endpoint.substring(1) : this.#endpoint;

        return this;
    }

    urlLastIndexOfDifferentFromMinusOne() {
        this.#url = (!this.#url.endsWith('/')) ? this.#url += '/' : this.#url;

        return this;
    }

    joinUrlWithEndpoint() {
        this.#url += this.#endpoint;
        return this;
    }

    hasOptsQuery() {
        if(!this.#opts.query)
            return this;

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

        return this;
    }

    urlSlashNotLastCharacter() {
        this.#url = (this.#url.endsWith('/')) ? this.#url.substring(0, this.#url.length -1) : this.#url;
        
        return this;
    }

    hasntQs() {
        if (this.#qs != null) {
            this.#url += '?' + this.#qs
        }

        return this;
    }

    build() {
//        this.#url = (this.#url.endsWith('&')) ? this.#url.substring(0, this.#url.length -1) : this.#url;
        return this.#url;
    }
}
