import nodemailer from 'nodemailer';
import { AppError } from './AppError';
import fs from 'fs/promises';
import path from 'path';

interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  template?: {
    name: string;
    variables?: Record<string, string>;
  };
}

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const readTemplate = async (templateName: string): Promise<string> => {
  try {
    const templatePath = path.join(
      __dirname,
      '../templates/emails',
      `${templateName}.html`
    );
    const template = await fs.readFile(templatePath, 'utf-8');
    return template;
  } catch (error) {
    throw new AppError(`Template ${templateName} not found`, 404);
  }
};

const replaceTemplateVariables = (
  template: string,
  variables: Record<string, string> = {}
): string => {
  return template.replace(
    /\{\{(\w+)\}\}/g,
    (match, key) => variables[key] || match
  );
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    let html = options.template
      ? await readTemplate(options.template.name)
      : undefined;

    if (html && options.template?.variables) {
      html = replaceTemplateVariables(html, options.template.variables);
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: html,
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    throw new AppError('Failed to send email', 500);
  }
};
