export default function Sidebar() {
    return (
        <aside className="w-64 h-screen bg-gray-900 text-white p-4">
            <ul className="space-y-4">
                <li><a href="/admin/dashboard" className="block py-2 px-4 hover:bg-gray-700 rounded">Dashboard</a></li>
                <li><a href="/admin/users" className="block py-2 px-4 hover:bg-gray-700 rounded">Users</a></li>
                <li><a href="/admin/roles" className="block py-2 px-4 hover:bg-gray-700 rounded">Role</a></li>
                <li><a href="/admin/products" className="block py-2 px-4 hover:bg-gray-700 rounded">Products</a></li>
            </ul>
        </aside>
    );
}
