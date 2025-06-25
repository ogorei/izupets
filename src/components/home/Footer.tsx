import Image from 'next/image';
import Link from 'next/link';


interface FooterProps {
  logo: string;
}

export default function Footer ({ logo }: FooterProps) {
  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto flex flex-col items-center">
        {/* Logo */}
        <div className="mb-4">
          <Image
            src={logo}
            alt="Logo"
            width={150}
            height={100}
            priority
          />
        </div>
        {/* Menu Area */}
        <div className="w-full max-w-screen-md">
          <ul className="flex flex-col lg:flex-row justify-center gap-6 text-center">
            <li>
              <ul className="flex flex-col items-center lg:flex-row gap-4">
                <li>
                  <Link href="https://liff.line.me/1645278921-kWRPP32q/?accountId=571ewako" target="_blank" className="flex items-center gap-2 text-gray-700 hover:underline">
                    <Image
                      src="https://heren.website/wp-content/themes/heren/assets/image/icon_line.svg"
                      alt="LINE"
                      width={24}
                      height={24}
                    />
                    <span>LINE</span>
                  </Link>
                </li>
                <li>
                  <Link href="https://www.instagram.com/heren_kobesanda/" target="_blank" className="flex items-center gap-2 text-gray-700 hover:underline">
                    <Image
                      src="https://heren.website/wp-content/themes/heren/assets/image/icon_insta.svg"
                      alt="INSTAGRAM"
                      width={24}
                      height={24}
                    />
                    <span>INSTAGRAM</span>
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
