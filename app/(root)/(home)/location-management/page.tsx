"use client";

import HeaderBox from "@/components/HeaderBox";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import DistrictTable from "@/config/district-columns";
import GroupTable from "@/config/group-columns";
import PodTable from "@/config/pod-columns";
import SiteTable from "@/config/site-columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { IconPlus } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";

function LocationManagement() {
	const [isModalOpen, setModalOpen] = useState(false);
	const openModal = () => {
		// Use row.original to store the full row data
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
	};
	return (
		<div>
			<HeaderBox />
			<Modal
				isOpen={isModalOpen}
				onClose={closeModal}
				title="Add Location"
				className="w-[500px]">
				<div className="bg-white py-5 rounded-lg transition-transform ease-in-out ">
					<hr className="mb-4 text-[#9F9E9E40]" color="#9F9E9E40" />
					<div className="mt-3  pt-2">
						<p className="text-xs text-primary-6 font-inter">
							Location Preference
						</p>
						<RadioGroup defaultValue="group">
							<div className="flex flex-row justify-between items-center gap-5">
								<div className="flex flex-row justify-start items-center gap-2 shadow-md p-2 rounded-lg w-full mt-2">
									<RadioGroupItem value="group" id="group" />
									<p className="text-sm text-primary-6 whitespace-nowrap">
										Group
									</p>
								</div>
								<div className="flex flex-row justify-start items-center gap-2 shadow-md p-2 rounded-lg w-full mt-2">
									<RadioGroupItem value="site" id="site" />
									<p className="text-sm text-primary-6 whitespace-nowrap">
										Site
									</p>
								</div>
								<div className="flex flex-row justify-start items-center gap-2 shadow-md p-2 rounded-lg w-full mt-2">
									<RadioGroupItem value="pod" id="pod" />
									<p className="text-sm text-primary-6 whitespace-nowrap">
										POD / Sector
									</p>
								</div>
								<div className="flex flex-row justify-start items-center gap-2 shadow-md p-2 rounded-lg w-full mt-2">
									<RadioGroupItem value="district" id="district" />
									<p className="text-sm text-primary-6 whitespace-nowrap">
										District
									</p>
								</div>
							</div>
						</RadioGroup>
						<div className="flex flex-col gap-2 mt-4">
							<p className="text-xs text-primary-6 font-inter">State</p>
							<Input
								type="text"
								className="focus:border-primary-1 mt-2 h-5 border-[#E8E8E8] border-[1px]"
							/>
							<p className="text-xs text-primary-6 mt-2 font-inter">District</p>
							<Input
								type="text"
								className="focus:border-primary-1 mt-2 h-5 border-[#E8E8E8] border-[1px]"
							/>
							<p className="text-xs text-primary-6 mt-2 font-inter">
								POD / Sector
							</p>
							<Input
								type="text"
								className="focus:border-primary-1 mt-2 h-5 border-[#E8E8E8] border-[1px]"
							/>
							<p className="text-xs text-primary-6 mt-2 font-inter">
								Site Name
							</p>
							<Input
								type="text"
								className="focus:border-primary-1 mt-2 h-5 border-[#E8E8E8] border-[1px]"
							/>
							<p className="text-xs text-primary-6 mt-2 font-inter">
								Group Name
							</p>
							<Input
								type="text"
								className="focus:border-primary-1 mt-2 h-5 border-[#E8E8E8] border-[1px]"
							/>
						</div>
						<hr className="mt-4 mb-4 text-[#9F9E9E40]" color="#9F9E9E40" />
						<div className="flex flex-row justify-end items-center gap-3 font-inter">
							<Button
								className="border-[#E8E8E8] border-[1px] text-primary-6 text-xs"
								onClick={closeModal}>
								Cancel
							</Button>
							<Button className="bg-primary-1 text-white font-inter text-xs">
								Add
							</Button>
						</div>
					</div>
				</div>
			</Modal>
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
					<Button
						className="bg-primary-1 text-white font-inter"
						onClick={openModal}>
						<IconPlus /> Add Location
					</Button>
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
