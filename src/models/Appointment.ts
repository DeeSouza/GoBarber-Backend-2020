class Appointment {
	provider: string;

	date: Date;

	constructor(provider: string, date: Date) {
		this.provider = provider;
		this.date = date;
	}
}

export default Appointment;
