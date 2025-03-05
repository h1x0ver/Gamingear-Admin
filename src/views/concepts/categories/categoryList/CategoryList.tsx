

import React, { useEffect, useState } from "react";
import Container from "@/components/shared/Container";
import AdaptiveCard from "../../../../components/shared/AdaptiveCard";
import CategoryListActionTools from "@/views/concepts/categories/categoryList/CategoryListActionTools";

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
            fetch("https://gamingear.premiumasp.net/api/Categories?PageIndex=0&PageSize=50")
            .then((response) => response.json())
            .then((data) => {
                setCategories(data.items || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
                setLoading(false);
            });
    }, []);
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`https://gamingear.premiumasp.net/api/Categories/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to delete category");

            setCategories(categories.filter((category) => category.id !== id));
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    return (
       <Container >

           <AdaptiveCard>
               <div className="flex flex-col gap-4">
                   <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                       <h3>Products</h3>
                       <CategoryListActionTools />
                   </div>
                       {loading ? (
                           <p>Loading...</p>
                       ) : categories.length === 0 ? (
                           <p className="text-gray-600">No categories found.</p>
                       ) : (
                           <div className="space-y-4">
                               {categories.map((category) => (
                                   <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-gray-100">
                                       <div className="flex items-center space-x-4">
                                           <img
                                               src={category.image }
                                               alt={category.name}
                                               className="w-24 h-24 rounded-lg object-cover"
                                           />
                                           <span className="text-lg font-medium text-gray-800">{category.name}</span>
                                       </div>
                                       <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-800">
                                           x
                                       </button>
                                   </div>
                               ))}
                           </div>
                       )}
               </div>
           </AdaptiveCard>

       </Container>
    );
};

export default CategoryList;

