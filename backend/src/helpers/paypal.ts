import * as paypal from 'paypal-rest-sdk';
import { ConfigService } from '@nestjs/config';

export const configurePaypal = (configService: ConfigService) => {
  paypal.configure({
    mode: 'sandbox',
    client_id: configService.get<string>('PAYPAL_CLIENT_ID'),
    client_secret: configService.get<string>('PAYPAL_CLIENT_SECRET'),
  });
  return paypal;
};
