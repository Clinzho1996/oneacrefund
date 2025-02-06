import HeaderBox from "@/components/HeaderBox";
import DeviceTable from "@/config/device-columns";
import PostingTable from "@/config/posting-columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import Image from "next/image";

function DeviceManagement() {
	return (
		<div>
			<HeaderBox />
			<div className="bg-[#F6F8FA] flex flex-col h-full px-4 py-2">
				<div
					className="bg-white flex flex-row border-[1px] border-[#E2E4E9] justify-between items-center p-3"
					style={{
						borderTopLeftRadius: "0.5rem",
						borderTopRightRadius: "0.5rem",
					}}>
					<div>
						<div className="flex flex-row justify-start items-center gap-2">
							<Image
								src="/images/staffm.png"
								alt="staff management"
								height={20}
								width={20}
							/>
							<p className="text-sm text-dark-1 font-medium font-inter">
								Device Management
							</p>
						</div>

						<p className="text-xs text-primary-6 mt-3">
							Here is an overview of all the project
						</p>
					</div>
				</div>
				{/* <DeviceTable /> */}

				<div className="w-full bg-white mt-5 rounded-lg py-5">
					<Tabs defaultValue="device" className="bg-transparent">
						<TabsList className="flex flex-row h-fit flex-wrap justify-start bg-[#EFF1F5] w-fit ml-4 mr-4 gap-3 items-center border-[1px] border-[#E2E4E9] rounded-lg">
							<TabsTrigger
								value="device"
								className="p-2 rounded-md data-[state=active]:bg-[#ECFAF6] data-[state=active]:text-primary-6">
								Device Administration
							</TabsTrigger>
							|
							<TabsTrigger
								value="posting"
								className="p-2 rounded-md data-[state=active]:bg-[#ECFAF6] data-[state=active]:text-primary-6">
								Posting Devices
							</TabsTrigger>
						</TabsList>

						<div className="w-full px-4 mt-[100px] lg:mt-0">
							<TabsContent value="device">
								<DeviceTable />
							</TabsContent>
							<TabsContent value="posting">
								<PostingTable />
							</TabsContent>
						</div>
					</Tabs>
				</div>
			</div>
		</div>
	);
}

export default DeviceManagement;
