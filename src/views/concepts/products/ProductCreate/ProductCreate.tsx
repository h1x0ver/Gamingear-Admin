


import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Select } from "@/components/ui/select";
import Input from "@/components/ui/input";
import {RichTextEditor} from "@/components/shared";
import ImageSection from "@/views/concepts/products/ProductForm/components/ImageSection";

const ProductCreate = () => {
    const { control, handleSubmit, reset, setValue } = useForm({
        defaultValues: {
            name: "",
            price: "",
            stockQuantity: "",
            categoryId: null,
            brandId: null,
            description: "",
            moreDescription: "",
            colors: [],
            attributes: [],
            images: [],
        },
    });

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [attributes, setAttributes] = useState([{ key: "", value: "" }]);
    const [colors, setColors] = useState([{ color: "" }]);
    const [images, setImages] = useState([]);

    useEffect(() => setValue("attributes", attributes), [attributes, setValue]);
    useEffect(() => setValue("colors", colors), [colors, setValue]);
    useEffect(() => setValue("images", images), [images, setValue]);

    const { formState: { errors } } = useForm({
        defaultValues: {
            Images: [],
        },
    })
    const handleImagesChange = (event) => {
        const files = Array.from(event.target.files);
        setImages((prev) => [...prev, ...files]);
    };

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        const fetchData = async (url, setter) => {
            try {
                const res = await fetch(url);
                const data = await res.json();
                setter(data.items.map((item) => ({ value: item.id, label: item.name })));
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        fetchData("https://gamingear.premiumasp.net/api/Categories?PageIndex=0&PageSize=50", setCategories);
        fetchData("https://gamingear.premiumasp.net/api/Brands?PageIndex=0&PageSize=50", setBrands);
    }, []);

    const onSubmit = async (data) => {
        setLoading(true);
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (key === "categoryId" || key === "brandId") {
                formData.append(key, value?.value);
            } else if (key === "attributes") {
                value.forEach((attr, index) => {
                    formData.append(`attributes[${index}].key`, attr.key);
                    formData.append(`attributes[${index}].value`, attr.value);
                });
            } else if (key === "colors") {
                value.forEach((color, index) => formData.append(`colors[${index}]`, color.color));
            } else {
                formData.append(key, value);
            }
        });

        images.forEach((image) => formData.append("images", image));

        try {
            const token = localStorage.getItem("accessToken");

            const response = await fetch("https://gamingear.premiumasp.net/api/Products", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to create product");

            console.log("Product created successfully");
            reset();
            setImages([]);
        } catch (error) {
            console.error("Network error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">Create New Product</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Controller name="name" control={control} render={({ field }) => <Input {...field} placeholder="Product Name" className="p-3 border rounded-lg w-full" />} />

                <div className="grid grid-cols-3 gap-4">
                    <Controller name="price" control={control} render={({ field }) => <Input {...field} type="number" placeholder="Qiymet" className="p-3 border rounded-lg w-full" />} />
                    <Controller name="stockQuantity" control={control} render={({ field }) => <Input {...field} type="number" placeholder="Stock sayi" className="p-3 border rounded-lg w-full" />} />
                </div>

                <Controller name="categoryId" control={control} render={({ field }) => <Select options={categories} placeholder="Select Category" {...field} className="p-3 border rounded-lg w-full" />} />
                <Controller name="brandId" control={control} render={({ field }) => <Select options={brands} placeholder="Select Brand" {...field} className="p-3 border rounded-lg w-full" />} />

                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <RichTextEditor
                            content={field.value}
                            onChange={({ html }) => field.onChange(html)}
                        />
                    )}
                />
                <Controller
                    name="moreDescription"
                    control={control}
                    render={({ field }) => (
                        <RichTextEditor
                            content={field.value}
                            onChange={({ html }) => field.onChange(html)}
                        />
                    )}
                />

                {/* Атрибуты */}
                <div className="space-y-6">
                    {/* Atributlar */}
                    <div>
                        <h3 className="text-lg font-medium">Atributlar</h3>
                        <div className="space-y-2">
                            {attributes.map((attr, index) => (
                                <div key={index} className="flex space-x-2 items-center">
                                    <Input
                                        value={attr.key}
                                        onChange={(e) => {
                                            const updated = [...attributes];
                                            updated[index].key = e.target.value;
                                            setAttributes(updated);
                                        }}
                                        placeholder="key"
                                    />

                                    <Input
                                        value={attr.value}
                                        onChange={(e) => {
                                            const updated = [...attributes];
                                            updated[index].value = e.target.value;
                                            setAttributes(updated);
                                        }}
                                        placeholder="value"
                                    />

                                    <button
                                        type="button"
                                        className="p-2 text-red-500 hover:text-red-700"
                                        onClick={() => setAttributes(attributes.filter((_, i) => i !== index))}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            className="mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-800"
                            onClick={() => setAttributes([...attributes, { key: "", value: "" }])}
                        >
                            + Atribut əlavə edin
                        </button>
                    </div>

                    {/* Rənglər */}
                    <div>
                        <h3 className="text-lg font-medium">Rənglər</h3>
                        <div className="space-y-2">
                            {colors.map((color, index) => (
                                <div key={index} className="flex space-x-2 items-center">
                                    <Input
                                        value={color.color}
                                        onChange={(e) => {
                                            const updated = [...colors];
                                            updated[index].color = e.target.value;
                                            setColors(updated);
                                        }}
                                        placeholder="Reng qeyd edin"
                                    />

                                    <button
                                        type="button"
                                        className="p-2 text-red-500 hover:text-red-700"
                                        onClick={() => setColors(colors.filter((_, i) => i !== index))}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            className="mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-800"
                            onClick={() => setColors([...colors, { color: "" }])}
                        >
                            + Rəng əlavə edin
                        </button>
                    </div>
                </div>
                {/* Цвета */}


                <div className="space-y-3">
                    <label className="font-medium">Upload Images</label>
                    <input type="file" multiple onChange={handleImagesChange} className="block w-full p-2 border rounded-lg" />
                    <div className="grid grid-cols-3 gap-3">
                        {images.map((image, index) => (
                            <div key={index} className="relative group">
                                <img src={URL.createObjectURL(image)} alt="Uploaded" className="w-full h-32 object-cover rounded-lg" />
                                <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100">✕</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <button type="button" onClick={() => reset()} className="bg-gray-300 text-black py-2 px-5 rounded-lg hover:bg-gray-400" disabled={loading}>Discard</button>
                    <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 px-5 rounded-lg hover:bg-blue-700 disabled:opacity-50">{loading ? "Creating..." : "Create Product"}</button>
                </div>

                {/*<ImageSection control={control} errors={errors} />*/}
            </form>
        </div>
    );
};

export default ProductCreate;

