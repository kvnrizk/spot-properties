"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ImageUploader } from "@/components/properties/image-uploader";
import Image from "next/image";
import { Trash2, Star, ArrowUp, ArrowDown, Save, Check } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { toast } from "sonner";

interface PropertyImage {
  id: string;
  url: string;
  publicId: string;
  isPrimary: boolean;
  order: number;
}

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    country: "Lebanon",
    city: "",
    region: "",
    type: "Apartment",
    status: "For Sale",
    price: "",
    currency: "USD",
    area: "",
    bedrooms: "",
    bathrooms: "",
    description: "",
    featured: false,
    published: false,
  });
  const [autoSaved, setAutoSaved] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Get localStorage key for this property
  const getLocalStorageKey = () => `property_draft_${propertyId}`;

  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  // Convert database format to form format
  const dbToFormType = (dbType: string): string => {
    const typeMap: { [key: string]: string } = {
      "APARTMENT": "Apartment",
      "HOUSE": "House",
      "VILLA": "Villa",
      "LAND": "Land",
      "OFFICE": "Office",
      "AIRBNB": "Airbnb",
      "OTHER": "Other"
    };
    return typeMap[dbType] || "Apartment";
  };

  const dbToFormStatus = (dbStatus: string): string => {
    return dbStatus === "FOR_SALE" ? "For Sale" : "For Rent";
  };

  // Format number with thousand separators
  const formatNumber = (num: string): string => {
    const cleanNum = num.replace(/\s/g, "");
    if (!cleanNum || isNaN(Number(cleanNum))) return num;
    return Number(cleanNum).toLocaleString("en-US").replace(/,/g, " ");
  };

  // Remove formatting for submission
  const unformatNumber = (num: string): string => {
    return num.replace(/\s/g, "");
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "");
    if (value === "" || /^\d+$/.test(value)) {
      setFormData({ ...formData, price: formatNumber(value) });
    }
  };

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${propertyId}`);
      if (response.ok) {
        const property = await response.json();

        const fetchedData = {
          title: property.title || "",
          country: property.country || "Lebanon",
          city: property.city || "",
          region: property.region || "",
          type: dbToFormType(property.type),
          status: dbToFormStatus(property.status),
          price: property.price ? formatNumber(property.price.toString()) : "",
          currency: property.currency || "USD",
          area: property.area?.toString() || "",
          bedrooms: property.bedrooms?.toString() || "",
          bathrooms: property.bathrooms?.toString() || "",
          description: property.description || "",
          featured: property.isFeatured || false,
          published: property.isPublished || false,
        };

        // Check if there's a saved draft in localStorage
        const savedDraft = localStorage.getItem(getLocalStorageKey());
        if (savedDraft) {
          try {
            const draftData = JSON.parse(savedDraft);
            // Ask user if they want to restore the draft
            if (confirm("You have unsaved changes. Do you want to restore them?")) {
              setFormData(draftData);
              toast.info("Draft restored");
            } else {
              setFormData(fetchedData);
              localStorage.removeItem(getLocalStorageKey());
            }
          } catch (e) {
            setFormData(fetchedData);
          }
        } else {
          setFormData(fetchedData);
        }

        if (property.images) {
          setImages(property.images.sort((a: PropertyImage, b: PropertyImage) => a.order - b.order));
        }
      }
    } catch (error) {
      console.error("Error fetching property:", error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-save to localStorage with debouncing
  useEffect(() => {
    if (loading) return; // Don't save during initial load

    // Clear any existing timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    // Set new timeout to save after 1 second of no changes
    const timeout = setTimeout(() => {
      localStorage.setItem(getLocalStorageKey(), JSON.stringify(formData));
      setAutoSaved(true);

      // Hide the "saved" indicator after 2 seconds
      setTimeout(() => setAutoSaved(false), 2000);
    }, 1000);

    setSaveTimeout(timeout);

    // Cleanup on unmount
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [formData, loading]);

  const handleImageUpload = async (image: { url: string; publicId: string }) => {
    try {
      const response = await fetch(`/api/properties/${propertyId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: image.url, publicId: image.publicId }),
      });

      if (response.ok) {
        const newImage = await response.json();
        setImages((prev) => [...prev, newImage]);
      }
    } catch (error) {
      console.error("Error adding image:", error);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const response = await fetch(
        `/api/properties/${propertyId}/images?imageId=${imageId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setImages((prev) => prev.filter((img) => img.id !== imageId));
        toast.success("Image deleted successfully");
      } else {
        toast.error("Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    try {
      const response = await fetch(`/api/properties/${propertyId}/images`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId, action: "setPrimary" }),
      });

      if (response.ok) {
        setImages((prev) =>
          prev.map((img) => ({
            ...img,
            isPrimary: img.id === imageId,
          }))
        );
      }
    } catch (error) {
      console.error("Error setting primary image:", error);
    }
  };

  const handleReorder = async (imageId: string, direction: "up" | "down") => {
    const currentIndex = images.findIndex((img) => img.id === imageId);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === images.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const newImages = [...images];
    const [movedImage] = newImages.splice(currentIndex, 1);
    newImages.splice(newIndex, 0, movedImage);

    const updatedImages = newImages.map((img, index) => ({
      ...img,
      order: index,
    }));

    setImages(updatedImages);

    try {
      await fetch(`/api/properties/${propertyId}/images`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageId: movedImage.id,
          action: "updateOrder",
          newOrder: newIndex,
        }),
      });
    } catch (error) {
      console.error("Error reordering image:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      description: formData.description || null,
      type: formData.type.toUpperCase().replace(" ", "_"),
      status: formData.status.toUpperCase().replace(" ", "_"),
      price: parseFloat(unformatNumber(formData.price)),
      currency: formData.currency,
      country: formData.country,
      city: formData.city,
      region: formData.region || null,
      area: formData.area ? parseFloat(formData.area) : null,
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
      isFeatured: formData.featured,
      isPublished: formData.published,
    };

    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Clear the draft from localStorage after successful save
        localStorage.removeItem(getLocalStorageKey());
        toast.success("Property updated successfully");
        router.push("/admin/properties");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update property");
      }
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("Failed to update property");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Property deleted successfully");
        router.push("/admin/properties");
      } else {
        toast.error("Failed to delete property");
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property");
    }
  };

  if (loading) {
    return <div className="max-w-5xl">Loading...</div>;
  }

  return (
    <div className="max-w-5xl">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Properties", href: "/admin/properties" },
          { label: "Edit Property" },
        ]}
      />
      <div className="flex items-center justify-between">
        <PageHeader
          title="Edit Property"
          description={`Property ID: ${propertyId}`}
        />
        {autoSaved && (
          <div className="flex items-center gap-2 text-green-600 text-sm font-medium bg-green-50 px-3 py-1.5 rounded-md border border-green-200">
            <Check className="h-4 w-4" />
            Draft saved
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-spotDark mb-4">
            Current Images
          </label>
          {images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="relative aspect-square rounded-md overflow-hidden border-2 border-gray-200"
                >
                  <Image
                    src={image.url}
                    alt={`Property image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {image.isPrimary && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                      <Star className="h-3 w-3 fill-white" />
                      Primary
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 right-2 flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleReorder(image.id, "up")}
                      disabled={index === 0}
                      className="flex-1 bg-blue-600 text-white rounded p-1 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ArrowUp className="h-3 w-3 mx-auto" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReorder(image.id, "down")}
                      disabled={index === images.length - 1}
                      className="flex-1 bg-blue-600 text-white rounded p-1 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ArrowDown className="h-3 w-3 mx-auto" />
                    </button>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1">
                    {!image.isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(image.id)}
                        className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-yellow-600"
                        title="Set as primary"
                      >
                        <Star className="h-3 w-3" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(image.id)}
                      className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm mb-4">No images uploaded yet</p>
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium text-spotDark mb-2">
              Upload New Images
            </label>
            <ImageUploader onUpload={handleImageUpload} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-spotDark mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spotRed"
              required
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-spotDark mb-2">
              Country
            </label>
            <select
              id="country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spotRed"
            >
              <option value="Lebanon">Lebanon</option>
              <option value="Cyprus">Cyprus</option>
            </select>
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-spotDark mb-2">
              City
            </label>
            <input
              type="text"
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spotRed"
              required
            />
          </div>

          <div>
            <label htmlFor="region" className="block text-sm font-medium text-spotDark mb-2">
              Region
            </label>
            <input
              type="text"
              id="region"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spotRed"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-spotDark mb-2">
              Type
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spotRed"
            >
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
              <option value="Land">Land</option>
              <option value="Office">Office</option>
              <option value="Airbnb">Airbnb</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-spotDark mb-2">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spotRed"
            >
              <option value="For Sale">For Sale</option>
              <option value="For Rent">For Rent</option>
            </select>
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-spotDark mb-2">
              Currency
            </label>
            <select
              id="currency"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spotRed"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-spotDark mb-2">
              Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                {formData.currency === "USD" ? "$" : "€"}
              </span>
              <input
                type="text"
                id="price"
                value={formData.price}
                onChange={handlePriceChange}
                placeholder="160 000"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spotRed"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="area" className="block text-sm font-medium text-spotDark mb-2">
              Area (sqm)
            </label>
            <input
              type="number"
              id="area"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spotRed"
            />
          </div>

          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-spotDark mb-2">
              Bedrooms
            </label>
            <input
              type="number"
              id="bedrooms"
              value={formData.bedrooms}
              onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spotRed"
            />
          </div>

          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium text-spotDark mb-2">
              Bathrooms
            </label>
            <input
              type="number"
              id="bathrooms"
              value={formData.bathrooms}
              onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spotRed"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-spotDark mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spotRed"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 text-spotRed border-gray-300 rounded focus:ring-spotRed"
            />
            <label htmlFor="featured" className="text-sm font-medium text-spotDark">
              Featured Property
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 text-spotRed border-gray-300 rounded focus:ring-spotRed"
            />
            <label htmlFor="published" className="text-sm font-medium text-spotDark">
              Publish Property
            </label>
          </div>
        </div>

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <Button
            type="button"
            onClick={handleDelete}
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            Delete Property
          </Button>
          <div className="flex gap-4">
            <Link href="/admin/properties">
              <Button type="button" variant="outline" className="border-gray-300">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="default" className="!bg-spotRed hover:!bg-spotRed/90 !text-white">
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
