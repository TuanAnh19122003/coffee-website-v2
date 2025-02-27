'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const CreateRole = () => {
    const [values, setValues] = useState({
        name: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    // Xử lý thay đổi của input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value, // Cập nhật trường tương ứng
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/roles`, values);

            if (response.status >= 200 && response.status < 300) {
                alert('Role created successfully!');
                setValues({ name: ''});
                router.push('/admin/roles');
            } else {
                setError('Failed to create role, please try again.');
            }
        } catch (err) {
            setError('Submission failed, please try again.');
        }

        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Create New Role</h2>

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
                        placeholder="Enter role name"
                        required
                    />
                </label>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition mt-4"
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Role'}
                </button>
            </form>
        </div>
    );
};

export default CreateRole;
