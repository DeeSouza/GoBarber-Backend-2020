import handlebars from 'handlebars';

import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';
import IMailTemplateProvider from '../models/IMailTemplateProvider';

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
	public async parse({
		variables,
		file,
	}: IParseMailTemplateDTO): Promise<string> {
		const parseTemplate = handlebars.compile(file);

		return parseTemplate(variables);
	}
}

export default HandlebarsMailTemplateProvider;
