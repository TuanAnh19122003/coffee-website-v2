import type { Metadata } from "next";
import "../styles/globals.css";
import { Poppins } from "next/font/google";
import '@ant-design/v5-patch-for-react-19';

const poppins = Poppins({ weight: ["300", "400", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Website Coffee",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Thêm link Google Fonts */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;700&display=swap"
        />
      </head>
      <body className={poppins.className}>
        {children}
      </body>
    </html>
  );
}
