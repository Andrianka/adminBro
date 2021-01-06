import { User } from '../../user/user.entity';

export default interface MailInfo {
  emailTo: string;
  template: string;
  content: any;
}
