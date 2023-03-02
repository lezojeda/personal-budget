export const MESSAGES = {
  AUTH: {
    USERNAME_REQUIRED: "Username is required",
    PASSWORD_REQUIRED: "Password is required",
    USERNAME_TAKEN: "Username already taken. Try another",
    BAD_CREDENTIALS: "Bad credentials",
  },
  ENVELOPES: {
    CURRENT_AMOUNT_REQUIRED:
      "current_amount is required and must be a positive float number",
    NAME_REQUIRED: "name is required and must be a string",
    NAME_TYPE: "Name must be a string",
    ENVELOPE_LIMIT_REQUIRED:
      "envelope_limit is required and must be a positive float number",
    ENVELOPE_LIMIT_TYPE: "envelope_limit must be a positive float number",
    CREATION_SUCCESSFUL: "Envelope created successfully",
    AMOUNT_GREATER_THAN_LIMIT:
      "The envelope's amount cannot exceed its limit nor the limit can be lower than the envelope's actual amount",
  },
  TRANSACTIONS: {
    CREATION_SUCCESSFUL: "Transaction created successfully",
  },
  VALIDATION: {
    INCLUDE_VALID_BODY: "Include a valid body in the request",
  },
  AMOUNT_REQUIRED: "amount is required and must be a positive float number",
  PATH_ID_MUST_BE_INT: "id path variable must be an integer",
  QUERY_ID_MUST_BE_INT: "id query parameter must be an integer",
}
