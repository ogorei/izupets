import Image from 'next/image';
import Link from 'next/link';

type Locale = 'en' | 'ja';

interface PostCardProps {
  id: string;
  slug: string;
  title: string;
  description?: string;
  date?: string;
  authorName?: string | null;
  imageURL?: string;
  imageAlt?: string;
  locale: Locale;
  convertDate: (date: string) => string;
  spotType?: string;
  tags?: string[];
}

// Helper function to trim text and add ellipsis
const trimText = (text: string, maxLength: number) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export default function PostCard({
  id,
  slug,
  title,
  description,
  date,
  authorName,
  imageURL,
  imageAlt = 'Post image',
  locale,
  convertDate,
  spotType,
  tags,
}: PostCardProps) {
  const trimmedDescription = trimText(description || '', 100);

  return (
    <Link
      key={id}
      href={`/${locale}/posts/${slug}`}
      className="block bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      {imageURL && (
        <Image
          src={imageURL}
          alt={imageAlt}
          width={500}
          height={300}
          className="w-full h-48 object-cover"
          priority
        />
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          {spotType && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {spotType}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {trimmedDescription}
        </p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm text-gray-500">
            {date ? convertDate(date) : ''} {date && authorName && '・'} {authorName}
          </p>
          {tags && tags.length > 0 && (
            <div className="flex gap-1">
              {tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="text-xs bg-gray-100 text-gray-600 px-1 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
