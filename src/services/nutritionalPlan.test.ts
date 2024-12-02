import axios from "axios";
import { NutritionalPlan } from "components/Nutrition/models/nutritionalPlan";
import {
    addNutritionalPlan,
    deleteNutritionalPlan,
    editNutritionalPlan, EditNutritionalPlanParams, getLastNutritionalPlan,
    getNutritionalPlansSparse
} from "services/nutritionalPlan";

jest.mock("axios");

describe("Nutritional plan service tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET plans - sparse', async () => {

        const planResponse = {
            count: 2,
            next: null,
            previous: null,
            results: [
                {
                    "id": 72559,
                    "creation_date": "2023-05-26",
                    "description": "first plan",
                    "only_logging": true,
                },
                {
                    "id": 60131,
                    "creation_date": "2022-06-01",
                    "description": "",
                    "only_logging": false,
                },
                {
                    "id": 24752,
                    "creation_date": "2023-08-01",
                    "description": "",
                    "only_logging": false,
                },
            ]
        };

        // @ts-ignore
        axios.get.mockImplementation(() => Promise.resolve({ data: planResponse }));

        const result = await getNutritionalPlansSparse();
        expect(axios.get).toHaveBeenCalledTimes(1);

        expect(result).toStrictEqual([
            new NutritionalPlan(72559, new Date('2023-05-26'), 'first plan', true),
            new NutritionalPlan(60131, new Date('2022-06-01'), '', false),
            new NutritionalPlan(24752, new Date('2023-08-01'), '', false),
        ]);
    });

    test("GET plans - sparse with results", async () => {
        const planResponse = {
            count: 2,
            results: [
                { id: 1, creation_date: "2023-05-26", description: "Plan 1", only_logging: true },
                { id: 2, creation_date: "2022-06-01", description: "Plan 2", only_logging: false },
            ],
        };

        // @ts-ignore
        axios.get.mockResolvedValue({ data: planResponse });

        const result = await getNutritionalPlansSparse();
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(result).toStrictEqual([
            new NutritionalPlan(1, new Date("2023-05-26"), "Plan 1", true),
            new NutritionalPlan(2, new Date("2022-06-01"), "Plan 2", false),
        ]);
    });

    test("GET plans - sparse with no results", async () => {
        const planResponse = { count: 0, results: [] };

        // @ts-ignore
        axios.get.mockResolvedValue({ data: planResponse });

        const result = await getNutritionalPlansSparse();
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(result).toStrictEqual([]);
    });

    test("GET last nutritional plan - no plans", async () => {
        const planResponse = { count: 0, results: [] };

        // @ts-ignore
        axios.get.mockResolvedValue({ data: planResponse });

        const result = await getLastNutritionalPlan();
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(result).toBeNull();
    });

    test("Add nutritional plan", async () => {
        const mockResponse = {
            id: 1,
            creationDate: new Date().toISOString(),
            description: "Test Plan",
            only_logging: true,
            goal_energy: 2000,
            goal_protein: 50,
            goal_carbohydrates: 250,
            goal_fiber: 30,
            goal_fat: 70,
            meals: [],
            diaryEntries: []
        };

        // @ts-ignore
        axios.post.mockResolvedValue({ data: mockResponse });

        const newPlan = await addNutritionalPlan({
            description: "Test Plan",
            only_logging: true,
            goal_energy: 2000,
            goal_protein: 50,
            goal_carbohydrates: 250,
            goal_fiber: 30,
            goal_fat: 70,
        });

        expect(axios.post).toHaveBeenCalledTimes(1);

        expect(newPlan).toEqual(
            expect.objectContaining({
                id: 1,
                creationDate: expect.any(Date),
                description: "Test Plan",
                onlyLogging: true,
                goalEnergy: 2000,
                goalProtein: 50,
                goalCarbohydrates: 250,
                goalFiber: 30,
                goalFat: null,
            })
        );
    });

    test("EDIT nutritional plan", async () => {
        const updatedPlan: EditNutritionalPlanParams = {
            id: 1,
            description: "Updated Plan",
            only_logging: false,
            goal_energy: 2500,
            goal_protein: 80,
            goal_carbohydrates: 300,
            goal_fiber: 35,
            goal_fat: 90,
        };

        const planResponse = { ...updatedPlan, creation_date: "2024-11-26T22:26:20.570Z" };

        // @ts-ignore
        axios.patch.mockResolvedValue({ data: planResponse });

        const result = await editNutritionalPlan(updatedPlan);

        expect(axios.patch).toHaveBeenCalledWith(
            expect.any(String),
            updatedPlan,
            expect.any(Object)
        );

        expect(result).toEqual(
            new NutritionalPlan(
                1,
                new Date("2024-11-26T22:26:20.570Z"),
                "Updated Plan",
                false,
                2500,
                80,
                300,
                35,
                90,
                null,
                null
            )
        );
    });

    test("DELETE nutritional plan", async () => {
        const planId = 1;

        // @ts-ignore
        axios.delete.mockResolvedValue({});

        await deleteNutritionalPlan(planId);
        expect(axios.delete).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
    });
});
