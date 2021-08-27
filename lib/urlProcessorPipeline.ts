import type { Options } from '../types';
import UrlProcessorFluentAPI from './urlProcessorFluentAPI';

export default class UrlProcessorPipeline {
    static runPipeline(opts: Options) {
        return new UrlProcessorFluentAPI(opts)
        .formatEndpoint()
        .formatUrl()
        .formatQuery()        
        .build();
    }
}
