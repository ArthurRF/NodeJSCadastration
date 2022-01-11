import { Request, Response } from "express";
import { container } from "tsyringe";
import { ResetPasswordUserUseCase } from "./ResetPasswordUserUseCase";



class ResetPasswordUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { token: refresh_token } = request.query;
        const { password } = request.body;
        const resetPasswordUserUseCase = container.resolve(
            ResetPasswordUserUseCase
        );

        await resetPasswordUserUseCase.execute({
            refresh_token: String(refresh_token),
            password
        });

        return response.json({ ok: true });
    }
}

export { ResetPasswordUserController }