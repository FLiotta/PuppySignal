export const selectSession: any = (state: any): any => state.session;
export const selectSessionToken: any = (state: any) : string | undefined => state.session.token;