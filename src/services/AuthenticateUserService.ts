import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User from '../models/Users';

interface Request {
	email: string;
	password: string;
}

interface Response {
	user: User;
}

class AuthenticateUserService {
	public async execute({ email, password }: Request): Promise<Response> {
		const usersRepository = getRepository(User);

		const user = await usersRepository.findOne({
			where: { email },
		});

		if (!user) {
			throw new Error('Credenciais de usuário não encontrado.');
		}

		const passwordMatched = await compare(password, user.password);

		if (!passwordMatched) {
			throw new Error('Credenciais de usuário não encontrado.');
		}

		const token = sign();

		return { user };
	}
}

export default AuthenticateUserService;
