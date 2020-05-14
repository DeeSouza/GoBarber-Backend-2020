import { hash } from 'bcryptjs';

import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUsersRepository';

interface IRequest {
	name: string;
	email: string;
	password: string;
}

class CreateUserService {
	constructor(private usersRepository: IUserRepository) {}

	public async execute({ name, email, password }: IRequest): Promise<User> {
		const checkUserExists = await this.usersRepository.findByEmail(email);

		if (checkUserExists) {
			throw new AppError('Já existe um usuário com esse e-mail.', 400);
		}

		const hashPassword = await hash(password, 8);

		const user = this.usersRepository.create({
			name,
			email,
			password: hashPassword,
		});

		return user;
	}
}

export default CreateUserService;
