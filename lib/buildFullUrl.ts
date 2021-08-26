//import kebabCase from 'lodash/kebabCase'
import type { Options } from '../types'
import UrlProcessorPipeline from './urlProcessorPipeline';

export default function buildFullUrl(opts: Options) {
  return UrlProcessorPipeline.runPipeline(opts);
}