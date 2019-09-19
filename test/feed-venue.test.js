const Ajv = require("ajv");
const schema = require("../schema/feed-venue.json");
const basicTypesSchema = require("../schema/basic-types.json");
const rulesTypesSchema = require("../schema/rules-types.json");

const createValidateFunc = () => {
  const ajv = new Ajv({ allErrors: true });
  ajv.addSchema(basicTypesSchema);
  ajv.addSchema(rulesTypesSchema);
  return ajv.compile(schema);
};

const buildFeedVenue = (customizations = {}) => ({
  entity: "venue",
  venueId: "venue-id",
  venueEntityId: "venue-entity-id",
  version: 999,
  rawContent: "the raw content",
  ...customizations
});

it("should be a valid schema", () => {
  createValidateFunc();
});

const VALID_FEED_VENUES = {
  valid: buildFeedVenue()
};

Object.keys(VALID_FEED_VENUES).forEach(key => {
  it(`should validate ${key}`, () => {
    const entity = VALID_FEED_VENUES[key];
    const validate = createValidateFunc();
    const valid = validate(entity);
    expect(valid).toBeTruthy();
  });
});

const INVALID_FEED_VENUES = {
  "no entity value": buildFeedVenue({ entity: undefined }),
  "empty entity value": buildFeedVenue({ entity: "" }),
  "wrong entity value": buildFeedVenue({ entity: "event" }),
  "no venue ID": buildFeedVenue({ venueId: null }),
  "empty venue ID": buildFeedVenue({ venueId: "" }),
  "invalid venue ID": buildFeedVenue({ venueId: "has/slash" }),
  "no venue entity ID": buildFeedVenue({ venueEntityId: undefined }),
  "empty venue entity ID": buildFeedVenue({ venueEntityId: "" }),
  "invalid venue entity ID": buildFeedVenue({ venueEntityId: "has/slash" }),
  "no raw content": buildFeedVenue({ rawContent: undefined }),
  "empty raw content": buildFeedVenue({ rawContent: "" })
};

Object.keys(INVALID_FEED_VENUES).forEach(key => {
  it(`should validate ${key}`, () => {
    const entity = INVALID_FEED_VENUES[key];
    const validate = createValidateFunc();
    const valid = validate(entity);
    expect(valid).toBeFalsy();
  });
});
