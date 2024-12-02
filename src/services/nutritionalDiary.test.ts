import axios from "axios";
import { DiaryEntryAdapter } from "components/Nutrition/models/diaryEntry";
import {
    addNutritionalDiaryEntry,
    deleteNutritionalDiaryEntry,
    editNutritionalDiaryEntry,
    getNutritionalDiaryEntries
} from "services/nutritionalDiary";

jest.mock("utils/requests", () => ({
    fetchPaginated: jest.fn().mockImplementation(function* () {
        yield [
            {
                id: 1,
                plan: 123,
                meal: 456,
                ingredient: 789,
                weight_unit: 1,
                amount: '100',
                datetime: '2023-12-01T10:00:00Z'
            },
            {
                id: 2,
                plan: 123,
                meal: 457,
                ingredient: 790,
                weight_unit: 2,
                amount: '200',
                datetime: '2023-12-02T11:00:00Z'
            }
        ];
    })
}));

jest.mock("axios");
jest.mock("services/ingredientweightunit", () => ({
    getWeightUnit: jest.fn().mockResolvedValue({ id: 1, name: 'g' })
}));

describe("nutritional diary service tests", () => {
    const mockDate = new Date('2023-12-01T10:00:00Z');

    const mockAddParams = {
        plan: 123,
        meal: 456,
        ingredient: 789,
        weight_unit: 1,
        datetime: mockDate.toISOString(),
        amount: 100
    };

    const mockResponseData = {
        id: 1,
        plan: 123,
        meal: 456,
        ingredient: 789,
        weight_unit: 1,
        amount: '100',
        datetime: mockDate
    };

    test('GET nutritional diary entries', async () => {
        const result = await getNutritionalDiaryEntries(123);

        expect(result).toStrictEqual([
            expect.objectContaining({
                id: 1,
                planId: 123,
                mealId: 456,
                ingredientId: 789,
                weightUnitId: 1,
                amount: 100,
                datetime: new Date('2023-12-01T10:00:00Z')
            }),
            expect.objectContaining({
                id: 2,
                planId: 123,
                mealId: 457,
                ingredientId: 790,
                weightUnitId: 2,
                amount: 200,
                datetime: new Date('2023-12-02T11:00:00Z')
            })
        ]);
    });

    test('ADD nutritional diary entry', async () => {
        // @ts-ignore
        axios.post.mockResolvedValue({ data: mockResponseData });

        const result = await addNutritionalDiaryEntry(mockAddParams);

        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(result).toStrictEqual(
            new DiaryEntryAdapter().fromJson(mockResponseData)
        );
    });

    test('EDIT nutritional diary entry', async () => {
        const mockEditParams = {
            ...mockAddParams,
            id: 1
        };

        // @ts-ignore
        axios.patch.mockResolvedValue({ data: mockResponseData });

        const result = await editNutritionalDiaryEntry(mockEditParams);

        expect(axios.patch).toHaveBeenCalledTimes(1);
        expect(result).toStrictEqual(
            new DiaryEntryAdapter().fromJson(mockResponseData)
        );
    });

    test('DELETE nutritional diary entry', async () => {
        // @ts-ignore
        axios.delete.mockResolvedValue({});

        await deleteNutritionalDiaryEntry(1);

        expect(axios.delete).toHaveBeenCalledTimes(1);
    });
});