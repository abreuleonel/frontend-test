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
        this.#endpoint = this.#endpoint.split('//').join('/')
        return this;
    }

    endpointBeginsWithSlash() {
        if(this.#endpoint.indexOf('/') !== 0)
            return this;

        let arrayEndpoint = this.#endpoint.split('')
        arrayEndpoint.shift()
        this.#endpoint = arrayEndpoint.join('')

        return this;
    }

    urlLastIndexOfDifferentFromMinusOne() {
        (this.#endpoint && this.#url.lastIndexOf('/') != this.#url.length - 1) ? this.#url += '/' : this.#url;

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
        
        const qq = queryAsArray.reduce((acc: any, cur: any, currentIndex) => {
            let add = "";
            if(cur[1] == null 
                || Number.isNaN(cur[1]) 
                || typeof cur[1] == undefined)
                return acc;

            let value = cur[1];

            let name = this.#opts.queryStringParser
            ? this.#opts.queryStringParser(cur[0])
            : cur[0];
            
            if(Array.isArray(value)){
                value = value as Array<any>
                for (let u = 0; u < value.length; u++) {
                    add += name + '[]=' + value[u]
                    if (u < value.length - 1) add += '&'
                }    
            }
            else{
                add = name + '=' + value    
            }            

            if (currentIndex < queryAsArray.length - 1) add += '&'

            return acc + add;
        }, this.#qs);

        this.#qs = qq;

        return this;
    }

    urlSlashNotLastCharacter() {
        if (this.#url.lastIndexOf('/') == this.#url.length - 1) {
            let arrayUrl = this.#url.split('')
            arrayUrl.pop()
            this.#url = arrayUrl.join('')
        }

        return this;
    }

    hasntQs() {
        if (this.#qs != null) {
            this.#url += '?' + this.#qs
        }

        return this;
    }

    printUrlAndEndpoint() {
        console.log("url", this.#url, "endpoint", this.#endpoint);
        
        return this;
    }

    build() {
        return this.#url;
    }
}
