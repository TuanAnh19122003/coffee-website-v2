export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex">
            <aside className="w-64 bg-gray-800 text-white p-4">Sidebar User</aside>
            <main className="flex-1 p-6">
                <header className="bg-gray-700 text-white p-4">User Header</header>
                {children}
            </main>
        </div>
    );
}
