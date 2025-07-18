import z from "zod";

export class Country {
  public id?: number;
  public nameEn: string;
  public nameBn: string;
  public nameAr: string;
  public nameHi: string;
  public isIndependent: boolean | null;

  constructor(data?: Partial<Country>) {
    this.id = data?.id;
    this.nameEn = data?.nameEn;
    this.nameBn = data?.nameBn;
    this.nameAr = data?.nameAr;
    this.nameHi = data?.nameHi;
    this.isIndependent = data?.isIndependent ?? null;
  }

    static schema = z.object({
    id: z.number().optional(),
    nameEn: z.string("Name (English) is required").nonempty("Name (English) is required"),
    nameBn: z.string("Name (Bengali) is required").nonempty("Name (Bengali) is required"),
    nameAr: z.string("Name (Arabic) is required").nonempty("Name (Arabic) is required"),
    nameHi: z.string("Name (Hindi) is required").nonempty("Name (Hindi) is required"),
    // isIndependent: z.boolean().nullable().refine(val => val !== null, {
    //   message: "Must be checked or unchecked"
    // }),
  });
}
