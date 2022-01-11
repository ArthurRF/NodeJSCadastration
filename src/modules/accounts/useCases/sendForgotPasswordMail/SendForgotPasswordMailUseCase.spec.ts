import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";
import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let mailProvider: MailProviderInMemory;
let dateProvider: DayjsDateProvider;
let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;

describe("Send forgot mail", () => {

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        dateProvider = new DayjsDateProvider();
        usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
        mailProvider = new MailProviderInMemory();
        sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
            usersRepositoryInMemory,
            usersTokensRepositoryInMemory,
            dateProvider,
            mailProvider
        );
    })

    it("Should be able to send a forgot password mail to user", async () => {
        const sendMail = jest.spyOn(mailProvider, "sendMail");

        await usersRepositoryInMemory.create({
            driver_license: "761243",
            email: "sahefog@dabvansus.pt",
            name: "Luella Houston",
            password: "1234",
        });

        await sendForgotPasswordMailUseCase.execute("sahefog@dabvansus.pt");

        expect(sendMail).toHaveBeenCalled();
    });

    it("Should not be able to send email if the user does not exists", async () => {
        await expect(
            sendForgotPasswordMailUseCase.execute("awugar@jumjines.uy")
        ).rejects.toEqual(new AppError("User does not exists!"));
    });

    it("Should be able to create an user token", async () => {
        const generateTokenMail = jest.spyOn(usersTokensRepositoryInMemory, "create");

        const user = await usersRepositoryInMemory.create({
            driver_license: "411312",
            email: "lacacarok@gelkih.np",
            name: "Nettie Buchanan",
            password: "1234",
        });

        await sendForgotPasswordMailUseCase.execute("lacacarok@gelkih.np");

        expect(generateTokenMail).toBeCalled();
    })
})