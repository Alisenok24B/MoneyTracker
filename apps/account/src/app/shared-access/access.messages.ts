export const AccessMessages = {
  invite  : (from: string) => `${from} приглашает вас к совместному бюджету`,
  accepted: (to  : string) => `${to} принял(а) ваше приглашение`,
  rejected: (to  : string) => `${to} отклонил(а) ваше приглашение`,
  canceled: (from: string) => `${from} прекратил(а) совместный бюджет`,
};