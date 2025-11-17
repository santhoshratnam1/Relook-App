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
        {offer.description && <p className="text-sm text-gray-400 py-3 px-1">{offer.description}</p>}
        <InfoRow label="Discount" value={offer.discount} icon="💰" />
        <InfoRow label="Offer Type" value={offer.offerType} icon="🏷️" />
        <InfoRow label="Coupon Code" value={
            offer.couponCode ? (
                <span className="font-mono bg-gray-700 text-yellow-300 px-2 py-1 rounded">{offer.couponCode}</span>
            ) : undefined
        } icon="🔖" />
        <InfoRow label="Valid" value={offer.validFrom && offer.validTill ? `${offer.validFrom} to ${offer.validTill}` : offer.validTill} icon="⏳" />
        <InfoRow label="Platform" value={offer.platform} icon="🛒" />
         <InfoRow label="Min. Purchase" value={offer.minPurchase} icon="🛍️" />
        <InfoRow 
            label="Applicable On" 
            value={offer.applicableOn && offer.applicableOn.join(', ')} 
            icon="✅" 
        />
        <InfoRow label="Conditions" value={offer.conditions} icon="📜" />
         <InfoRow 
            label="Offer Link" 
            value={
                offer.offerLink ? (
                    <a href={offer.offerLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                        {offer.offerLink}
                    </a>
                ) : undefined
            }
            icon="🔗"
        />
    </dl>
  );
};

export default OfferView;