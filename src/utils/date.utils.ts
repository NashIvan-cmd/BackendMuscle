export const dateParser = (stringDate: string): Date => {
    const newDate = new Date(stringDate);

    if(!(newDate instanceof Date)) {
        throw new Error("Invalid string date");
    }

    return newDate;
}