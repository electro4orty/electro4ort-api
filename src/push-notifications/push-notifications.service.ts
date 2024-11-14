import { env } from '@/utils/env';
import { Injectable } from '@nestjs/common';
import { sendNotification, PushSubscription } from 'web-push';
import { PushNotification } from './push-notification';

@Injectable()
export class PushNotificationsService {
  send(subscription: PushSubscription, data: PushNotification) {
    sendNotification(subscription, JSON.stringify(data), {
      vapidDetails: {
        privateKey: env.WEB_PUSH_PRIVATE_KEY,
        publicKey: env.WEB_PUSH_PUBLIC_KEY,
        subject: `mailto:${env.ADMIN_EMAIL}`,
      },
    });
  }
}
