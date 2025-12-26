import Image from "next/image";
import Link from "next/link";
import errIcon from "../../assets/icons/404_Icon.svg";

export default function NotFound() {
  return (
    <div className="bg-[#37526B]">
      <div className="mx-auto w-full max-w-[1440px] pt-[90px] text-center">
        <div className="mb-[38px]">
          <Image
            className="mx-auto"
            src={errIcon}
            alt="404 Error Icon"
            width={242}
            height={242}
            priority
          />
        </div>

        <div className="font-['Poppins'] text-[#FFFFFF] font-medium text-[30px] mb-[15px] leading-[30px]">
            Page not found.
        </div>

        <div className="font-['Poppins'] mx-auto mb-[18px] w-[200px] md:w-auto font-normal text-[16px] leading-[16px] md:leading-[25px] tracking-[0.02em] text-white">
            Looks like you got a little turned around.
        </div>

        <div className="pb-[90px]">
          <Link
            href="/"
            className="font-['Poppins'] inline-block h-[57px] w-[176px] rounded-[5px] bg-[#4D889E] px-[30px] py-[12px] text-center text-[16px] leading-[32px] font-semibold uppercase text-white no-underline"
          >
            RETURN HOME
          </Link>
        </div>
      </div>
    </div>
  );
}
