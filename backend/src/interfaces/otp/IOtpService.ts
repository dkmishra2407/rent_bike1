export interface IOtpService {
  generateAndSendOtp(email: string): Promise<string | null>;
  verifyOtp(data: { otp: number; userId: string }): Promise<boolean>;
}
