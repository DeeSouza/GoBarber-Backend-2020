import { Router } from 'express';
import { startOfHour, parseISO, isEqual } from 'date-fns';

interface Appointment {
	provider: string;
	date: Date;
}

const appointmentsRouter = Router();
const appointments: Appointment[] = [];

appointmentsRouter.get('/', (request, response) => {
	return response.json(appointments);
});

appointmentsRouter.post('/', (request, response) => {
	const { provider, date } = request.body;

	const parsedDate = startOfHour(parseISO(date));
	const findAppointmentInSameDate = appointments.find(appointment =>
		isEqual(parsedDate, appointment.date),
	);

	if (findAppointmentInSameDate) {
		return response.status(400).json({
			message: 'O sistema já possui um agendamento nesse horário.',
		});
	}

	const appointment = {
		provider,
		date: parsedDate,
	};

	appointments.push(appointment);

	return response.json(appointment);
});

export default appointmentsRouter;
