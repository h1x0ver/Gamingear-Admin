import React, { useEffect, useState } from "react";
import Container from "@/components/shared/Container";
import AdaptiveCard from "@/components/shared/AdaptiveCard";

const BrandList = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://gamingear.premiumasp.net/api/Brands?PageIndex=0&PageSize=50")
            .then((response) => response.json())
            .then((data) => {
                setBrands(data.items || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching brands:", error);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this brand?")) return;

        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`https://gamingear.premiumasp.net/api/Brands/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (!response.ok) throw new Error("Failed to delete brand");

            setBrands(brands.filter((brand) => brand.id !== id));
        } catch (error) {
            console.error("Error deleting brand:", error);
        }
    };

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-semibold">Brands</h3>
                    {loading ? (
                        <p>Loading...</p>
                    ) : brands.length === 0 ? (
                        <p className="text-gray-600">No brands found.</p>
                    ) : (
                        <div className="space-y-4">
                            {brands.map((brand) => (
                                <div key={brand.id} className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-gray-100">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={brand.image}
                                            alt={brand.name}
                                            className="w-24 h-24 rounded-lg object-cover"
                                        />
                                        <span className="text-lg font-medium text-gray-800">{brand.name}</span>
                                    </div>
                                    <button onClick={() => handleDelete(brand.id)} className="text-red-600 hover:text-red-800">
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

export default BrandList;