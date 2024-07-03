type TOptions = {
    page: number,
    limit: number,
    sortBy?: string,
    sortOrder?: string
}

const calculatePaginationAndSorting = (options: TOptions) => {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 2;
    const skip = Number(options.page) - 1 * limit || 1;
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';

    return {
        page,
        limit,
        sortBy,
        sortOrder
    }

};

export default calculatePaginationAndSorting