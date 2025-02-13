"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard, PackageOpen, Layers2, Cat, ShoppingCart, User, Star,
    LibraryBig, ShieldCheck, LogOut, Menu, ChevronLeft
} from "lucide-react";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";

const menuList = [
    { name: "Dashboard", link: "/admin", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Products", link: "/admin/products", icon: <PackageOpen className="h-5 w-5" /> },
    { name: "Categories", link: "/admin/categories", icon: <Layers2 className="h-5 w-5" /> },
    { name: "Brands", link: "/admin/brands", icon: <Cat className="h-5 w-5" /> },
    { name: "Orders", link: "/admin/orders", icon: <ShoppingCart className="h-5 w-5" /> },
    { name: "Customers", link: "/admin/customers", icon: <User className="h-5 w-5" /> },
    { name: "Reviews", link: "/admin/reviews", icon: <Star className="h-5 w-5" /> },
    { name: "Collections", link: "/admin/collections", icon: <LibraryBig className="h-5 w-5" /> },
    { name: "Admins", link: "/admin/admins", icon: <ShieldCheck className="h-5 w-5" /> },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setIsOpen(window.innerWidth >= 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (window.innerWidth <= 768) {
            setIsOpen(false);
        }
    }, [pathname]);

    const handleLogout = async () => {
        try {
            await toast.promise(signOut(auth), {
                error: (e) => e?.message,
                loading: "Processing...",
                success: "Logout Successfully"
            });
        } catch (error) {
            toast.error(error?.message);
        }
    };

    return (
        <div className={`h-screen ${isOpen ? "w-64" : "w-20"} bg-white shadow-lg flex flex-col transition-all duration-300 relative border-r`}>
            {/* Sidebar Toggle Button */}
            <button
                className="absolute top-4 right-[-12px] bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 transition"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <ChevronLeft size={18} /> : <Menu size={20} />}
            </button>

            {/* Logo */}
            <div className="flex items-center justify-center py-6 border-b">
                <Link href="/" className="flex items-center">
                    <Image src="/logo.webp" alt="Logo" width={isOpen ? 120 : 40} height={40} className="transition-all duration-300" />
                </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col space-y-2 px-3 mt-4">
                {menuList.map(({ name, link, icon }) => (
                    <Link
                        key={name}
                        href={link}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition ${pathname === link ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                        <span>{icon}</span>
                        {isOpen && <span className="font-medium">{name}</span>}
                    </Link>
                ))}
            </nav>

            {/* Logout Button */}
            <div className="mt-auto p-4 border-t">
                <button className="flex items-center space-x-3 p-3 text-red-600 hover:bg-red-100 rounded-lg w-full" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                    {isOpen && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </div>
    );
}
