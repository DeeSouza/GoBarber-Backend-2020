import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();

		createAppointment = new CreateAppointmentService(
			fakeAppointmentsRepository,
		);

		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});
	});

	it('should be able to create a new appointment', async () => {
		const appointment = await createAppointment.execute({
			date: new Date(2020, 4, 10, 13),
			provider_id: 'provider-id',
			user_id: 'user-id',
		});

		expect(appointment).toHaveProperty('id');
		expect(appointment.provider_id).toBe('provider-id');
	});

	it('should not be able to create two appointments on the same time', async () => {
		const appointmentDate = new Date(2020, 6, 11, 13);

		await createAppointment.execute({
			date: appointmentDate,
			provider_id: 'provider-id',
			user_id: 'user-id',
		});

		await expect(
			createAppointment.execute({
				date: appointmentDate,
				provider_id: 'provider-id',
				user_id: 'user-id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create an appointments on a past date', async () => {
		await expect(
			createAppointment.execute({
				date: new Date(2020, 4, 10, 11),
				provider_id: 'provider-id',
				user_id: 'user-id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create an appointments to myself', async () => {
		await expect(
			createAppointment.execute({
				date: new Date(2020, 4, 10, 18),
				provider_id: 'user-id',
				user_id: 'user-id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create an appointments before 8am and after 5pm', async () => {
		await expect(
			createAppointment.execute({
				date: new Date(2020, 4, 11, 7),
				provider_id: 'provider-id',
				user_id: 'user-id',
			}),
		).rejects.toBeInstanceOf(AppError);

		await expect(
			createAppointment.execute({
				date: new Date(2020, 4, 11, 18),
				provider_id: 'provider-id',
				user_id: 'user-id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
