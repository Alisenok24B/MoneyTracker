export class NotificationEntity {
    _id?: string;
    userId!: string;
    text!: string;
    /** true → всплывающее уведомление требует действия */
    requiresResponse!: boolean;
    read = false;
    createdAt?: Date;
  
    constructor(data: Partial<NotificationEntity>) {
      Object.assign(this, data);
    }
  
    markRead(): this {
      this.read = true;
      return this;
    }
  }