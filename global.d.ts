declare namespace NodeJS {
    interface ProcessEnv {
    JWT_SECRET: string;
    DATABASE_URL:string;
    PORT:string;
    SESSION_SECRET:string;
    HOST_DOMAIN:string;
    USER:string;
    PASS:string;
    MAIL_FROM:string;
    CLIENT_ID:string;
    CLIENT_SECRET:string;
    FACEBOOK_APP_SECRET:string;
    FACEBOOK_APP_ID:string;
    LINKEDIN_CLIENT_ID:string;
    LINKEDIN_SECRET:string;
    GITHUB_CLIENT_ID:string;
    GITHUB_SECRET:string;
    }
}
