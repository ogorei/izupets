import LoadingSpinner from '@/components/LoadingSpinner';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    </div>
  );
} 