import { inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { resolve } from 'path';

import { AppError } from '@shared/errors/AppError';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { IMailProvider } from '@shared/container/providers/MailProvider/IMailProvider';

@injectable()
class SendForgotPasswordMailUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,
        @inject("MailProvider")
        private mailProvider: IMailProvider
    ) { }

    async execute(email: string): Promise<void> {
        const user = await this.usersRepository.findByEmail(email);

        const templatePath = resolve(__dirname, '..', '..', 'views', 'emails', 'forgotPassword.hbs');

        if (!user) {
            throw new AppError('User does not exists!');
        }

        const token = uuidv4();

        const expires_date = this.dateProvider.addHours(3);

        await this.usersTokensRepository.create({
            user_id: user.id,
            refresh_token: token,
            expires_date
        });

        const variables = {
            name: user.name,
            link: `${process.env.FORGOT_MAIL_URL}${token}`
        };

        await this.mailProvider.sendMail(
            email,
            'Recuperação de senha',
            variables,
            templatePath
        );
    }
}

export { SendForgotPasswordMailUseCase };