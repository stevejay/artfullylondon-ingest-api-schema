const Ajv = require("ajv");
const schema = require("../schema/feed-error.json");

const createValidateFunc = () => {
  const ajv = new Ajv({ allErrors: true });
  return ajv.compile(schema);
};

const buildFeedError = (customizations = {}) => ({
  entity: "venue",
  venueId: "venue-id",
  venueEntityId: "venue-entity-id",
  error: "the error",
  stacktrace: "the stacktrace",
  ...customizations
});

it("should be a valid schema", () => {
  createValidateFunc();
});

const VALID_FEED_ERRORS = {
  "venue feed error": buildFeedError(),
  "event feed error": buildFeedError({ entity: "event" }),
  "feed error with no URL": buildFeedError({ url: undefined }),
  "feed error with URL": buildFeedError({ url: "http://test.com" })
};

Object.keys(VALID_FEED_ERRORS).forEach(key => {
  it(`should validate ${key}`, () => {
    const entity = VALID_FEED_ERRORS[key];
    const validate = createValidateFunc();
    const valid = validate(entity);
    expect(valid).toBeTruthy();
  });
});

const INVALID_FEED_ERRORS = {
  "no entity value": buildFeedError({ entity: undefined }),
  "empty entity value": buildFeedError({ entity: "" }),
  "wrong entity value": buildFeedError({ entity: "invalid" }),
  "no venue ID": buildFeedError({ venueId: null }),
  "empty venue ID": buildFeedError({ venueId: "" }),
  "no venue entity ID": buildFeedError({ venueEntityId: undefined }),
  "empty venue entity ID": buildFeedError({ venueEntityId: "" }),
  "no error": buildFeedError({ error: undefined }),
  "empty error": buildFeedError({ error: "" }),
  "no stacktrace": buildFeedError({ stacktrace: undefined }),
  "empty stacktrace": buildFeedError({ stacktrace: "" }),
  "empty url": buildFeedError({ url: "" }),
  "invalid url": buildFeedError({ url: "invalid" })
};

Object.keys(INVALID_FEED_ERRORS).forEach(key => {
  it(`should validate ${key}`, () => {
    const entity = INVALID_FEED_ERRORS[key];
    const validate = createValidateFunc();
    const valid = validate(entity);
    expect(valid).toBeFalsy();
  });
});
