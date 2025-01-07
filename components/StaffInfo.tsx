import { IconCircleFilled } from "@tabler/icons-react";
import Image from "next/image";

function StaffInfo() {
	return (
		<div className="py-2 px-3 bg-white rounded-lg border border-[#E2E4E9]">
			<div className="flex flex-row justify-between items-center border-b-[1px] border-b-[#E2E4E9] py-2">
				<div className="flex flex-row justify-start gap-2 items-center">
					<Image src="/images/info.png" alt="info" width={20} height={20} />
					<p className="text-sm font-bold text-black">Staff Info</p>
				</div>
				<div className="flex flex-row justify-end gap-3 items-center">
					<div className="flex flex-row justify-start gap-1 items-center">
						<IconCircleFilled size={10} color="#6E3FF3" />
						<p className="text-sm font-normal text-[#6B7280] text-[12px]">
							Total
						</p>
					</div>
					<div className="flex flex-row justify-start gap-1 items-center">
						<IconCircleFilled size={10} color="#09A609" />
						<p className="text-sm font-normal text-[#6B7280] text-[12px]">
							Active
						</p>
					</div>
					<div className="flex flex-row justify-start gap-1 items-center">
						<IconCircleFilled size={10} color="#FF5000" />
						<p className="text-sm font-normal text-[#6B7280] text-[12px]">
							Inactive
						</p>
					</div>
				</div>
			</div>

			<div className="flex flex-row flex-wrap justify-start gap-[25px] lg:gap-[130px] items-center py-3">
				<div className="flex flex-row justify-start gap-2 items-center ">
					<Image src="/images/total.png" alt="total" width={40} height={40} />
					<div className="flex flex-col gap-0">
						<p className="text-primary-6 uppercase text-[11px] font-inter">
							total staff
						</p>
						<p className="text-[#0A0D14] font-inter">0</p>
					</div>{" "}
				</div>{" "}
				<div className="border-r-[1px] border-primary-6 hidden lg:flex">
					<p className="text-transparent">|</p>
				</div>
				<div className="flex flex-row justify-start gap-2 items-center ">
					<Image src="/images/active.png" alt="active" width={40} height={40} />
					<div className="flex flex-col gap-0">
						<p className="text-primary-6 uppercase text-[11px] font-inter">
							active staff
						</p>
						<p className="text-[#0A0D14] font-inter">0</p>
					</div>{" "}
				</div>{" "}
				<div className="border-r-[1px] border-primary-6 hidden lg:flex">
					<p className="text-transparent">|</p>
				</div>
				<div className="flex flex-row justify-start gap-2 items-center">
					<Image
						src="/images/inactive.png"
						alt="inactive"
						width={40}
						height={40}
					/>
					<div className="flex flex-col gap-0">
						<p className="text-primary-6 uppercase text-[11px] font-inter">
							inactive staff
						</p>
						<p className="text-[#0A0D14] font-inter">0</p>
					</div>{" "}
				</div>{" "}
			</div>
		</div>
	);
}

export default StaffInfo;
