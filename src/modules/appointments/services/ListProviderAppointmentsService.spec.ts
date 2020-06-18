import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviderAppointmentsService: ListProviderAppointmentsService;

describe('ListProviderAppointmentsService', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		fakeCacheProvider = new FakeCacheProvider();

		listProviderAppointmentsService = new ListProviderAppointmentsService(
			fakeAppointmentsRepository,
			fakeCacheProvider,
		);
	});

	it('should be able to list the appointments', async () => {
		const appointmentOne = await fakeAppointmentsRepository.create({
			provider_id: 'provider-id',
			user_id: 'user-id',
			date: new Date(2020, 4, 20, 8, 0, 0),
		});

		const appointmentTwo = await fakeAppointmentsRepository.create({
			provider_id: 'provider-id',
			user_id: 'user-id',
			date: new Date(2020, 4, 20, 9, 0, 0),
		});

		const appointments = await listProviderAppointmentsService.execute({
			day: 20,
			month: 5,
			year: 2020,
			provider_id: 'provider-id',
		});

		expect(appointments).toEqual([appointmentOne, appointmentTwo]);
	});
});
