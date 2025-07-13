export class Pagination {

    public pageNumber?: number;
    public pageSize?: number;
    public totalRecord: number;
    public first?: number;
    public rows: number;
    public asPage?: boolean;
    public asDropdown?: boolean;

    constructor(init?: Partial<Pagination>) {

        init = init || {};

        if (!init || !init.pageNumber) this.pageNumber = 1;
        else this.pageNumber = init.pageNumber <= 0 ? 1 : init.pageNumber;

        if (!init || !init.pageSize) this.pageSize = 10;
        else this.pageSize = init.pageSize <= 0 ? 10 : init.pageSize;

        this.first = init.first || (this.pageNumber - 1) * this.pageSize;
        this.rows = init.rows || this.pageSize;

        this.pageNumber = ((this.first ?? 0) / (this.rows ?? 0)) + 1;
        this.pageSize = this.rows;

        this.totalRecord = init.totalRecord || 0;

        this.asPage = init.asPage || true;
        this.asDropdown = init.asDropdown || false;
    }

    recalculate(deletedCount: number = 1): Pagination {
        if (!deletedCount || deletedCount <= 0) return this;

        this.totalRecord = Math.max(0, (this.totalRecord ?? 0) - deletedCount);

        // Adjust page number if necessary
        const maxPageNumber = Math.ceil((this.totalRecord ?? 0) / (this.pageSize ?? 1));
        this.pageNumber = Math.min(this.pageNumber ?? 1, maxPageNumber > 0 ? maxPageNumber : 1);

        // Recalculate first index
        this.first = (this.pageNumber - 1) * (this.pageSize ?? 10);

        return this;
    }
}

export class PagedData<T> {
    pageNumber!: number;
    pageSize!: number;
    totalPage!: number;
    totalRecord!: number;
    content: T[] = [];

    constructor(init?: Partial<PagedData<T>>) {
        Object.assign(this, init);
    }
}
