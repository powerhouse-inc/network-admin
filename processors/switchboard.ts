import type { ProcessorFactoryBuilder } from "@powerhousedao/reactor";
import { workstreamsProcessorFactory } from "./workstreams/factory.js";

export const processorFactoryBuilders: ProcessorFactoryBuilder[] = [
  workstreamsProcessorFactory,
];
