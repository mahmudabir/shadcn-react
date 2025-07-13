export class Country {
  public id?: number;
  public nameEn?: string;
  public nameBn?: string;
  public nameAr?: string;
  public nameHi?: string;

  /**
   *
   */
  constructor(data?: Partial<Country>) {
    this.id = data?.id;
    this.nameEn = data?.nameEn;
    this.nameBn = data?.nameBn;
    this.nameAr = data?.nameAr;
    this.nameHi = data?.nameHi;
  }
}
