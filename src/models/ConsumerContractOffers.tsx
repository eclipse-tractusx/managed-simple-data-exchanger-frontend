export interface IUsageControl {
  type: string;
  typeOfAccess: string;
  value?: string;
}

export interface IConsumerDataOffers {
  connectorOfferid: string;
  connectorOfferUrl: string;
  title: string;
  version: string;
  description: string;
  created: string;
  modified: string;
  publisher: string;
  offerInfo: string;
  typeOfAccess: string;
  bpnNumbers: string[];
  contractInfo: string;
  usagePolicies: IUsageControl[];
  fileName?: string;
  fileContentType?: string;
}
