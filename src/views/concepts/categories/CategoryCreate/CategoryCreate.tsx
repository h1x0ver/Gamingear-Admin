import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Input from "@/components/ui/Input";
import Container from "@/components/shared/Container";

const CategoryCreate = () => {
    const { control, handleSubmit, reset, setValue } = useForm({
        defaultValues: {
            name: "",
            image: null,
        },
    });

    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setValue("image", file);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("name", data.name);
        if (image) {
            formData.append("image", image);
        }

        try {
            const token = localStorage.getItem("accessToken");

            const response = await fetch("https://gamingear.premiumasp.net/api/Categories", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to create category");

            console.log("Category created successfully");
            reset();
            setImage(null);
        } catch (error) {
            console.error("Network error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
       <Container>
           <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md">

               <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                   <Controller
                       name="name"
                       control={control}
                       render={({ field }) => <Input {...field} placeholder="Category Name" className="p-3 border rounded-lg w-full" />}
                   />

                   <div className="space-y-3">
                       <label className="font-medium">Upload Image</label>
                       <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full p-2 border rounded-lg" />
                       {image && (
                           <div className="relative group">
                               <img src={URL.createObjectURL(image)} alt="Uploaded" className="w-full h-100 object-cover rounded-lg" />
                           </div>
                       )}
                   </div>

                   <div className="flex justify-end space-x-4">
                       <button
                           type="button"
                           onClick={() => {
                               reset();
                               setImage(null); // Очищаем состояние загруженного изображения
                           }}
                           className="bg-gray-300 text-black py-2 px-5 rounded-lg hover:bg-gray-400"
                           disabled={loading}
                       >Discard</button>
                       <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 px-5 rounded-lg hover:bg-blue-700 disabled:opacity-50">{loading ? "Creating..." : "Create Category"}</button>
                   </div>
               </form>
           </div>
       </Container>
    );
};

export default CategoryCreate;
