export enum STATUS_CODES {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,     // a successful request with no content returned.
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,    // When authentication fails
    FORBIDDEN = 403,   // When the user is blocked by the admin.
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500
}