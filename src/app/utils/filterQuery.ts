const filterQuery = (obj: any, fieldsArr: string[]) => {
    // console.log({ obj, fieldsArr });
    const filterObject = Object.keys(obj).filter(key => fieldsArr.includes(key)).reduce((filterObj, key) => {
        filterObj[key] = obj[key]
        return filterObj
    }, {} as any);
    return filterObject
};

export default filterQuery

// Diferent solution

// const pick =<T extends Record<string, unknown>, k extends keyof T>(obj:T, keys:k[]) => {
//     const finalObj: Partial<T>= {};

//     for (const key of keys) {
//         if (obj && Object.hasOwnProperty.call(obj, key)) {
//             finalObj[key] = obj[key]
//         }
//     }
//     return finalObj
// }