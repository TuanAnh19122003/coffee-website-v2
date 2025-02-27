'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

const DetailRole = () => {
    const { id } = useParams();
    const router = useRouter();
    const [role, setRole] = useState<{ id: number; name: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch dữ liệu role từ API
    useEffect(() => {
        const fetchRole = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/roles/${id}`);
                setRole(response.data);
            } catch (err) {
                setError('Failed to fetch role details.');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchRole();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Role Details</h2>

            {role ? (
                <div>
                    <p><strong>ID:</strong> {role.id}</p>
                    <p><strong>Name:</strong> {role.name}</p>
                </div>
            ) : (
                <p>No role found.</p>
            )}

            <button
                onClick={() => router.push('/admin/roles')}
                className="mt-4 w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition"
            >
                Back to Roles
            </button>
        </div>
    );
};

export default DetailRole;
