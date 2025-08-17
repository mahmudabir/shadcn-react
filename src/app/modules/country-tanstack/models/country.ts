import z from "zod";
import { City } from "@/app/modules/city-tanstack/models/city.ts";

export class Country {
    public id?: any;
    public nameEn: string;
    public nameBn: string;
    public nameAr: string;
    public nameHi: string;
    public cities: City[] = [];

    constructor(data?: Partial<Country>) {
        this.id = data?.id;
        this.nameEn = data?.nameEn;
        this.nameBn = data?.nameBn;
        this.nameAr = data?.nameAr;
        this.nameHi = data?.nameHi;
        // this.isIndependent = data?.isIndependent ?? null;
    }

    static schema = z.object({
        id: z.number().optional(),
        nameEn: z.string("Name (English) is required").nonempty("Name (English) is required"),
        nameBn: z.string("Name (Bengali) is required").nonempty("Name (Bengali) is required"),
        nameAr: z.string("Name (Arabic) is required").nonempty("Name (Arabic) is required"),
        nameHi: z.string("Name (Hindi) is required").nonempty("Name (Hindi) is required"),
        cities: City.schema.array().optional(),
        // isIndependent: z.boolean().nullable().refine(val => val !== null, {
        //   message: "Must be checked or unchecked"
        // }),
    });
}