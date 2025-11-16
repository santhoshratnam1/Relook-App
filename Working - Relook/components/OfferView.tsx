import React from 'react';
import { OfferData } from '../types';
import InfoRow from './InfoRow';

interface OfferViewProps {
  offer: OfferData;
}

const OfferView: React.FC<OfferViewProps> = ({ offer }) => {
  return (
    <dl>
        <InfoRow label="Offer" value={offer.title} icon="🎉" />
        <InfoRow label="Discount" value={offer.discount} icon="💰" />
        <InfoRow label="Coupon Code" value={
            offer.couponCode ? (
                <span className="font-mono bg-gray-700 text-yellow-300 px-2 py-1 rounded">{offer.couponCode}</span>
            ) : undefined
        } icon="🔖" />
        <InfoRow label="Valid Till" value={offer.validTill} icon="⏳" />
        <InfoRow label="Platform" value={offer.platform} icon="🛒" />
        <InfoRow 
            label="Applicable On" 
            value={offer.applicableOn && offer.applicableOn.join(', ')} 
            icon="🏷️" 
        />
        <InfoRow label="Conditions" value={offer.conditions} icon="📜" />
    </dl>
  );
};

export default OfferView;
