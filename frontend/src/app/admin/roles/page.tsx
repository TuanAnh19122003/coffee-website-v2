    'use client'
    import axios from "axios";
    import Link from 'next/link';
    import { useEffect, useState } from 'react';

    interface Role{
        id: number;
        name: string;
    }

    const RoleManagent = () =>{
        const [data, setdata] = useState<Role[]>([]);
        const [error, setError] = useState();
        const [loading, setLoading] = useState(true);
        

        useEffect(()=>{
            const fetchData = async () =>{
                setLoading(true);
                try{
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/roles`);
                    setdata(response.data);
                }catch(error: any){
                    setError(error.message);
                }finally{
                    setLoading(false);
                }
            };
            fetchData();
        }, [])

        const handleDelete = async (roleId: number) => {
            const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa role này?");
            if (confirmDelete) {
                try {
                    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/roles/${roleId}`);
                    alert("Role đã bị xóa thành công!");
                    window.location.reload(); // Tải lại danh sách sau khi xóa
                } catch (error) {
                    alert("Lỗi khi xóa role! Vui lòng thử lại.");
                }
            }
        };
        

        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error: {error}</p>;

        return (
            <div>
                <h2>Roles</h2>
                <Link href={`roles/create`}>Add New Role</Link>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(role => (
                            <tr key={role.id}>
                                <td>{role.id}</td>
                                <td><Link href={`/roles/${role.id}`}>{role.name}</Link></td>
                                <td>
                                    <Link href={`/admin/roles/edit/${role.id}`}>Edit</Link>

                                    <Link 
                                        href='#'
                                        onClick={(e) => { e.preventDefault(); handleDelete(role.id); }}>
                                            Delete
                                    </Link>
                                    <Link href={`/admin/roles/detail/${role.id}`}>Detail</Link>
                                </td>
                            </tr>
                            
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    export default RoleManagent;