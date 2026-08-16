import PocketBase from 'pocketbase';
import { environment } from '../../../environments/environment';

// Instancia global de PocketBase
export const pb = new PocketBase(environment.apiUrl);

pb.autoCancellation(false);
