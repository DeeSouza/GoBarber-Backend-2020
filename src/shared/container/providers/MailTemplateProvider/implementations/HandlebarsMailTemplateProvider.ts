import handlebars from 'handlebars';

import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';
import IMailTemplateProvider from '../models/IMailTemplateProvider';

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
	public async parse({
		variables,
		template,
	}: IParseMailTemplateDTO): Promise<string> {
		const parseTemplate = handlebars.compile(template);

		return parseTemplate(variables);
	}
}

export default HandlebarsMailTemplateProvider;
