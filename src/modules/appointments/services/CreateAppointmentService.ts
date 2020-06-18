import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
	user_id: string;
	provider_id: string;
	date: Date;
}

@injectable()
class CreateAppointmentService {
	constructor(
		@inject('AppointmentsRepository')
		private appointmentsRepository: IAppointmentsRepository,

		@inject('NotificationsRepository')
		private notificationsRepository: INotificationsRepository,

		@inject('CacheProvider')
		private cacheProvider: ICacheProvider,
	) {}

	public async execute({
		user_id,
		provider_id,
		date,
	}: IRequest): Promise<Appointment> {
		const appointmentDate = startOfHour(date);

		if (isBefore(appointmentDate, Date.now())) {
			throw new AppError('Não é possível agendar um horário no passado.', 400);
		}

		if (user_id === provider_id) {
			throw new AppError(
				'Não é possível agendar um horário consigo mesmo.',
				400,
			);
		}

		if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
			throw new AppError(
				'Vocẽ pode agendar um horário apenas entre 8h e as 17h.',
				400,
			);
		}

		const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
			appointmentDate,
		);

		if (findAppointmentInSameDate) {
			throw new AppError(
				'O sistema já possui um agendamento nesse horário.',
				400,
			);
		}

		const appointment = await this.appointmentsRepository.create({
			user_id,
			provider_id,
			date: appointmentDate,
		});

		const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'ás' HH'h'mm");

		await this.notificationsRepository.create({
			recipient_id: provider_id,
			content: `Novo agendamento para data ${dateFormatted}`,
		});

		await this.cacheProvider.invalidate(
			`provider-appointments: ${provider_id}:${format(
				appointmentDate,
				'yyyy-M-D',
			)}`,
		);

		return appointment;
	}
}

export default CreateAppointmentService;
