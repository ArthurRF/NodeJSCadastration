import dayjs from "dayjs";

import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;

describe("Create Rental", () => {
    const dayAdd24Hours = dayjs().add(1, "day").toDate();
    beforeEach(() => {
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        dayjsDateProvider = new DayjsDateProvider();
        createRentalUseCase = new CreateRentalUseCase(
            rentalsRepositoryInMemory,
            dayjsDateProvider,
            carsRepositoryInMemory
        );
    });

    it("Should be able to create a new rental", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Fusca",
            description: "Ford Fusca",
            daily_rate: 100,
            license_plate: "ABC-1234",
            fine_amount: 10,
            category_id: '1234',
            brand: 'Ford',
        });

        const rental = await createRentalUseCase.execute({
            user_id: "12344",
            car_id: car.id,
            expected_return_date: dayAdd24Hours,
        });

        expect(rental).toHaveProperty("id");
        expect(rental).toHaveProperty("start_date");
    });

    it("Should not be able to create a new rental if there's another open rental to the same user", async () => {
        await rentalsRepositoryInMemory.create({
            car_id: '11222',
            expected_return_date: dayAdd24Hours,
            user_id: '12344',
        });

        await expect(
            createRentalUseCase.execute({
                user_id: "12344",
                car_id: "11122",
                expected_return_date: dayAdd24Hours,
            })
        ).rejects.toEqual(new AppError("There's a rental in progress to this user!"));
    });

    it("Should not be able to create a new rental if there's another open rental to the same car", async () => {
        await rentalsRepositoryInMemory.create({
            car_id: 'test',
            expected_return_date: dayAdd24Hours,
            user_id: '12344',
        });

        await expect(
            createRentalUseCase.execute({
                user_id: "321",
                car_id: "test",
                expected_return_date: dayAdd24Hours,
            })
        ).rejects.toEqual(new AppError("Car is unavailable!"));
    });

    it("Should not be able to create a new rental with invalid return time", async () => {
        await expect(createRentalUseCase.execute({
            user_id: "123",
            car_id: "test",
            expected_return_date: dayjs().toDate(),
        })
        ).rejects.toEqual(new AppError("Invalid return time!"));
    });
});
