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
        <InfoRow label="Brand" value={product.brand} icon="🏢" />
        <InfoRow label="Category" value={product.category} icon="📦" />
        <InfoRow label="Price" value={product.price} icon="💲" />
        <InfoRow label="Version" value={product.version} icon="✨" />
        <InfoRow label="Release Date" value={product.releaseDate} icon="📅" />
        <InfoRow label="Warranty" value={product.warranty} icon="🛡️" />
        <InfoRow label="Dimensions" value={product.dimensions} icon="📏" />
        <InfoRow label="Weight" value={product.weight} icon="⚖️" />
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
            label="Specifications" 
            value={
                product.specifications && product.specifications.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                        {product.specifications.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                ) : undefined
            }
            icon="⚙️"
        />
        <InfoRow 
            label="Available On" 
            value={product.availableOn && product.availableOn.join(', ')} 
            icon="🛒" 
        />
        <InfoRow 
            label="Product Link" 
            value={
                product.productLink ? (
                    <a href={product.productLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                        {product.productLink}
                    </a>
                ) : undefined
            }
            icon="🔗"
        />
    </dl>
  );
};

export default ProductView;