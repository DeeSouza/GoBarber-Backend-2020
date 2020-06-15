import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatar from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatar;

describe('CreateUserAvatar', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakeStorageProvider = new FakeStorageProvider();

		updateUserAvatar = new UpdateUserAvatar(
			fakeUsersRepository,
			fakeStorageProvider,
		);
	});

	it('should be able to update a avatar user', async () => {
		const user = await fakeUsersRepository.create({
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			password: '123456',
		});

		await updateUserAvatar.execute({
			user_id: user.id,
			avatarFilename: 'avatar.jpg',
		});

		expect(user.avatar).toBe('avatar.jpg');
	});

	it('should not be able to update from non existing user', async () => {
		await expect(
			updateUserAvatar.execute({
				user_id: 'non-existing-user',
				avatarFilename: 'avatar.jpg',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should should delete old avatar when updating new one', async () => {
		const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

		const user = await fakeUsersRepository.create({
			name: 'John Doe',
			email: 'johndoe@gmail.com',
			password: '123456',
		});

		await updateUserAvatar.execute({
			user_id: user.id,
			avatarFilename: 'avatar.jpg',
		});

		await updateUserAvatar.execute({
			user_id: user.id,
			avatarFilename: 'avatar-2.jpg',
		});

		expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
		expect(user.avatar).toBe('avatar-2.jpg');
	});
});
