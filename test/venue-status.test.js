const Ajv = require("ajv");
const schema = require("../schema/venue-status.json");
const basicTypesSchema = require("../schema/basic-types.json");

const createValidateFunc = () => {
  const ajv = new Ajv({ allErrors: true });
  ajv.addSchema(basicTypesSchema);
  return ajv.compile(schema);
};

const buildVenueStatus = (customizations = {}) => ({
  id: "venue-id",
  version: 999,
  currentVenueEventIds: [],
  ...customizations
});

it("should be a valid schema", () => {
  createValidateFunc();
});

const VALID_VENUE_STATUSES = {
  valid: buildVenueStatus(),
  "with venue event ids": buildVenueStatus({
    currentVenueEventIds: ["venue-event-id"]
  })
};

Object.keys(VALID_VENUE_STATUSES).forEach(key => {
  it(`should validate ${key}`, () => {
    const entity = VALID_VENUE_STATUSES[key];
    const validate = createValidateFunc();
    const valid = validate(entity);
    expect(valid).toBeTruthy();
  });
});

const INVALID_VENUE_STATUSES = {
  "no venue ID": buildVenueStatus({ id: null }),
  "empty venue ID": buildVenueStatus({ id: "" }),
  "invalid venue ID": buildVenueStatus({ id: "has/slash" }),
  "no version": buildVenueStatus({ version: undefined }),
  "zero version": buildVenueStatus({ version: 0 }),
  "invalid version": buildVenueStatus({ version: "Invalid" }),
  "no current venue event ids": buildVenueStatus({
    currentVenueEventIds: undefined
  }),
  "current venue event id with invalid value": buildVenueStatus({
    currentVenueEventIds: ["has/slash"]
  })
};

Object.keys(INVALID_VENUE_STATUSES).forEach(key => {
  it(`should validate ${key}`, () => {
    const entity = INVALID_VENUE_STATUSES[key];
    const validate = createValidateFunc();
    const valid = validate(entity);
    expect(valid).toBeFalsy();
  });
});
