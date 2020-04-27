
export const AirportMeta = {
  type: "Microsoft.OData.SampleService.Models.TripPin.Airport",
  set: "Airports",
  fields: {
    IcaoCode: {type: 'string', key: true, ref: 'IcaoCode', nullable: false},
    Name: {type: 'string', nullable: false},
    IataCode: {type: 'string', nullable: false}
  }
};