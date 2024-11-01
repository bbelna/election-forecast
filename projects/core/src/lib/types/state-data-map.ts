import { StateMapData } from '../models/state-map-data';
import { StateDataKey } from './state-data-key';

/**
 * Stores state data, keyed by `StateDataKey`.
 */
export type StateDataMap = Map<StateDataKey, StateMapData>;
