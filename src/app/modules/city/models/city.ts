import { z } from "zod";

export class City {
    public id?: number;
    public nameEn: string;
    public nameBn: string;
    public nameAr: string;
    public nameHi: string;
    public countryId: number;

    constructor(data?: Partial<City>) {
        this.id = data?.id;
        this.nameEn = data?.nameEn;
        this.nameBn = data?.nameBn;
        this.nameAr = data?.nameAr;
        this.nameHi = data?.nameHi;
        this.countryId = data?.countryId;
    }

    static schema = z.object({
        id: z.number().optional(),
        nameEn: z.string("Name (English) is required").nonempty("Name (English) is required"),
        nameBn: z.string("Name (Bengali) is required").nonempty("Name (Bengali) is required"),
        nameAr: z.string("Name (Arabic) is required").nonempty("Name (Arabic) is required"),
        nameHi: z.string("Name (Hindi) is required").nonempty("Name (Hindi) is required"),
        countryId: z.preprocess(val => Number(val), z.coerce.number("Country is required").min(1, "Country is required").int("Country is required")),
    });
}