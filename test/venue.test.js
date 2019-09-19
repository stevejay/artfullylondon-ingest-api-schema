const Ajv = require("ajv");
const schema = require("../schema/venue.json");
const basicTypesSchema = require("../schema/basic-types.json");
const rulesTypesSchema = require("../schema/rules-types.json");

const createValidateFunc = () => {
  const ajv = new Ajv({ allErrors: true });
  ajv.addSchema(basicTypesSchema);
  ajv.addSchema(rulesTypesSchema);
  return ajv.compile(schema);
};

const buildVenue = (customizations = {}) => ({
  id: "venue-id",
  version: 999,
  entityStatus: "Publishable",
  title: "The Title",
  url: "http://example.com/url",
  address: "The Street\nThe Town",
  postcode: "NE26 4NN",
  latitude: 51,
  longitude: 0.2,
  wheelchairAccess: "FullAccess",
  disabledBathroom: "Present",
  hearingFacilities: "HearingLoops",
  openingRules: [
    {
      type: "Day",
      dateForType: "Monday",
      timeFrom: "12:00",
      timeTo: "18:00"
    }
  ],
  closingRules: [],
  hasPermanentCollection: true,
  rawContent: "The raw content",
  ...customizations
});

it("should be a valid schema", () => {
  createValidateFunc();
});

const VALID_VENUES = {
  valid: buildVenue(),
  "with description": buildVenue({ description: "The description" }),
  "with description and credit": buildVenue({
    description: "The description",
    descriptionCredit: "The credit"
  }),
  "with email": buildVenue({ email: "foo@foo.com" }),
  "with telephone": buildVenue({ telephone: "07930427752" }),
  "with images": buildVenue({ images: ["https://test.com/image.png"] }),
  "with old raw content": buildVenue({ oldRawContent: "Old raw content" })
};

Object.keys(VALID_VENUES).forEach(key => {
  it(`should validate ${key}`, () => {
    const entity = VALID_VENUES[key];
    const validate = createValidateFunc();
    const valid = validate(entity);
    expect(valid).toBeTruthy();
  });
});

const INVALID_VENUES = {
  "no venue ID": buildVenue({ id: undefined }),
  "empty venue ID": buildVenue({ id: "" }),
  "invalid venue ID": buildVenue({ id: "has/slash" }),
  "no version": buildVenue({ version: undefined }),
  "zero version": buildVenue({ version: 0 }),
  "invalid version": buildVenue({ version: "Invalid" }),
  "no entity status": buildVenue({ entityStatus: undefined }),
  "empty entity status": buildVenue({ entityStatus: "" }),
  "invalid entity status": buildVenue({ entityStatus: "Invalid" }),
  "no url": buildVenue({ url: undefined }),
  "empty url value": buildVenue({ url: "" }),
  "wrong url value": buildVenue({ url: "venue" }),
  "no title": buildVenue({ title: undefined }),
  "empty title value": buildVenue({ title: "" }),
  "empty description": buildVenue({ description: "" }),
  "empty description credit": buildVenue({ descriptionCredit: "" }),
  "no address": buildVenue({ address: undefined }),
  "empty address": buildVenue({ address: "" }),
  "no postcode": buildVenue({ postcode: undefined }),
  "empty postcode": buildVenue({ postcode: "" }),
  "invalid postcode": buildVenue({ postcode: "Invalid" }),
  "no latitude": buildVenue({ latitude: undefined }),
  "invalid latitude": buildVenue({ latitude: 999 }),
  "no longitude": buildVenue({ longitude: undefined }),
  "invalid longitude": buildVenue({ longitude: 999 }),
  "empty email": buildVenue({ email: "" }),
  "invalid email": buildVenue({ email: "Invalid" }),
  "empty telephone": buildVenue({ telephone: "" }),
  "no wheelchairAccess value": buildVenue({ wheelchairAccess: undefined }),
  "empty wheelchairAccess value": buildVenue({ wheelchairAccess: "" }),
  "invalid wheelchairAccess value": buildVenue({ wheelchairAccess: "Invalid" }),
  "no hearingFacilities value": buildVenue({ hearingFacilities: undefined }),
  "empty hearingFacilities value": buildVenue({ hearingFacilities: "" }),
  "invalid hearingFacilities value": buildVenue({
    hearingFacilities: "Invalid"
  }),
  "no disabledBathroom value": buildVenue({ disabledBathroom: undefined }),
  "empty disabledBathroom value": buildVenue({ disabledBathroom: "" }),
  "invalid disabledBathroom value": buildVenue({ disabledBathroom: "Invalid" }),
  "no hasPermanentCollection value": buildVenue({
    hasPermanentCollection: undefined
  }),
  "invalid hasPermanentCollection value": buildVenue({
    hasPermanentCollection: "Invalid"
  }),
  "empty images": buildVenue({ images: [] }),
  "invalid image url": buildVenue({ images: ["Invalid"] }),
  "no raw content": buildVenue({ rawContent: undefined }),
  "empty raw content": buildVenue({ rawContent: "" }),
  "empty old raw content": buildVenue({ oldRawContent: "" }),
  "empty opening rules": buildVenue({
    openingRules: []
  }),
  "invalid date type for day opening rule": buildVenue({
    openingRules: [
      {
        type: "Day",
        dateForType: "Invalid",
        timeFrom: "12:00",
        timeTo: "18:00"
      }
    ]
  }),
  "no times for day opening rule": buildVenue({
    openingRules: [
      {
        type: "Day",
        dateForType: "Monday"
      }
    ]
  }),
  "invalid date type for day closure rule": buildVenue({
    openingRules: [
      {
        type: "Day",
        dateForType: "Monday",
        timeFrom: "12:00",
        timeTo: "18:00"
      }
    ],
    closingRules: [
      {
        type: "Day",
        dateForType: "Invalid",
        timeFrom: "12:00",
        timeTo: "18:00"
      }
    ]
  }),
  "invalid date type for date opening rule": buildVenue({
    openingRules: [
      {
        type: "Date",
        dateForType: "Invalid",
        timeFrom: "12:00",
        timeTo: "18:00"
      }
    ]
  }),
  "no times for date opening rule": buildVenue({
    openingRules: [
      {
        type: "Date",
        dateForType: "2018-01-18"
      }
    ],
    closingRules: []
  })
};

Object.keys(INVALID_VENUES).forEach(key => {
  it(`should validate ${key}`, () => {
    const entity = INVALID_VENUES[key];
    const validate = createValidateFunc();
    const valid = validate(entity);
    expect(valid).toBeFalsy();
  });
});
