import { Link } from "@/i18n/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
  translations: {
    previous: string;
    next: string;
    page: string;
    of: string;
  };
}

export function Pagination({
  currentPage,
  totalPages,
  searchParams,
  translations,
}: PaginationProps) {
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== "page") {
        params.set(key, value);
      }
    });
    params.set("page", page.toString());
    return `/properties?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-4">
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="px-4 py-2 rounded-lg border border-gray-300 text-spotDark hover:bg-gray-50 transition-colors"
        >
          {translations.previous}
        </Link>
      ) : (
        <span className="px-4 py-2 rounded-lg border border-gray-200 text-gray-400 cursor-not-allowed">
          {translations.previous}
        </span>
      )}

      <span className="text-sm text-gray-600">
        {translations.page} {currentPage} {translations.of} {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="px-4 py-2 rounded-lg border border-gray-300 text-spotDark hover:bg-gray-50 transition-colors"
        >
          {translations.next}
        </Link>
      ) : (
        <span className="px-4 py-2 rounded-lg border border-gray-200 text-gray-400 cursor-not-allowed">
          {translations.next}
        </span>
      )}
    </div>
  );
}
