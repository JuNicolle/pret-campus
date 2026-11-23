import type { Loan } from '../types';
import { LOANS_KEY } from './keys';
import { readList, writeList } from './listStorage';
import type { StorageReadResult, StorageResult } from './storageResult';

export async function loadLoans(): Promise<StorageReadResult<Loan[]>> {
  return readList<Loan>(LOANS_KEY);
}

export async function saveLoans(loans: Loan[]): Promise<StorageResult> {
  return writeList(LOANS_KEY, loans);
}
