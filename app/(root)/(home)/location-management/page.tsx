"use client";

import HeaderBox from "@/components/HeaderBox";
import DistrictTable from "@/config/district-columns";
import GroupTable from "@/config/group-columns";
import PodTable from "@/config/pod-columns";
import SiteTable from "@/config/site-columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import Image from "next/image";

function LocationManagement() {
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
								Location Management
							</p>
						</div>

						<p className="text-xs text-primary-6 mt-3">
							Configure and manage your geographic location you can operate in.
						</p>
					</div>
				</div>
				{/* <DeviceTable /> */}

				<div className="w-full bg-white rounded-b-lg py-5 border-x-[1px] border-b-[1px] border-[#E2E4E9]">
					<Tabs defaultValue="group" className="bg-transparent">
						<TabsList className="flex flex-row h-fit flex-wrap justify-start bg-[#fff] w-fit ml-4 mr-4 gap-3 items-center border-[1px] border-[#E2E4E9] rounded-lg">
							<TabsTrigger
								value="group"
								className="p-2 rounded-md data-[state=active]:bg-[#ECFAF6] data-[state=active]:text-primary-6 text-sm">
								Group
							</TabsTrigger>
							|
							<TabsTrigger
								value="site"
								className="p-2 rounded-md data-[state=active]:bg-[#ECFAF6] data-[state=active]:text-primary-6 text-sm">
								Site
							</TabsTrigger>{" "}
							|
							<TabsTrigger
								value="pod"
								className="p-2 rounded-md data-[state=active]:bg-[#ECFAF6] data-[state=active]:text-primary-6 text-sm">
								POD / Sector
							</TabsTrigger>{" "}
							|
							<TabsTrigger
								value="district"
								className="p-2 rounded-md data-[state=active]:bg-[#ECFAF6] data-[state=active]:text-primary-6 text-sm">
								District
							</TabsTrigger>
						</TabsList>

						<div className="w-full px-4 mt-[100px] lg:mt-0">
							<TabsContent value="group">
								<GroupTable />
							</TabsContent>
							<TabsContent value="site">
								<SiteTable />
							</TabsContent>
							<TabsContent value="pod">
								<PodTable />
							</TabsContent>
							<TabsContent value="district">
								<DistrictTable />
							</TabsContent>
						</div>
					</Tabs>
				</div>
			</div>
		</div>
	);
}

export default LocationManagement;
