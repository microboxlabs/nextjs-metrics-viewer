import { Providers } from "../Providers";

export default function NavbarLessLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Providers>
        {children}
      </Providers>
    </div>
  );
}