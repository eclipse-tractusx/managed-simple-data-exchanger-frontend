import { render, screen } from '@testing-library/react';
import OfferDetailsDialog from '../components/OfferDetailsDialog';
import { IConsumerDataOffers } from '../models/ConsumerContractOffers';

test('Snapshot OfferDetailsDialog - load and diaplay offer details component', () => {
  const isOpen = true;
  const offerItem: IConsumerDataOffers = {
    bpnNumbers: ['BPN1', 'BPN2'],
    connectorOfferid: 'connector1',
    connectorOfferUrl: 'http://localhost:8080',
    title: 'Offer title',
    created: '22/07/2022',
    description: 'description',
    publisher: 'name',
    version: '1.0.0',
    contractInfo: 'contract info dummy',
    modified: '22/07/2022',
    offerInfo: 'offer extra info',
    typeOfAccess: 'restricted',
    usagePolicies: [
      {
        type: 'Duration',
        typeOfAccess: 'Unrestricted',
        value: '1',
      },
    ],
  };
  render(<OfferDetailsDialog open={isOpen} offerObj={offerItem} />);
  const text = screen.getByText('Offer Details');
  const titleText = screen.getByText(offerItem.title);
  expect(text).toBeInTheDocument();
  expect(titleText).toBeInTheDocument();
});
