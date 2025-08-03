
export interface IOtpRepository {
  saveOtp(email: string, hashedOtp: string): Promise<boolean>;
  checkOtp(email: string, otp: number): Promise<boolean>;
}
