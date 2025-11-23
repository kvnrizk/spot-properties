import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/page-header";
import { SearchInput } from "@/components/admin/search-input";
import { Pagination } from "@/components/admin/pagination";
import { PropertyActions } from "@/components/admin/property-actions";
import { Plus } from "lucide-react";

const ITEMS_PER_PAGE = 10;

interface PropertiesPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const currentPage = Number(params.page) || 1;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { city: { contains: search, mode: "insensitive" as const } },
          { country: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [properties, totalCount] = await Promise.all([
    prisma.property.findMany({
      where,
      include: { images: true },
      orderBy: { createdAt: "desc" },
      take: ITEMS_PER_PAGE,
      skip,
    }),
    prisma.property.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div>
      <PageHeader
        title="Properties"
        description={`Manage your property listings (${totalCount} total)`}
        actions={
          <Link href="/admin/properties/new">
            <Button className="bg-spot-red hover:bg-spot-red/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add New Property
            </Button>
          </Link>
        }
      />

      <div className="mb-4">
        <SearchInput placeholder="Search by title, city, or country..." />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Published
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {properties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className="text-gray-500">
                      {search
                        ? "No properties found matching your search"
                        : "No properties yet. Create your first property!"}
                    </p>
                  </td>
                </tr>
              ) : (
                properties.map((property) => {
                  const primaryImage = property.images.find(
                    (img) => img.isPrimary
                  );
                  const statusDisplay = property.status.replace("_", " ");
                  const typeDisplay = property.type.replace("_", " ");

                  return (
                    <tr
                      key={property.id}
                      className={`hover:bg-gray-50 ${
                        !property.isPublished ? "bg-yellow-50/30" : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {primaryImage ? (
                          <div className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200">
                            <Image
                              src={primaryImage.url}
                              alt={property.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-spot-dark">
                          {property.title}
                        </div>
                        <div className="text-xs text-gray-400">
                          {typeDisplay}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {property.city}, {property.country}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-spot-dark">
                          ${property.price.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            property.status === "FOR_SALE"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {statusDisplay}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            property.isPublished
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {property.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <PropertyActions
                          propertyId={property.id}
                          propertyTitle={property.title}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}
