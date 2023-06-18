import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { UnauthorizedException } from "@nestjs/common";


export class JwtStrategy extends PassportStrategy( Strategy ){

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly configService: ConfigService

    ){
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate( payload: JwtPayload): Promise<User>{

        const { id } = payload;

        const user = await this.userRepository.findOneBy({ id });

        if( !user ) throw new UnauthorizedException('Token not valid');

        if( !user.isActive) throw new UnauthorizedException('User is inactive, talk with an admin');

        return user;

    }

}