import React, { useState } from "react";
import Container from "@/components/shared/Container";
import AdaptiveCard from "@/components/shared/AdaptiveCard";

const BrandCreate = () => {
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("image", image);

        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch("https://gamingear.premiumasp.net/api/Brands", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to create brand");

            setMessage("Brand created successfully!");
            setName("");
            setImage(null);
        } catch (error) {
            console.error("Error creating brand:", error);
            setMessage("Error creating brand. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <AdaptiveCard>
                <h3 className="text-lg font-semibold mb-4">Create Brand</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Brand Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Brand Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        {loading ? "Creating..." : "Create Brand"}
                    </button>
                </form>
                {message && <p className="mt-4 text-gray-800">{message}</p>}
            </AdaptiveCard>
        </Container>
    );
};

export default BrandCreate;