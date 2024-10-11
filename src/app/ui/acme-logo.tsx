import { CameraIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <CameraIcon className="h-11 w-11 rotate-[-5deg]" />
      <p className="text-[44px]">Acme</p>
    </div>
  );
}