'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';

const EditRole = () => {
    const router = useRouter();
    const { id } = useParams(); // Lấy ID từ URL
    const [values, setValues] = useState({
        name: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch dữ liệu role hiện tại
    useEffect(() => {
        const fetchRole = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/roles/${id}`);
                setValues(response.data);
            } catch (err) {
                setError('Failed to fetch role data.');
            }
        };
        if (id) fetchRole();
    }, [id]);

    // Xử lý thay đổi của input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    // Xử lý submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/roles/${id}`, values);

            if (response.status >= 200 && response.status < 300) {
                alert('Role updated successfully!');
                router.push('/admin/roles'); // Chuyển về danh sách roles
            } else {
                setError('Failed to update role, please try again.');
            }
        } catch (err) {
            setError('Update failed, please try again.');
        }

        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Edit Role</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit}>
                <label className="block mb-2 text-sm font-medium">
                    Role Name:
                    <input
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded"
                        required
                    />
                </label>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition mt-4"
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Update Role'}
                </button>
            </form>
        </div>
    );
};

export default EditRole;
