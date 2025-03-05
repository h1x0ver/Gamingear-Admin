import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Select } from "@/components/ui/select";
import Input from "@/components/ui/input";
import { RichTextEditor } from "@/components/shared";
import { useParams } from "react-router-dom";

const ProductEdit = () => {
    const { id } = useParams();
    const { control, handleSubmit, reset } = useForm();

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [colors, setColors] = useState([]);
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`https://gamingear.premiumasp.net/api/Products/${id}`);
                const data = await res.json();
                reset({
                    name: data.name,
                    price: data.price,
                    stockQuantity: data.stockQuantity,
                    categoryId: { value: data.categoryId, label: data.categoryName },
                    brandId: { value: data.brandId, label: data.brandName },
                    description: data.description,
                    moreDescription: data.moreDescription,
                    colors: data.colors || [],
                });
                setColors(data.colors || []);
                setImages(data.images || []);
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        };
        fetchData();
    }, [id, reset]);
    console.log(colors)

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        setImages((prev) => [...prev, ...files]);
    };

    const onSubmit = async (data) => {
        setLoading(true);
        const formData = new FormData();

        formData.append("id", id);
        formData.append("name", data.name);
        formData.append("price", data.price);
        formData.append("stockQuantity", data.stockQuantity);
        formData.append("description", data.description);
        formData.append("moreDescription", data.moreDescription);

        if (data.categoryId) formData.append("categoryId", data.categoryId.value);
        if (data.brandId) formData.append("brandId", data.brandId.value);



        data.colors?.forEach((color, index) => {
            formData.append(`colors[${index}]`, color   );
        });

        images.forEach((file, index) => {
            if (file instanceof File) {
                formData.append(`images`, file);
            } else {
                formData.append(`existingImages[${index}]`, file);
            }
        });

        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch("https://gamingear.premiumasp.net/api/Products", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });
            if (!response.ok) throw new Error("Failed to update product");
            console.log("Product updated successfully");
        } catch (error) {
            console.error("Network error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">Edit Product</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Controller name="name" control={control} render={({ field }) => <Input {...field} placeholder="Product Name" />} />
                <Controller name="price" control={control} render={({ field }) => <Input {...field} type="number" placeholder="Price" />} />
                <Controller name="stockQuantity" control={control} render={({ field }) => <Input {...field} type="number" placeholder="Stock Quantity" />} />
                <Controller name="categoryId" control={control} render={({ field }) => <Select options={categories} {...field} />} />
                <Controller name="brandId" control={control} render={({ field }) => <Select options={brands} {...field} />} />
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <RichTextEditor
                            key={field.value || ""}
                            content={field.value ?? "type text"}
                            defaultValue={field.value || ""}
                            onChange={({ html }) => field.onChange(html)}
                        />
                    )}
                />
                <Controller
                    name="moreDescription"
                    control={control}
                    render={({ field }) => (
                        <RichTextEditor
                            key={field.value || ""}
                            content={field.value || ""}
                            defaultValue={field.value || ""}
                            onChange={({ html }) => field.onChange(html)}
                        />
                    )}
                />
                <input type="file" multiple onChange={handleImageUpload} />
                <div className="flex flex-wrap gap-2 mt-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative w-24 h-24">
                            <img
                                src={image instanceof File ? URL.createObjectURL(image) : image}
                                alt="Uploaded preview"
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    ))}
                </div>
                <button type="submit" className="bg-blue-600 text-white py-2 px-5 rounded-lg hover:bg-blue-700 disabled:opacity-50" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
            </form>
        </div>
    );
};

export default ProductEdit;
