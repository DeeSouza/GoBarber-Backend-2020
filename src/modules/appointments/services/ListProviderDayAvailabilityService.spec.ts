import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailabilityService', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		listProviderDayAvailability = new ListProviderDayAvailabilityService(
			fakeAppointmentsRepository,
		);
	});

	it('should be able to list the day availability from provider', async () => {
		await fakeAppointmentsRepository.create({
			user_id: 'user-id',
			provider_id: 'user',
			date: new Date(2020, 4, 20, 8, 0, 0),
		});

		await fakeAppointmentsRepository.create({
			user_id: 'user-id',
			provider_id: 'user',
			date: new Date(2020, 4, 20, 10, 0, 0),
		});

		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 20, 11).getTime();
		});

		const availability = await listProviderDayAvailability.execute({
			provider_id: 'user',
			day: 20,
			month: 5,
			year: 2020,
		});

		expect(availability).toEqual(
			expect.arrayContaining([
				{ hour: 8, available: false },
				{ hour: 9, available: false },
				{ hour: 10, available: false },
				{ hour: 11, available: false },
				{ hour: 12, available: true },
				{ hour: 13, available: true },
				{ hour: 14, available: true },
			]),
		);
	});
});
