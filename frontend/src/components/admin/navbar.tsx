export default function Navbar() {
    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between">
            <div className="text-lg font-bold">Admin Panel</div>
            <div>
                <button className="px-4 py-2 bg-gray-700 rounded">Logout</button>
            </div>
        </nav>
    );
}
