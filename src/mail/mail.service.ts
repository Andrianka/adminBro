import { Injectable, BadGatewayException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';
import mailInfo from './interfaces/mailInfo.interface';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async send({
    emailTo,
    content,
    template,
  }: mailInfo): Promise<SentMessageInfo> {
    try {
      console.log('content', content);
      const emailData = this.mailerService.sendMail({
        to: emailTo,
        subject: content.subject,
        template: template,
        context: { content: content },
      });
    } catch (e) {
      throw new BadGatewayException('Email send failed');
    }
  }
}
