class Appointment {
	provider: string;

	date: Date;

	constructor({ provider, date }: Omit<Appointment, 'id'>) {
		this.provider = provider;
		this.date = date;
	}
}

export default Appointment;
