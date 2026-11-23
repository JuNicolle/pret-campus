import type { Equipment } from '../types';
import { EQUIPMENTS_KEY } from './keys';
import { readList, writeList } from './listStorage';
import type { StorageReadResult, StorageResult } from './storageResult';

export async function loadEquipments(): Promise<StorageReadResult<Equipment[]>> {
  return readList<Equipment>(EQUIPMENTS_KEY);
}

export async function saveEquipments(equipments: Equipment[]): Promise<StorageResult> {
  return writeList(EQUIPMENTS_KEY, equipments);
}
