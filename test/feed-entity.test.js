const Ajv = require("ajv");
const schema = require("../schema/feed-entity.json");
const basicTypesSchema = require("../schema/basic-types.json");

const createValidateFunc = () => {
  const ajv = new Ajv({ allErrors: true });
  ajv.addSchema(basicTypesSchema);
  return ajv.compile(schema);
};

const buildFeedEntity = (customizations = {}) => ({
  entity: "venue",
  venueId: "venue-id",
  venueEntityId: "venue-entity-id",
  version: 999,
  ...customizations
});

it("should be a valid schema", () => {
  createValidateFunc();
});

const VALID_FEED_ENTITIES = {
  "venue feed entity": buildFeedEntity(),
  "event feed entity": buildFeedEntity({ entity: "event" }),
  "feed entity with no URL": buildFeedEntity({ url: undefined }),
  "feed entity with URL": buildFeedEntity({ url: "http://test.com" }),
  "feed entity with error": buildFeedEntity({
    error: "the error",
    stacktrace: "the stacktrace"
  })
};

Object.keys(VALID_FEED_ENTITIES).forEach(key => {
  it(`should validate ${key}`, () => {
    const entity = VALID_FEED_ENTITIES[key];
    const validate = createValidateFunc();
    const valid = validate(entity);
    expect(valid).toBeTruthy();
  });
});

const INVALID_FEED_ENTITIES = {
  "no entity value": buildFeedEntity({ entity: undefined }),
  "empty entity value": buildFeedEntity({ entity: "" }),
  "wrong entity value": buildFeedEntity({ entity: "invalid" }),
  "no venue ID": buildFeedEntity({ venueId: null }),
  "empty venue ID": buildFeedEntity({ venueId: "" }),
  "invalid venue ID": buildFeedEntity({ venueId: "has/slash" }),
  "no venue entity ID": buildFeedEntity({ venueEntityId: undefined }),
  "empty venue entity ID": buildFeedEntity({ venueEntityId: "" }),
  "invalid venue entity ID": buildFeedEntity({ venueEntityId: "has/slash" }),
  "empty error": buildFeedEntity({ error: "" }),
  "empty stacktrace": buildFeedEntity({ stacktrace: "" }),
  "empty url": buildFeedEntity({ url: "" }),
  "invalid url": buildFeedEntity({ url: "invalid" })
};

Object.keys(INVALID_FEED_ENTITIES).forEach(key => {
  it(`should validate ${key}`, () => {
    const entity = INVALID_FEED_ENTITIES[key];
    const validate = createValidateFunc();
    const valid = validate(entity);
    expect(valid).toBeFalsy();
  });
});
