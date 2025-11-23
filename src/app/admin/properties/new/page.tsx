"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ImageUploader } from "@/components/properties/image-uploader";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { toast } from "sonner";

export default function NewPropertyPage() {
  const router = useRouter();
  const [images, setImages] = useState<Array<{ url: string; publicId: string }>>([]);
  const [formData, setFormData] = useState({
    title: "",
    country: "Lebanon",
    city: "",
    region: "",
    type: "Apartment",
    status: "For Sale",
    price: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    description: "",
    featured: false,
    published: false,
  });

  const handleImageUpload = (image: { url: string; publicId: string }) => {
    setImages((prev) => [...prev, image]);
  };

  const handleImageDelete = (publicId: string) => {
    setImages((prev) => prev.filter((img) => img.publicId !== publicId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const payload = {
      title: formData.title,
      slug,
      description: formData.description || null,
      type: formData.type.toUpperCase().replace(" ", "_"),
      status: formData.status.toUpperCase().replace(" ", "_"),
      price: parseFloat(formData.price),
      currency: "USD",
      country: formData.country,
      city: formData.city,
      region: formData.region || null,
      area: formData.area ? parseFloat(formData.area) : null,
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
      isFeatured: formData.featured,
      isPublished: formData.published,
      images: images.map((img, index) => ({
        url: img.url,
        publicId: img.publicId,
        order: index,
        isPrimary: index === 0,
      })),
    };

    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Property created successfully");
        router.push("/admin/properties");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to create property");
      }
    } catch (error) {
      console.error("Error creating property:", error);
      toast.error("Failed to create property");
    }
  };

  return (
    <div className="max-w-5xl">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Properties", href: "/admin/properties" },
          { label: "Add New Property" },
        ]}
      />
      <PageHeader
        title="Add New Property"
        description="Create a new property listing"
      />

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
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
              placeholder="Enter property title"
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
              placeholder="Enter city"
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
              placeholder="Enter region"
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
            <label htmlFor="price" className="block text-sm font-medium text-spotDark mb-2">
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spotRed"
              placeholder="Enter price"
              required
            />
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
              placeholder="Enter area"
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
              placeholder="Number of bedrooms"
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
              placeholder="Number of bathrooms"
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
              placeholder="Enter property description"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-spotDark mb-2">
              Images
            </label>
            <ImageUploader
              onUpload={handleImageUpload}
              images={images}
              onDelete={handleImageDelete}
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

        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
          <Button type="submit" className="bg-spotRed hover:bg-spotRed/90 text-white">
            Create Property
          </Button>
          <Link href="/admin/properties">
            <Button type="button" variant="outline" className="border-gray-300">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
