import Navbar from "@/components/admin/navbar";
import Sidebar from "@/components/admin/sidebar";
import Footer from "@/components/admin/footer";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 p-6">{children}</main>
                <Footer />
            </div>
        </div>
    );
}
