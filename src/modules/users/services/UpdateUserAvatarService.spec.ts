import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatar from './UpdateUserAvatarService';

describe('CreateUserAvatar', () => {
	it('should be able to update a avatar user', async () => {
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeStorageProvider = new FakeStorageProvider();

		const updateUserAvatar = new UpdateUserAvatar(
			fakeUsersRepository,
			fakeStorageProvider,
		);

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
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeStorageProvider = new FakeStorageProvider();

		const updateUserAvatar = new UpdateUserAvatar(
			fakeUsersRepository,
			fakeStorageProvider,
		);

		await expect(
			updateUserAvatar.execute({
				user_id: 'non-existing-user',
				avatarFilename: 'avatar.jpg',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should should delete old avatar when updating new one', async () => {
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeStorageProvider = new FakeStorageProvider();

		const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

		const updateUserAvatar = new UpdateUserAvatar(
			fakeUsersRepository,
			fakeStorageProvider,
		);

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
