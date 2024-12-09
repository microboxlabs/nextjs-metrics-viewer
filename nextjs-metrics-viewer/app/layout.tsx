import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { Providers } from "./Providers";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar/>
        <Providers>
          <div>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
