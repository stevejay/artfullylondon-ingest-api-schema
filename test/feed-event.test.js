const Ajv = require("ajv");
const schema = require("../schema/feed-event.json");
const basicTypesSchema = require("../schema/basic-types.json");

const createValidateFunc = () => {
  const ajv = new Ajv({ allErrors: true });
  ajv.addSchema(basicTypesSchema);
  return ajv.compile(schema);
};

const buildExhibition = (customizations = {}) => ({
  entity: "event",
  venueId: "venue-id",
  venueEntityId: "venue-entity-id",
  eventType: "Exhibition",
  url: "http://test.com",
  title: "The Title",
  ageDetails: {
    minAge: 0,
    maxAge: 99
  },
  costDetails: {
    type: "Unknown"
  },
  bookingDetails: {
    type: "Unknown"
  },
  exhibitionDetails: {
    dateFrom: "2018-01-10",
    dateTo: "2018-02-20",
    useVenueOpeningTimes: true,
    hasTimedEntry: true
  },
  rawContent: "the raw content",
  ...customizations
});

const buildPerformance = (customizations = {}) => ({
  entity: "event",
  venueId: "venue-id",
  venueEntityId: "venue-entity-id",
  eventType: "Performance",
  url: "http://test.com",
  title: "The Title",
  ageDetails: {
    minAge: 0,
    maxAge: 99
  },
  costDetails: {
    type: "Unknown"
  },
  bookingDetails: {
    type: "Unknown"
  },
  performanceDetails: {
    isWorkshop: false
  },
  rawContent: "the raw content",
  ...customizations
});

it("should be a valid schema", () => {
  createValidateFunc();
});

const VALID_EXHIBITIONS = {
  valid: buildExhibition(),
  "with summary": buildExhibition({ summary: "The summary" }),
  "unknown cost": buildExhibition({ costDetails: { type: "Unknown" } }),
  free: buildExhibition({ costDetails: { type: "Free" } }),
  "paid with unknown cost": buildExhibition({ costDetails: { type: "Paid" } }),
  "paid with cost": buildExhibition({
    costDetails: { type: "Paid", minCost: 1000, maxCost: 2000 }
  }),
  "unknown booking": buildExhibition({ bookingDetails: { type: "Unknown" } }),
  "booking not required": buildExhibition({
    bookingDetails: { type: "NotRequired" }
  }),
  "booking required with no opening date": buildExhibition({
    bookingDetails: { type: "Required" }
  }),
  "booking required": buildExhibition({
    bookingDetails: { type: "Required", dateBookingOpens: "2018-01-18" }
  }),
  "with images": buildExhibition({ images: ["https://test.com/image.png"] }),
  "with tags": buildExhibition({
    tags: [{ id: "audience/families", label: "families" }]
  }),
  "has day opening rule": buildExhibition({
    exhibitionDetails: {
      dateFrom: "2018-01-10",
      dateTo: "2018-02-20",
      useVenueOpeningTimes: false,
      hasTimedEntry: true,
      openingRules: [
        {
          type: "Day",
          dateForType: "Monday",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ],
      closureRules: []
    }
  }),
  "has day closure opening rule with times": buildExhibition({
    exhibitionDetails: {
      dateFrom: "2018-01-10",
      dateTo: "2018-02-20",
      useVenueOpeningTimes: false,
      hasTimedEntry: true,
      openingRules: [
        {
          type: "Day",
          dateForType: "Monday",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ],
      closureRules: [
        {
          type: "Day",
          dateForType: "Tuesday",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ]
    }
  }),
  "has day closure opening rule without times": buildExhibition({
    exhibitionDetails: {
      dateFrom: "2018-01-10",
      dateTo: "2018-02-20",
      useVenueOpeningTimes: false,
      hasTimedEntry: true,
      openingRules: [
        {
          type: "Day",
          dateForType: "Monday",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ],
      closureRules: [
        {
          type: "Day",
          dateForType: "Tuesday"
        }
      ]
    }
  }),
  "has date opening rule": buildExhibition({
    exhibitionDetails: {
      dateFrom: "2018-01-10",
      dateTo: "2018-02-20",
      useVenueOpeningTimes: false,
      hasTimedEntry: true,
      openingRules: [
        {
          type: "Date",
          dateForType: "2019-10-22",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ],
      closureRules: []
    }
  }),
  "has date closure rule with times": buildExhibition({
    exhibitionDetails: {
      dateFrom: "2018-01-10",
      dateTo: "2018-02-20",
      useVenueOpeningTimes: false,
      hasTimedEntry: true,
      openingRules: [
        {
          type: "Date",
          dateForType: "2019-10-22",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ],
      closureRules: [
        {
          type: "Date",
          dateForType: "2019-10-23",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ]
    }
  }),
  "has date closure rule without times": buildExhibition({
    exhibitionDetails: {
      dateFrom: "2018-01-10",
      dateTo: "2018-02-20",
      useVenueOpeningTimes: false,
      hasTimedEntry: true,
      openingRules: [
        {
          type: "Date",
          dateForType: "2019-10-22",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ],
      closureRules: [
        {
          type: "Date",
          dateForType: "2019-10-23"
        }
      ]
    }
  }),
  "has preset opening rule": buildExhibition({
    exhibitionDetails: {
      dateFrom: "2018-01-10",
      dateTo: "2018-02-20",
      useVenueOpeningTimes: false,
      hasTimedEntry: true,
      openingRules: [
        {
          type: "Preset",
          dateForType: "ChristmasEve",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ],
      closureRules: []
    }
  }),
  "has preset closure rule with times": buildExhibition({
    exhibitionDetails: {
      dateFrom: "2018-01-10",
      dateTo: "2018-02-20",
      useVenueOpeningTimes: false,
      hasTimedEntry: true,
      openingRules: [
        {
          type: "Day",
          dateForType: "Monday",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ],
      closureRules: [
        {
          type: "Preset",
          dateForType: "ChristmasEve",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ]
    }
  }),
  "has preset closure rule without times": buildExhibition({
    exhibitionDetails: {
      dateFrom: "2018-01-10",
      dateTo: "2018-02-20",
      useVenueOpeningTimes: false,
      hasTimedEntry: true,
      openingRules: [
        {
          type: "Day",
          dateForType: "Monday",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ],
      closureRules: [
        {
          type: "Preset",
          dateForType: "ChristmasEve"
        }
      ]
    }
  })
};

const VALID_PERFORMANCES = {
  valid: buildPerformance(),
  "with summary": buildPerformance({ summary: "The summary" }),
  "unknown cost": buildPerformance({ costDetails: { type: "Unknown" } }),
  free: buildPerformance({ costDetails: { type: "Free" } }),
  "paid with unknown cost": buildPerformance({ costDetails: { type: "Paid" } }),
  "paid with cost": buildPerformance({
    costDetails: { type: "Paid", minCost: 1000, maxCost: 2000 }
  }),
  "unknown booking": buildPerformance({ bookingDetails: { type: "Unknown" } }),
  "booking not required": buildPerformance({
    bookingDetails: { type: "NotRequired" }
  }),
  "booking required with no opening date": buildPerformance({
    bookingDetails: { type: "Required" }
  }),
  "booking required": buildPerformance({
    bookingDetails: { type: "Required", dateBookingOpens: "2018-01-18" }
  }),
  "with images": buildPerformance({ images: ["https://test.com/image.png"] }),
  "with tags": buildPerformance({
    tags: [{ id: "audience/families", label: "families" }]
  }),
  "has performances": buildPerformance({
    performanceDetails: {
      isWorkshop: false,
      performances: [
        {
          date: "2019-01-18",
          time: "19:30",
          isSoldOut: false,
          isCancelled: false
        }
      ]
    }
  })
};

describe("valid exhibitions", () => {
  Object.keys(VALID_EXHIBITIONS).forEach(key => {
    it(`should validate ${key}`, () => {
      const entity = VALID_EXHIBITIONS[key];
      const validate = createValidateFunc();
      const valid = validate(entity);
      expect(valid).toBeTruthy();
    });
  });
});

describe("valid performances", () => {
  Object.keys(VALID_PERFORMANCES).forEach(key => {
    it(`should validate ${key}`, () => {
      const entity = VALID_PERFORMANCES[key];
      const validate = createValidateFunc();
      const valid = validate(entity);
      expect(valid).toBeTruthy();
    });
  });
});

const INVALID_EXHIBITIONS = {
  "no entity value": buildExhibition({ entity: undefined }),
  "empty entity value": buildExhibition({ entity: "" }),
  "wrong entity value": buildExhibition({ entity: "venue" }),
  "no venue ID": buildExhibition({ venueId: null }),
  "empty venue ID": buildExhibition({ venueId: "" }),
  "no venue entity ID": buildExhibition({ venueEntityId: undefined }),
  "empty venue entity ID": buildExhibition({ venueEntityId: "" }),
  "no raw content": buildExhibition({ rawContent: undefined }),
  "empty raw content": buildExhibition({ rawContent: "" }),
  "invalid event type": buildExhibition({ eventType: "Invalid" }),
  "no url": buildExhibition({ url: undefined }),
  "empty url value": buildExhibition({ url: "" }),
  "wrong url value": buildExhibition({ url: "venue" }),
  "no title": buildExhibition({ title: undefined }),
  "empty title value": buildExhibition({ title: "" }),
  "empty summary value": buildExhibition({ summary: "" }),
  "no age details": buildExhibition({ ageDetails: undefined }),
  "partial age details": buildExhibition({ ageDetails: { minAge: 10 } }),
  "invalid age details": buildExhibition({
    ageDetails: { minAge: -10, maxAge: 300 }
  }),
  "no cost details": buildExhibition({ costDetails: undefined }),
  "invalid cost details type": buildExhibition({
    costDetails: { type: "Invalid" }
  }),
  "paid with invalid costs": buildExhibition({
    costDetails: { type: "Paid", minCost: -10, maxCost: 100000 }
  }),
  "no booking details": buildExhibition({ bookingDetails: undefined }),
  "invalid booking details type": buildExhibition({
    bookingDetails: { type: "Invalid" }
  }),
  "booking required with invalid date booking opens": buildExhibition({
    bookingDetails: { type: "Required", dateBookingOpens: "invalid" }
  }),
  "empty images": buildExhibition({ images: [] }),
  "invalid image url": buildExhibition({ images: [""] }),
  "empty tags": buildExhibition({ tags: [] }),
  "invalid tag id": buildExhibition({
    tags: [{ id: "invalid", label: "families" }]
  }),
  "invalid tag label": buildExhibition({
    tags: [{ id: "audience/families", label: "" }]
  }),
  "invalid tag": buildExhibition({
    tags: [{}]
  }),
  "missing exhibition details": buildExhibition({
    exhibitionDetails: undefined
  }),
  "empty exhibition details": buildExhibition({
    exhibitionDetails: {}
  }),
  "missing use venue opening times flag": buildExhibition({
    exhibitionDetails: {
      dateFrom: "2018-01-10",
      dateTo: "2018-02-20",
      hasTimedEntry: true
    }
  }),
  "missing has timed entry": buildExhibition({
    exhibitionDetails: {
      dateFrom: "2018-01-10",
      dateTo: "2018-02-20",
      useVenueOpeningTimes: true
    }
  }),
  "missing exhibition date from": buildExhibition({
    exhibitionDetails: {
      dateTo: "2018-02-20",
      useVenueOpeningTimes: true,
      hasTimedEntry: true
    }
  }),
  "missing exhibition date to": buildExhibition({
    exhibitionDetails: {
      dateFrom: "2018-01-10",
      useVenueOpeningTimes: true,
      hasTimedEntry: true
    }
  }),
  "opening rules incorrectly present when using venue opening times": buildExhibition(
    {
      exhibitionDetails: {
        dateFrom: "2018-01-10",
        dateTo: "2018-02-20",
        useVenueOpeningTimes: true,
        hasTimedEntry: true,
        openingRules: [],
        closureRules: []
      }
    }
  ),
  "opening rules not present when not using venue opening times": buildExhibition(
    {
      exhibitionDetails: {
        dateFrom: "2018-01-10",
        dateTo: "2018-02-20",
        useVenueOpeningTimes: false,
        hasTimedEntry: true
      }
    }
  ),
  "empty opening rules": buildExhibition({
    exhibitionDetails: {
      dateFrom: "2018-01-10",
      dateTo: "2018-02-20",
      useVenueOpeningTimes: false,
      hasTimedEntry: true,
      openingRules: [],
      closureRules: []
    }
  }),
  "invalid date from": buildExhibition({
    exhibitionDetails: {
      dateFrom: "Invalid",
      dateTo: "2018-02-20",
      useVenueOpeningTimes: false,
      hasTimedEntry: true,
      openingRules: [
        {
          type: "Day",
          dateForType: "Monday",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ],
      closureRules: []
    }
  }),
  "invalid date type for day opening rule": buildExhibition({
    exhibitionDetails: {
      dateFrom: "2018-01-10",
      dateTo: "2018-02-20",
      useVenueOpeningTimes: false,
      hasTimedEntry: true,
      openingRules: [
        {
          type: "Day",
          dateForType: "Invalid",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ],
      closureRules: []
    }
  }),
  "no times for day opening rule": buildExhibition({
    exhibitionDetails: {
      dateFrom: "2018-01-10",
      dateTo: "2018-02-20",
      useVenueOpeningTimes: false,
      hasTimedEntry: true,
      openingRules: [
        {
          type: "Day",
          dateForType: "Monday"
        }
      ],
      closureRules: []
    }
  }),
  "invalid date type for day closure rule": buildExhibition({
    exhibitionDetails: {
      dateFrom: "2018-01-10",
      dateTo: "2018-02-20",
      useVenueOpeningTimes: false,
      hasTimedEntry: true,
      openingRules: [
        {
          type: "Day",
          dateForType: "Monday",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ],
      closureRules: [
        {
          type: "Day",
          dateForType: "Invalid",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ]
    }
  }),
  "invalid date type for date opening rule": buildExhibition({
    exhibitionDetails: {
      dateFrom: "2018-01-10",
      dateTo: "2018-02-20",
      useVenueOpeningTimes: false,
      hasTimedEntry: true,
      openingRules: [
        {
          type: "Date",
          dateForType: "Invalid",
          timeFrom: "12:00",
          timeTo: "18:00"
        }
      ],
      closureRules: []
    }
  }),
  "no times for date opening rule": buildExhibition({
    exhibitionDetails: {
      dateFrom: "2018-01-10",
      dateTo: "2018-02-20",
      useVenueOpeningTimes: false,
      hasTimedEntry: true,
      openingRules: [
        {
          type: "Date",
          dateForType: "2018-01-18"
        }
      ],
      closureRules: []
    }
  })
};

const INVALID_PERFORMANCES = {
  "missing isWorkshop flag": buildPerformance({
    performanceDetails: {}
  }),
  "invalid performance date": buildPerformance({
    performanceDetails: {
      isWorkshop: false,
      performances: [
        {
          date: "invalid",
          time: "19:30",
          isSoldOut: false,
          isCancelled: false
        }
      ]
    }
  }),
  "missing performance date": buildPerformance({
    performanceDetails: {
      isWorkshop: false,
      performances: [
        {
          time: "19:30",
          isSoldOut: false,
          isCancelled: false
        }
      ]
    }
  }),
  "invalid performance time": buildPerformance({
    performanceDetails: {
      isWorkshop: false,
      performances: [
        {
          date: "2019-01-18",
          time: "invalid",
          isSoldOut: false,
          isCancelled: false
        }
      ]
    }
  }),
  "missing performance time": buildPerformance({
    performanceDetails: {
      isWorkshop: false,
      performances: [
        {
          date: "2019-01-18",
          isSoldOut: false,
          isCancelled: false
        }
      ]
    }
  }),
  "missing performance sold out flag": buildPerformance({
    performanceDetails: {
      isWorkshop: false,
      performances: [
        {
          date: "2019-01-18",
          time: "19:30",
          isCancelled: false
        }
      ]
    }
  }),
  "missing performance cancelled flag": buildPerformance({
    performanceDetails: {
      isWorkshop: false,
      performances: [
        {
          date: "2019-01-18",
          time: "19:30",
          isSoldOut: false
        }
      ]
    }
  })
};

describe("invalid exhibitions", () => {
  Object.keys(INVALID_EXHIBITIONS).forEach(key => {
    it(`should validate ${key}`, () => {
      const entity = INVALID_EXHIBITIONS[key];
      const validate = createValidateFunc();
      const valid = validate(entity);
      expect(valid).toBeFalsy();
    });
  });
});

describe("invalid performances", () => {
  Object.keys(INVALID_PERFORMANCES).forEach(key => {
    it(`should validate ${key}`, () => {
      const entity = INVALID_PERFORMANCES[key];
      const validate = createValidateFunc();
      const valid = validate(entity);
      expect(valid).toBeFalsy();
    });
  });
});
