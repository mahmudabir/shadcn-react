import type { Country } from '../models/country';
import type { PagedData } from '@/app/core/models/pagination';
import type { Result } from '@/app/core/models/result';
import api from "@/app/core/api/base-api.ts";

const API_BASE = '/countries';

export async function getCountries(): Promise<Result<PagedData<Country>>> {
    const res = await api.get(API_BASE, { skipPreloader: true });
    return res.data;
}

export async function getCountryById(id: string): Promise<Result<Country>> {
    const res = await api.get(`${API_BASE}/${id}`);
    return res.data;
}

export async function createCountry(data: Omit<Country, 'id'>): Promise<Result<Country>> {
    const res = await api.post(API_BASE, data);
    return res.data;
}

export async function updateCountry(id: string, data: Omit<Country, 'id'>): Promise<Result<Country>> {
    const res = await api.put(`${API_BASE}/${id}`, data);
    return res.data;
}

export async function deleteCountry(id: string): Promise<Result<boolean>> {
    const res = await api.delete(`${API_BASE}/${id}`);
    return res.data;
}
