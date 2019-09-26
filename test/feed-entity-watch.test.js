const Ajv = require("ajv");
const schema = require("../schema/feed-entity-watch.json");
const basicTypesSchema = require("../schema/basic-types.json");
const rulesTypesSchema = require("../schema/rules-types.json");

const createValidateFunc = () => {
  const ajv = new Ajv({ allErrors: true });
  ajv.addSchema(basicTypesSchema);
  ajv.addSchema(rulesTypesSchema);
  return ajv.compile(schema);
};

const buildFeedEntityWatch = (customizations = {}) => ({
  feedType: "EntityWatch",
  entity: "venue",
  venueId: "venue-id",
  venueEntityId: "venue-entity-id",
  version: 999,
  url: "https://some-url.com/",
  watchedContent: "the watched content",
  ...customizations
});

it("should be a valid schema", () => {
  createValidateFunc();
});

const VALID_FEED_ENTITY_WATCHES = {
  valid: buildFeedEntityWatch(),
  "with title": buildFeedEntityWatch({ title: "The title" })
};

Object.keys(VALID_FEED_ENTITY_WATCHES).forEach(key => {
  it(`should validate ${key}`, () => {
    const entity = VALID_FEED_ENTITY_WATCHES[key];
    const validate = createValidateFunc();
    const valid = validate(entity);
    expect(valid).toBeTruthy();
  });
});

const INVALID_FEED_ENTITY_WATCHES = {
  "no feed type value": buildFeedEntityWatch({ feedType: undefined }),
  "empty feed type value": buildFeedEntityWatch({ feedType: "" }),
  "wrong feed type value": buildFeedEntityWatch({ feedType: "invalid" }),
  "no entity value": buildFeedEntityWatch({ entity: undefined }),
  "empty entity value": buildFeedEntityWatch({ entity: "" }),
  "invalid entity value": buildFeedEntityWatch({ entity: "invalid" }),
  "no venue ID": buildFeedEntityWatch({ venueId: null }),
  "empty venue ID": buildFeedEntityWatch({ venueId: "" }),
  "invalid venue ID": buildFeedEntityWatch({ venueId: "has/slash" }),
  "no venue entity ID": buildFeedEntityWatch({ venueEntityId: undefined }),
  "empty venue entity ID": buildFeedEntityWatch({ venueEntityId: "" }),
  "invalid venue entity ID": buildFeedEntityWatch({
    venueEntityId: "has/slash"
  }),
  "no url": buildFeedEntityWatch({ url: undefined }),
  "empty url": buildFeedEntityWatch({ url: "" }),
  "empty title": buildFeedEntityWatch({ title: "" }),
  "no watched content": buildFeedEntityWatch({ watchedContent: undefined }),
  "empty watched content": buildFeedEntityWatch({ watchedContent: "" })
};

Object.keys(INVALID_FEED_ENTITY_WATCHES).forEach(key => {
  it(`should validate ${key}`, () => {
    const entity = INVALID_FEED_ENTITY_WATCHES[key];
    const validate = createValidateFunc();
    const valid = validate(entity);
    expect(valid).toBeFalsy();
  });
});
