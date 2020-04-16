import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/Users';

interface Request {
	name: string;
	email: string;
	password: string;
}

class CreateUserService {
	public async execute({ name, email, password }: Request): Promise<User> {
		const usersRepository = getRepository(User);

		const checkUserExists = await usersRepository.findOne({
			where: { email },
		});

		if (checkUserExists) {
			throw new Error('Já existe um usuário com esse e-mail.');
		}

		const hashPassword = await hash(password, 8);

		const user = usersRepository.create({
			name,
			email,
			password: hashPassword,
		});

		await usersRepository.save(user);

		return user;
	}
}

export default CreateUserService;
