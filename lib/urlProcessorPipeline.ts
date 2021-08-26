import type { Options } from '../types';
import UrlProcessorFluentAPI from './urlProcessorFluentAPI';

export default class UrlProcessorPipeline {
    static runPipeline(opts: Options) {
        return new UrlProcessorFluentAPI(opts)
        .hasOptsUrlParser()
        .hasOptsPath()
        .hasOptsIdButNotCustomPath()
        .hasOptsIdAndCustomPath()
        .splitEndpointSlashes()
        .endpointBeginsWithSlash()
        .urlLastIndexOfDifferentFromMinusOne()
        .joinUrlWithEndpoint()
        .hasOptsQuery()
        .urlSlashNotLastCharacter()
        .hasntQs()
        .build();
    }
}
