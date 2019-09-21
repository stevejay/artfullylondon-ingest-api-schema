const fs = require("fs");
const readline = require("readline");
const Ajv = require("ajv");
const schema = require("../schema/venue.json");
const basicTypesSchema = require("../schema/basic-types.json");
const rulesTypesSchema = require("../schema/rules-types.json");
const imageTypesSchema = require("../schema/image-types.json");

const createValidateFunc = () => {
  const ajv = new Ajv({ allErrors: true });
  ajv.addSchema(basicTypesSchema);
  ajv.addSchema(rulesTypesSchema);
  ajv.addSchema(imageTypesSchema);
  return ajv.compile(schema);
};

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

async function processLineByLine() {
  const fileStream = fs.createReadStream(
    "./test/ab15c588-18f4-41d4-b310-6be1ef8e3b49"
  );

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const validate = createValidateFunc();

  for await (const line of rl) {
    try {
      const venue = JSON.parse(line);

      const homepageLinks =
        venue.links && venue.links.l
          ? venue.links.l.filter(item => item.m.type.s === "Homepage")
          : [];

      const facebookLinks =
        venue.links && venue.links.l
          ? venue.links.l.filter(item => item.m.type.s === "Facebook")
          : [];

      const result = {
        id: venue.id.s,
        version: 1,
        entityStatus: "Publishable",
        title: venue.name.s,
        address: venue.address.s,
        postcode: venue.postcode.s,
        latitude: parseFloat(venue.latitude.n),
        longitude: parseFloat(venue.longitude.n),
        wheelchairAccess: venue.wheelchairAccessType.s,
        disabledBathroom: venue.disabledBathroomType.s,
        hearingFacilities: venue.hearingFacilitiesType.s
      };

      if (result.id === "finsbury-circus-house") {
        result.url = "https://www.finsburycircushouse.com/";
      } else if (result.id === "south-grounds-royal-hospital-chelsea") {
        result.url = "https://www.chelsea-pensioners.co.uk/";
      } else if (result.id === "window-space") {
        result.url =
          "https://www.whitechapelgallery.org/first-thursdays/galleries/first-thursday-window-space-onepointfiveone/";
      } else {
        result.url =
          homepageLinks.length === 1
            ? homepageLinks[0].m.url.s
            : facebookLinks.length === 1
            ? facebookLinks[0].m.url.s
            : undefined;
      }

      if (venue.description && venue.description.s) {
        result.description = venue.description.s;
      }

      if (venue.email && venue.email.s) {
        result.email = venue.email.s;
      }

      if (venue.telephone && venue.telephone.s) {
        result.telephone = venue.telephone.s;
      }

      if (venue.hasPermanentCollection && venue.hasPermanentCollection.bOOL) {
        result.hasPermanentCollection = venue.hasPermanentCollection.bOOL;
      } else {
        result.hasPermanentCollection = false;
      }

      if (venue.images && venue.images.l && venue.images.l.length) {
        result.images = venue.images.l.map(item => ({
          id: item.m.id.s,
          ratio: parseFloat(item.m.ratio.n)
        }));
      }

      if (
        venue.openingTimes &&
        venue.openingTimes.l &&
        venue.openingTimes.l.length
      ) {
        if (!result.openingRules) {
          result.openingRules = [];
        }

        venue.openingTimes.l.forEach(item => {
          // 0 to 6 === Monday to Sunday
          const dayNumber = parseInt(item.m.day.n, 10);
          const from = item.m.from ? item.m.from.s : undefined;
          const to = item.m.to ? item.m.to.s : undefined;

          const entry = {
            type: "Day",
            dateForType: DAYS[dayNumber]
          };

          if (from) {
            entry.timeFrom = from;
          }

          if (to) {
            entry.timeTo = to;
          }

          //   console.log(JSON.stringify(entry));

          result.openingRules.push(entry);
        });
      }

      //   if (
      //     venue.additionalOpeningTimes &&
      //     venue.additionalOpeningTimes.l &&
      //     venue.additionalOpeningTimes.l.length
      //   ) {
      //     if (!result.openingRules) {
      //       result.openingRules = [];
      //     }

      //     venue.additionalOpeningTimes.l.forEach(item => {
      //       const date = item.m.date.s;
      //       const from = item.m.from ? item.m.from.s : undefined;
      //       const to = item.m.to ? item.m.to.s : undefined;

      //       const entry = {
      //         type: "Date",
      //         dateForType:
      //           date.slice(0, 4) + "-" + date.slice(5, 7) + "-" + date.slice(8)
      //       };

      //       if (from) {
      //         entry.timeFrom = from;
      //       }

      //       if (to) {
      //         entry.timeTo = to;
      //       }

      //       console.log(JSON.stringify(entry));

      //       result.openingRules.push(entry);
      //     });
      //   }

      //   if (
      //     venue.openingTimesClosures &&
      //     venue.openingTimesClosures.l &&
      //     venue.openingTimesClosures.l.length
      //   ) {
      //     if (!result.closingRules) {
      //       result.closingRules = [];
      //     }

      //     venue.openingTimesClosures.l.forEach(item => {
      //       const date = item.m.date.s;
      //       const from = item.m.from ? item.m.from.s : undefined;
      //       const to = item.m.to ? item.m.to.s : undefined;

      //       const entry = {
      //         type: "Date",
      //         dateForType:
      //           date.slice(0, 4) + "-" + date.slice(5, 7) + "-" + date.slice(8)
      //       };

      //       if (from) {
      //         entry.timeFrom = from;
      //       }

      //       if (to) {
      //         entry.timeTo = to;
      //       }

      //       result.closingRules.push(entry);
      //     });
      //   }

      if (
        venue.namedClosures &&
        venue.namedClosures.l &&
        venue.namedClosures.l.length
      ) {
        if (!result.closingRules) {
          result.closingRules = [];
        }

        venue.namedClosures.l.forEach(item => {
          const entry = { type: "Preset", dateForType: item.s };
          result.closingRules.push(entry);
        });
      }

      const valid = validate(result);
      if (!valid) {
        console.error("NOT VALID", JSON.stringify(result));
      }

      //   console.log(JSON.stringify(result));
    } catch {
      console.error("ERROR", line);
    }
  }
}

processLineByLine();
