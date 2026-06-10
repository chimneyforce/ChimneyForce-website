import { useState, useEffect } from 'react';
import { Star, Trash2, CreditCard as Edit2 } from 'lucide-react';
import { supabase, type Review } from '../lib/supabase';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    rating: 5,
    review_text: '',
    location: '',
    service_type: '',
    is_featured: true,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);

    if (!supabase) {
      console.error('Supabase client not initialized');
      alert('Database connection not available. Please check your configuration.');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .rpc('admin_get_reviews');

    if (error) {
      console.error('Error fetching reviews:', error);
      alert('Failed to load reviews. Please try again.');
    } else {
      setReviews(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase) {
      alert('Database connection not available. Please check your configuration.');
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from('reviews')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingId);

      if (error) {
        console.error('Error updating review:', error);
        alert('Failed to update review. Please try again.');
        return;
      }

      setEditingId(null);
    } else {
      const { error } = await supabase
        .from('reviews')
        .insert([formData]);

      if (error) {
        console.error('Error adding review:', error);
        alert('Failed to add review. Please try again.');
        return;
      }
    }

    setFormData({
      customer_name: '',
      rating: 5,
      review_text: '',
      location: '',
      service_type: '',
      is_featured: true,
    });

    fetchReviews();
  };

  const handleEdit = (review: Review) => {
    setEditingId(review.id);
    setFormData({
      customer_name: review.customer_name,
      rating: review.rating,
      review_text: review.review_text,
      location: review.location || '',
      service_type: review.service_type || '',
      is_featured: review.is_featured,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    if (!supabase) {
      alert('Database connection not available. Please check your configuration.');
      return;
    }

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
      return;
    }

    fetchReviews();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      customer_name: '',
      rating: 5,
      review_text: '',
      location: '',
      service_type: '',
      is_featured: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Manage Reviews
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
            {editingId ? 'Edit Review' : 'Add New Review'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="customer_name" className="block text-base font-medium text-gray-700 mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                id="customer_name"
                required
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                className="w-full min-h-[56px] px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent text-base"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label htmlFor="rating" className="block text-base font-medium text-gray-700 mb-2">
                Rating *
              </label>
              <select
                id="rating"
                required
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                className="w-full min-h-[56px] px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent text-base"
              >
                <option value={5}>5 Stars - Excellent</option>
                <option value={4}>4 Stars - Very Good</option>
                <option value={3}>3 Stars - Good</option>
                <option value={2}>2 Stars - Fair</option>
                <option value={1}>1 Star - Poor</option>
              </select>
            </div>

            <div>
              <label htmlFor="review_text" className="block text-base font-medium text-gray-700 mb-2">
                Review Text *
              </label>
              <textarea
                id="review_text"
                required
                value={formData.review_text}
                onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent text-base resize-none"
                placeholder="The service was excellent..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-base font-medium text-gray-700 mb-2">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full min-h-[56px] px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent text-base"
                  placeholder="New York, NY"
                />
              </div>

              <div>
                <label htmlFor="service_type" className="block text-base font-medium text-gray-700 mb-2">
                  Service Type (Optional)
                </label>
                <input
                  type="text"
                  id="service_type"
                  value={formData.service_type}
                  onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                  className="w-full min-h-[56px] px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent text-base"
                  placeholder="Chimney Sweep"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500"
              />
              <label htmlFor="is_featured" className="text-base font-medium text-gray-700">
                Show in homepage carousel
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 min-h-[56px] bg-red-600 text-white px-6 rounded-lg hover:bg-red-700 transition-colors font-semibold text-base active:scale-95"
              >
                {editingId ? 'Update Review' : 'Add Review'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="min-h-[56px] min-w-[56px] bg-gray-200 text-gray-700 px-6 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-base active:scale-95"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
            Existing Reviews ({reviews.length})
          </h2>

          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No reviews yet. Add your first review above!
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-gray-200 rounded-lg p-4 md:p-6 hover:border-gray-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-gray-900 text-base md:text-lg">
                          {review.customer_name}
                        </h3>
                        {review.is_featured && (
                          <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      {(review.location || review.service_type) && (
                        <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
                          {review.location && <span>📍 {review.location}</span>}
                          {review.service_type && <span>🔧 {review.service_type}</span>}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 sm:flex-shrink-0">
                      <button
                        onClick={() => handleEdit(review)}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors active:scale-95"
                        aria-label="Edit review"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors active:scale-95"
                        aria-label="Delete review"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed">
                    {review.review_text}
                  </p>
                  <p className="text-sm text-gray-500 mt-3">
                    Added {new Date(review.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
