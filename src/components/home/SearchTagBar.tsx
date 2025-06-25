import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchTagBarProps {
  tags: string[];
}

const SearchTagBar: React.FC<SearchTagBarProps> = ({ tags }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const router = useRouter();

  const handleSearch = () => {
    const queryParams: Record<string, string> = {};
    if (searchQuery) queryParams.q = searchQuery;
    if (selectedTag) queryParams.tag = selectedTag;

    const queryString = new URLSearchParams(queryParams).toString();
    router.push(`/search?${queryString}`);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    setSearchQuery(""); // Clear free text when a tag is selected
    handleSearch();
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`px-3 py-1 rounded-full border border-gray-300 ${
              selectedTag === tag ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
            } hover:bg-blue-200`}
          >
            {tag}
          </button>
        ))}
      </div>

      {selectedTag && (
        <div className="mt-2 text-sm text-gray-600">
          Selected Tag: <span className="font-medium">{selectedTag}</span>
        </div>
      )}
    </div>
  );
};

export default SearchTagBar;

// Usage example in a page:
// import SearchComponent from "../components/SearchComponent";

// const tags = ["Technology", "Health", "Education", "Finance", "Travel"];

// const SearchPage = () => {
//   return (
//     <div>
//       <SearchComponent tags={tags} />
//     </div>
//   );
// };

// export default SearchPage;
