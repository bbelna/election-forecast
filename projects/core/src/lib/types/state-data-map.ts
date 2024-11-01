import { StateData } from '../models/state-data';
import { StateDataKey } from './state-data-key';

/**
 * Stores state data, keyed by `StateDataKey`.
 */
export type StateDataMap = Map<StateDataKey, StateData>;
