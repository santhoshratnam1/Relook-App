import React from 'react';
import { ProductData } from '../types';
import InfoRow from './InfoRow';

interface ProductViewProps {
  product: ProductData;
}

const ProductView: React.FC<ProductViewProps> = ({ product }) => {
  return (
    <dl>
        <InfoRow label="Product" value={product.name} icon="🏷️" />
        <InfoRow label="Category" value={product.category} icon="📦" />
        <InfoRow label="Price" value={product.price} icon="💲" />
        <InfoRow label="Version" value={product.version} icon="✨" />
        <InfoRow label="Release Date" value={product.releaseDate} icon="📅" />
        <InfoRow label="Warranty" value={product.warranty} icon="🛡️" />
        <InfoRow 
            label="Key Features" 
            value={
                product.keyFeatures && product.keyFeatures.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                        {product.keyFeatures.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                ) : undefined
            }
            icon="📝"
        />
        <InfoRow 
            label="Available On" 
            value={product.availableOn && product.availableOn.join(', ')} 
            icon="🛒" 
        />
    </dl>
  );
};

export default ProductView;
