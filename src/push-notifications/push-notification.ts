export interface PushNotification {
  title: string;
  body: string;
  data: {
    roomId: string;
    hubSlug: string;
  };
}
