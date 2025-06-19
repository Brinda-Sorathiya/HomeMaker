import React from 'react';
import DetailsCard from '../components/cards/DetailsCard';
import Reviews from '../components/insights/reviews';
import Recomendations from '../components/insights/recomendations';
import useProperty from '../context_store/property_store';
import useReview from '../context_store/review_store';

const Insights = () => {
  const { currentInsightProperty, loading, error } = useProperty();
  const { clearReviews } = useReview();

  React.useEffect(() => {
    return () => {
      clearReviews();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-white">Loading property details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  if (!currentInsightProperty) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-gray-400">Property not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A2E] p-8">
      <div className="max-w-7xl mx-auto">
        <DetailsCard property={currentInsightProperty} />
        <div className="mt-8">
          <Recomendations propertyId={currentInsightProperty.apn} />
        </div>
        <Reviews propertyId={currentInsightProperty.apn} />
      </div>
    </div>
  );
};

export default Insights; 