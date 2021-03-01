export interface LeadFormModel {
    sessionId?: string | undefined;
    applicationId?: string | undefined;
    deviceId: string | undefined;
    userId: string | undefined;
    locale?: string | undefined;
    language: String | undefined;
    createDateTime?: string | undefined;
    leadFormDateTime: string | undefined;
    financingOption: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    contactNumber: string | undefined;
    emailValue: string | null | undefined;
}