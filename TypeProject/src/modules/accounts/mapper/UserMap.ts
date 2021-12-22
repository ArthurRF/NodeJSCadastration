import { instanceToPlain } from "class-transformer";
import { User } from "../infra/typeorm/entities/User";
import { IUserResponseDTO } from "../dtos/IUserResponseDTO";

class UserMap {

    static toDTO({
        email,
        name,
        id,
        avatar,
        driver_license,
        avatar_url,
    }: User): IUserResponseDTO {
        const user = instanceToPlain({
            email,
            name,
            id,
            avatar,
            driver_license,
            avatar_url
        })
        return user as IUserResponseDTO;
    }
}

export { UserMap };